import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as mq from 'aws-cdk-lib/aws-amazonmq';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { EnvironmentProvider } from '../../providers/environment-provider';

export interface AmazonMQConstructProps {
  provider: EnvironmentProvider;
  vpc: ec2.Vpc;
  securityGroup: ec2.SecurityGroup;
}

/**
 * Amazon MQ Construct - Handles message broker infrastructure
 * Supports both RabbitMQ and ActiveMQ engines
 */
export class AmazonMQConstruct extends Construct {
  public readonly broker: mq.CfnBroker;
  public readonly credentials: secretsmanager.Secret;
  private readonly provider: EnvironmentProvider;

  constructor(scope: Construct, id: string, props: AmazonMQConstructProps) {
    super(scope, id);

    this.provider = props.provider;

    // Create broker credentials
    this.credentials = this.createBrokerCredentials();

    // Create Amazon MQ broker
    this.broker = this.createBroker(props.vpc, props.securityGroup);

    // Export broker endpoints
    this.exportBrokerEndpoints();
  }

  private createBrokerCredentials(): secretsmanager.Secret {
    return new secretsmanager.Secret(this, 'BrokerCredentials', {
      secretName: `ecommerce/amazonmq/credentials/${this.provider.environment}`,
      description: 'Amazon MQ broker credentials',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'ecommerce' }),
        generateStringKey: 'password',
        excludeCharacters: '"@/\\\'',
        passwordLength: 16,
      },
    });
  }

  private createBroker(vpc: ec2.Vpc, securityGroup: ec2.SecurityGroup): mq.CfnBroker {
    const brokerName = `ecommerce-mq-${this.provider.environment}`;
    
    // Get subnet IDs for broker deployment
    const subnetIds = this.getBrokerSubnetIds(vpc);

    const broker = new mq.CfnBroker(this, 'Broker', {
      brokerName,
      engineType: 'RabbitMQ',
      engineVersion: '3.11.20', // Latest supported version
      hostInstanceType: this.provider.getAmazonMQInstanceType(),
      deploymentMode: this.provider.isProduction() ? 'CLUSTER_MULTI_AZ' : 'SINGLE_INSTANCE',
      
      // Network configuration
      subnetIds: this.provider.isProduction() ? subnetIds : [subnetIds[0]],
      securityGroups: [securityGroup.securityGroupId],
      publiclyAccessible: this.provider.shouldExposePublicly(),

      // Storage and maintenance
      storageType: this.provider.isProduction() ? 'EFS' : 'EBS',
      autoMinorVersionUpgrade: true,
      maintenanceWindowStartTime: {
        dayOfWeek: 'Sunday',
        timeOfDay: '03:00',
        timeZone: 'UTC',
      },

      // Authentication
      authenticationStrategy: 'SIMPLE',
      users: [{
        username: 'ecommerce',
        password: this.credentials.secretValueFromJson('password').unsafeUnwrap(),
        consoleAccess: true,
        groups: ['admin'],
      }],

      // Configuration for RabbitMQ
      configuration: this.createBrokerConfiguration(),

      // Logs
      logs: {
        general: true,
        audit: this.provider.isProduction(),
      },

      // Encryption
      encryptionOptions: this.provider.isProduction() ? {
        useAwsOwnedKey: false,
        kmsKeyId: 'alias/aws/mq',
      } : undefined,

      // Tags
      tags: [
        { key: 'Environment', value: this.provider.environment },
        { key: 'Service', value: 'ecommerce' },
        { key: 'Component', value: 'messaging' },
      ],
    });

    return broker;
  }

  private getBrokerSubnetIds(vpc: ec2.Vpc): string[] {
    const subnetType = this.provider.shouldUseIsolatedSubnets()
      ? ec2.SubnetType.PRIVATE_ISOLATED
      : ec2.SubnetType.PRIVATE_WITH_EGRESS;

    return vpc.selectSubnets({ subnetType }).subnetIds;
  }

  private createBrokerConfiguration(): mq.CfnBroker.ConfigurationIdProperty {
    const configuration = new mq.CfnConfiguration(this, 'Configuration', {
      name: `ecommerce-mq-config-${this.provider.environment}`,
      description: 'RabbitMQ configuration for ecommerce platform',
      engineType: 'RabbitMQ',
      engineVersion: '3.11.20',
      
      // RabbitMQ configuration
      data: this.getRabbitMQConfiguration(),
    });

    return {
      id: configuration.attrId,
      revision: 1,
    };
  }

  private getRabbitMQConfiguration(): string {
    // RabbitMQ configuration optimized for ecommerce workloads
    const config = {
      // Connection limits
      'connection_max': this.provider.isProduction() ? 1000 : 100,
      'channel_max': this.provider.isProduction() ? 2000 : 200,
      
      // Memory and disk limits
      'vm_memory_high_watermark': 0.8,
      'disk_free_limit': '1GB',
      
      // Queue settings
      'default_vhost': 'ecommerce',
      'default_user': 'ecommerce',
      'default_permissions': {
        'configure': '.*',
        'write': '.*',
        'read': '.*',
      },

      // Logging
      'log.console': 'true',
      'log.console.level': this.provider.isProduction() ? 'info' : 'debug',
      'log.file': 'false',

      // Management plugin
      'management.tcp.port': 15672,
      'management.load_definitions': '/tmp/definitions.json',

      // Clustering (for production)
      ...(this.provider.isProduction() && {
        'cluster_formation.peer_discovery_backend': 'aws',
        'cluster_formation.aws.region': this.provider.region,
        'cluster_formation.aws.use_autoscaling_group': 'true',
      }),
    };

    return Buffer.from(JSON.stringify(config, null, 2)).toString('base64');
  }

  private exportBrokerEndpoints(): void {
    // Export broker endpoints for other services to use
    new ssm.StringParameter(this, 'BrokerEndpoint', {
      parameterName: `/ecommerce/${this.provider.environment}/amazonmq/endpoint`,
      stringValue: this.broker.attrAmqpEndpoints[0],
      description: 'Amazon MQ AMQP endpoint',
    });

    new ssm.StringParameter(this, 'BrokerConsoleUrl', {
      parameterName: `/ecommerce/${this.provider.environment}/amazonmq/console-url`,
      stringValue: `https://${this.broker.ref}.mq.${this.provider.region}.amazonaws.com`,
      description: 'Amazon MQ management console URL',
    });

    new ssm.StringParameter(this, 'BrokerCredentialsArn', {
      parameterName: `/ecommerce/${this.provider.environment}/amazonmq/credentials-arn`,
      stringValue: this.credentials.secretArn,
      description: 'Amazon MQ credentials secret ARN',
    });
  }
}