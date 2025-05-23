import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EnvironmentProvider } from '../../providers/environment-provider';

export interface VpcConstructProps {
  provider: EnvironmentProvider;
}

/**
 * VPC Construct - Handles all networking concerns
 * Single Responsibility: Network infrastructure only
 */
export class VpcConstruct extends Construct {
  public readonly vpc: ec2.Vpc;
  public readonly securityGroups: Map<string, ec2.SecurityGroup> = new Map();

  constructor(scope: Construct, id: string, props: VpcConstructProps) {
    super(scope, id);

    const { provider } = props;
    const vpcConfig = provider.getVpcConfig();

    // Create VPC with environment-specific configuration
    this.vpc = new ec2.Vpc(this, 'VPC', {
      vpcName: `ecommerce-vpc-${provider.environment}`,
      cidr: vpcConfig.cidr,
      maxAzs: provider.getMaxAzs(),
      subnetConfiguration: this.getSubnetConfiguration(provider),
      enableDnsHostnames: vpcConfig.enableDnsHostnames,
      enableDnsSupport: vpcConfig.enableDnsSupport,
      natGateways: vpcConfig.natGateways,
    });

    // Create common security groups
    this.createSecurityGroups(provider);
  }

  private getSubnetConfiguration(provider: EnvironmentProvider): ec2.SubnetConfiguration[] {
    const config: ec2.SubnetConfiguration[] = [
      {
        name: 'PublicSubnet',
        subnetType: ec2.SubnetType.PUBLIC,
        cidrMask: 24,
      },
      {
        name: 'PrivateSubnet', 
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        cidrMask: 24,
      },
    ];

    // Add isolated subnets for AWS environments
    if (provider.shouldUseIsolatedSubnets()) {
      config.push({
        name: 'DatabaseSubnet',
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        cidrMask: 24,
      });
    }

    return config;
  }  private createSecurityGroups(provider: EnvironmentProvider) {
    // Database security group
    const dbSg = new ec2.SecurityGroup(this, 'DatabaseSecurityGroup', {
      vpc: this.vpc,
      description: 'Security group for RDS databases',
      allowAllOutbound: false,
    });
    dbSg.addIngressRule(
      ec2.Peer.ipv4(this.vpc.vpcCidrBlock),
      ec2.Port.tcp(5432),
      'Allow PostgreSQL connections from VPC'
    );
    this.securityGroups.set('database', dbSg);

    // Cache security group
    const cacheSg = new ec2.SecurityGroup(this, 'CacheSecurityGroup', {
      vpc: this.vpc,
      description: 'Security group for Redis cache',
      allowAllOutbound: false,
    });
    cacheSg.addIngressRule(
      ec2.Peer.ipv4(this.vpc.vpcCidrBlock),
      ec2.Port.tcp(6379),
      'Allow Redis connections from VPC'
    );
    this.securityGroups.set('cache', cacheSg);

    // Messaging security group
    const mqSg = new ec2.SecurityGroup(this, 'MessagingSecurityGroup', {
      vpc: this.vpc,
      description: 'Security group for message broker',
      allowAllOutbound: true,
    });
    mqSg.addIngressRule(
      ec2.Peer.ipv4(this.vpc.vpcCidrBlock),
      ec2.Port.tcp(5672),
      'Allow AMQP connections from VPC'
    );
    mqSg.addIngressRule(
      ec2.Peer.ipv4(this.vpc.vpcCidrBlock),
      ec2.Port.tcp(15672),
      'Allow RabbitMQ Management UI from VPC'
    );
    this.securityGroups.set('messaging', mqSg);

    // Search security group
    const searchSg = new ec2.SecurityGroup(this, 'SearchSecurityGroup', {
      vpc: this.vpc,
      description: 'Security group for search engine',
      allowAllOutbound: false,
    });
    searchSg.addIngressRule(
      ec2.Peer.ipv4(this.vpc.vpcCidrBlock),
      ec2.Port.tcp(443),
      'Allow HTTPS connections from VPC'
    );
    this.securityGroups.set('search', searchSg);
  }
}