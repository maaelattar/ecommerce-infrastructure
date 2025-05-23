import { RemovalPolicy } from 'aws-cdk-lib';
import { EnvironmentProvider, VpcConfiguration, DatabaseConfiguration, CacheConfiguration, MessagingConfiguration, SearchConfiguration, StorageConfiguration } from './environment-provider';
/**
 * AWS-specific environment provider
 * Production-ready configurations for real AWS environments
 */
export declare class AwsProvider extends EnvironmentProvider {
    getVpcConfig(): VpcConfiguration;
    getMaxAzs(): number;
    shouldUseIsolatedSubnets(): boolean;
    getDatabaseConfig(serviceName: string): DatabaseConfiguration;
    shouldUseDeletionProtection(): boolean;
    getRemovalPolicy(): RemovalPolicy.DESTROY | RemovalPolicy.RETAIN;
    getCacheConfig(): CacheConfiguration;
    getMessagingConfig(): MessagingConfiguration;
    getSearchConfig(): SearchConfiguration;
    getStorageConfig(): StorageConfiguration;
}
