import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
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
export declare class CacheConstruct extends Construct {
    readonly cacheCluster: elasticache.CfnCacheCluster;
    constructor(scope: Construct, id: string, props: CacheConstructProps);
    private createParameters;
}
