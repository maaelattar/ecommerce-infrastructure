import { RemovalPolicy } from 'aws-cdk-lib';
import { EnvironmentProvider, VpcConfiguration, DatabaseConfiguration, CacheConfiguration, MessagingConfiguration, SearchConfiguration, StorageConfiguration } from './environment-provider';
/**
 * LocalStack-specific environment provider
 * Optimized for local development with simplified configurations
 */
export declare class LocalStackProvider extends EnvironmentProvider {
    getVpcConfig(): VpcConfiguration;
    getMaxAzs(): number;
    shouldUseIsolatedSubnets(): boolean;
    getDatabaseConfig(serviceName: string): DatabaseConfiguration;
    shouldUseDeletionProtection(): boolean;
    getRemovalPolicy(): RemovalPolicy;
    getCacheConfig(): CacheConfiguration;
    getMessagingConfig(): MessagingConfiguration;
    getSearchConfig(): SearchConfiguration;
    getStorageConfig(): StorageConfiguration;
}
