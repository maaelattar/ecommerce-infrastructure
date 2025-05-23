import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { EnvironmentProvider } from '../../providers/environment-provider';

export interface CacheConstructProps {
  provider: EnvironmentProvider;
  vpc: ec2.Vpc;
  securityGroup: ec2.SecurityGroup;
}

/**
 * Cache Construct - Handles Redis/ElastiCache
 * Single Responsibility: Caching infrastructure only
 */
export class CacheConstruct extends Construct {
  public readonly cacheCluster: elasticache.CfnCacheCluster;

  constructor(scope: Construct, id: string, props: CacheConstructProps) {
    super(scope, id);

    const { provider, vpc, securityGroup } = props;
    const cacheConfig = provider.getCacheConfig();

    // Create subnet group for ElastiCache
    const subnetGroup = new elasticache.CfnSubnetGroup(this, 'SubnetGroup', {
      description: 'Subnet group for ElastiCache',
      subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
      cacheSubnetGroupName: `ecommerce-cache-subnet-group-${provider.environment}`,
    });

    // Create Redis cache cluster
    this.cacheCluster = new elasticache.CfnCacheCluster(this, 'RedisCluster', {
      cacheNodeType: cacheConfig.nodeType,
      engine: cacheConfig.engine,
      engineVersion: cacheConfig.engineVersion,
      numCacheNodes: cacheConfig.numCacheNodes,
      cacheSubnetGroupName: subnetGroup.cacheSubnetGroupName,
      vpcSecurityGroupIds: [securityGroup.securityGroupId],
      clusterName: `ecommerce-redis-${provider.environment}`,
    });

    this.cacheCluster.addDependency(subnetGroup);

    // Store Redis connection info
    this.createParameters(provider);
  }

  private createParameters(provider: EnvironmentProvider) {
    new ssm.StringParameter(this, 'redis-endpoint', {
      parameterName: `/ecommerce/${provider.environment}/cache/redis/endpoint`,
      stringValue: this.cacheCluster.attrRedisEndpointAddress || 'localhost',
    });
  }
}