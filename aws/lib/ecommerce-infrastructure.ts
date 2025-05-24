import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EnvironmentConfig } from '../config/environments';
import { EnvironmentProviderFactory } from './providers/environment-provider';
import { VpcConstruct } from './constructs/networking/vpc-construct';
import { DatabaseConstruct } from './constructs/data/database-construct';
import { CacheConstruct } from './constructs/data/cache-construct';
import { AmazonMQConstruct } from './constructs/messaging/amazon-mq-construct';

export interface EcommerceInfrastructureProps extends StackProps {
  config: EnvironmentConfig;
}

/**
 * Refactored EcommerceInfrastructure - Now follows SOLID principles
 * 
 * Single Responsibility: Orchestrates infrastructure components
 * Open/Closed: Easy to extend with new constructs
 * Composition over Inheritance: Uses construct composition
 * Strategy Pattern: Environment differences handled by providers
 */
export class EcommerceInfrastructure extends Stack {
  public readonly vpc: VpcConstruct;
  public readonly database: DatabaseConstruct;
  public readonly cache: CacheConstruct;
  public readonly messaging: AmazonMQConstruct;

  constructor(scope: Construct, id: string, props: EcommerceInfrastructureProps) {
    super(scope, id, props);
    
    const { config } = props;
    const provider = EnvironmentProviderFactory.create(config);

    // Create networking layer
    this.vpc = new VpcConstruct(this, 'Network', { provider });

    // Create data layer
    this.database = new DatabaseConstruct(this, 'Database', {
      provider,
      vpc: this.vpc.vpc,
      securityGroup: this.vpc.securityGroups.get('database')!,
    });

    this.cache = new CacheConstruct(this, 'Cache', {
      provider,
      vpc: this.vpc.vpc,
      securityGroup: this.vpc.securityGroups.get('cache')!,
    });

    // Create messaging layer (Amazon MQ)
    this.messaging = new AmazonMQConstruct(this, 'Messaging', {
      provider,
      vpc: this.vpc.vpc,
      securityGroup: this.vpc.securityGroups.get('messaging')!,
    });

    // TODO: Add other constructs when needed
    // this.search = new SearchConstruct(this, 'Search', { ... });
    // this.storage = new StorageConstruct(this, 'Storage', { ... });
  }
}