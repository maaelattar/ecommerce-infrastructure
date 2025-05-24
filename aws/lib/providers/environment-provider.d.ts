import { EnvironmentConfig } from '../../config/environments';
/**
 * Abstract base class for environment-specific resource configuration
 * Implements Strategy pattern to handle LocalStack vs AWS differences
 */
export declare abstract class EnvironmentProvider {
    protected readonly config: EnvironmentConfig;
    constructor(config: EnvironmentConfig);
    abstract getVpcConfig(): VpcConfiguration;
    abstract getMaxAzs(): number;
    abstract shouldUseIsolatedSubnets(): boolean;
    abstract getDatabaseConfig(serviceName: string): DatabaseConfiguration;
    abstract shouldUseDeletionProtection(): boolean;
    abstract getRemovalPolicy(): any;
    abstract getCacheConfig(): CacheConfiguration;
    abstract getMessagingConfig(): MessagingConfiguration;
    abstract getAmazonMQInstanceType(): string;
    abstract shouldExposePublicly(): boolean;
    abstract getSearchConfig(): SearchConfiguration;
    abstract getStorageConfig(): StorageConfiguration;
    get environment(): string;
    get isLocalStack(): boolean;
    get region(): string;
    isProduction(): boolean;
}
export interface VpcConfiguration {
    cidr: string;
    enableDnsHostnames: boolean;
    enableDnsSupport: boolean;
    natGateways?: number;
}
export interface DatabaseConfiguration {
    instanceType: string;
    allocatedStorage: number;
    multiAZ: boolean;
    backupRetention: number;
    encryptionAtRest: boolean;
    deletionProtection: boolean;
}
export interface CacheConfiguration {
    nodeType: string;
    engine: string;
    engineVersion: string;
    numCacheNodes: number;
}
export interface MessagingConfiguration {
    deploymentMode: string;
    hostInstanceType: string;
    engineVersion: string;
}
export interface SearchConfiguration {
    instanceType: string;
    instanceCount: number;
    masterNodes: number;
    encryptionAtRest: boolean;
    nodeToNodeEncryption: boolean;
    enforceHTTPS: boolean;
}
export interface StorageConfiguration {
    versioningEnabled: boolean;
    encryptionAtRest: boolean;
}
/**
 * Factory for creating environment providers
 */
export declare class EnvironmentProviderFactory {
    static create(config: EnvironmentConfig): EnvironmentProvider;
}
