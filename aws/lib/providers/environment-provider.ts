import { EnvironmentConfig } from '../../config/environments';

/**
 * Abstract base class for environment-specific resource configuration
 * Implements Strategy pattern to handle LocalStack vs AWS differences
 */
export abstract class EnvironmentProvider {
  protected readonly config: EnvironmentConfig;

  constructor(config: EnvironmentConfig) {
    this.config = config;
  }

  // Network configuration methods
  abstract getVpcConfig(): VpcConfiguration;
  abstract getMaxAzs(): number;
  abstract shouldUseIsolatedSubnets(): boolean;

  // Database configuration methods
  abstract getDatabaseConfig(serviceName: string): DatabaseConfiguration;
  abstract shouldUseDeletionProtection(): boolean;
  abstract getRemovalPolicy(): any; // RemovalPolicy from CDK

  // Cache configuration methods
  abstract getCacheConfig(): CacheConfiguration;

  // Messaging configuration methods
  abstract getMessagingConfig(): MessagingConfiguration;
  abstract getAmazonMQInstanceType(): string;
  abstract shouldExposePublicly(): boolean;

  // Search configuration methods
  abstract getSearchConfig(): SearchConfiguration;

  // Storage configuration methods
  abstract getStorageConfig(): StorageConfiguration;

  // Common getters
  get environment(): string {
    return this.config.environment;
  }

  get isLocalStack(): boolean {
    return this.config.isLocalStack;
  }

  get region(): string {
    return this.config.region;
  }

  isProduction(): boolean {
    return this.config.environment === 'prod';
  }
}

// Configuration interfaces
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
export class EnvironmentProviderFactory {
  static create(config: EnvironmentConfig): EnvironmentProvider {
    if (config.isLocalStack) {
      return new LocalStackProvider(config);
    }
    return new AwsProvider(config);
  }
}

// Import the concrete implementations
import { LocalStackProvider } from './localstack-provider';
import { AwsProvider } from './aws-provider';