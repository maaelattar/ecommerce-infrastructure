import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { EnvironmentProvider } from '../../providers/environment-provider';

export interface DatabaseConstructProps {
  provider: EnvironmentProvider;
  vpc: ec2.Vpc;
  securityGroup: ec2.SecurityGroup;
}

/**
 * Database Construct - Handles all RDS database instances
 * Single Responsibility: Database infrastructure only
 */
export class DatabaseConstruct extends Construct {
  public readonly databases: Map<string, rds.DatabaseInstance> = new Map();
  private readonly provider: EnvironmentProvider;
  private readonly vpc: ec2.Vpc;
  private readonly securityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: DatabaseConstructProps) {
    super(scope, id);

    this.provider = props.provider;
    this.vpc = props.vpc;
    this.securityGroup = props.securityGroup;

    // Create subnet group
    const subnetGroup = this.createSubnetGroup();
    
    // Create databases for each microservice
    this.createMicroserviceDatabases(subnetGroup);
  }

  private createSubnetGroup(): rds.SubnetGroup {
    const subnetType = this.provider.shouldUseIsolatedSubnets() 
      ? ec2.SubnetType.PRIVATE_ISOLATED
      : ec2.SubnetType.PRIVATE_WITH_EGRESS;

    return new rds.SubnetGroup(this, 'SubnetGroup', {
      vpc: this.vpc,
      description: 'Subnet group for RDS databases',
      vpcSubnets: { subnetType },
      subnetGroupName: `ecommerce-db-subnet-group-${this.provider.environment}`,
    });
  }  private createMicroserviceDatabases(subnetGroup: rds.SubnetGroup) {
    const services = ['user-service', 'product-service', 'order-service', 'payment-service', 'inventory-service'];

    services.forEach(serviceName => {
      const dbConfig = this.provider.getDatabaseConfig(serviceName);
      
      // Create master user secret
      const secret = new secretsmanager.Secret(this, `${serviceName}-credentials`, {
        secretName: `ecommerce/${this.provider.environment}/${serviceName}/db-credentials`,
        description: `Database credentials for ${serviceName}`,
        generateSecretString: {
          secretStringTemplate: JSON.stringify({ username: 'admin' }),
          generateStringKey: 'password',
          excludeCharacters: '"@/\\',
        },
      });

      // Create RDS instance
      const database = new rds.DatabaseInstance(this, `${serviceName}-database`, {
        engine: rds.DatabaseInstanceEngine.postgres({
          version: rds.PostgresEngineVersion.VER_14
        }),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
        credentials: rds.Credentials.fromSecret(secret),
        databaseName: serviceName.replace('-', '_'),
        allocatedStorage: dbConfig.allocatedStorage,
        storageEncrypted: dbConfig.encryptionAtRest,
        multiAz: dbConfig.multiAZ,
        deletionProtection: dbConfig.deletionProtection,
        backupRetention: Duration.days(dbConfig.backupRetention),
        vpc: this.vpc,
        subnetGroup,
        securityGroups: [this.securityGroup],
        removalPolicy: this.provider.getRemovalPolicy(),
      });

      this.databases.set(serviceName, database);
      this.createDatabaseParameters(serviceName, database);
    });
  }

  private createDatabaseParameters(serviceName: string, database: rds.DatabaseInstance) {
    new ssm.StringParameter(this, `${serviceName}-db-endpoint`, {
      parameterName: `/ecommerce/${this.provider.environment}/${serviceName}/database/endpoint`,
      stringValue: database.instanceEndpoint.hostname,
    });

    new ssm.StringParameter(this, `${serviceName}-db-port`, {
      parameterName: `/ecommerce/${this.provider.environment}/${serviceName}/database/port`,
      stringValue: database.instanceEndpoint.port.toString(),
    });

    new ssm.StringParameter(this, `${serviceName}-db-name`, {
      parameterName: `/ecommerce/${this.provider.environment}/${serviceName}/database/name`,
      stringValue: serviceName.replace('-', '_'),
    });
  }
}