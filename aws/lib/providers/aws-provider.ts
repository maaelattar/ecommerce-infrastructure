import { RemovalPolicy } from 'aws-cdk-lib';
import { 
  EnvironmentProvider, 
  VpcConfiguration, 
  DatabaseConfiguration,
  CacheConfiguration,
  MessagingConfiguration,
  SearchConfiguration,
  StorageConfiguration
} from './environment-provider';

/**
 * AWS-specific environment provider
 * Production-ready configurations for real AWS environments
 */
export class AwsProvider extends EnvironmentProvider {
  
  getVpcConfig(): VpcConfiguration {
    return {
      cidr: '10.0.0.0/16',
      enableDnsHostnames: true,
      enableDnsSupport: true,
      natGateways: this.config.environment === 'prod' ? 3 : 1,
    };
  }

  getMaxAzs(): number {
    return this.config.environment === 'prod' ? 3 : 2;
  }

  shouldUseIsolatedSubnets(): boolean {
    return true; // Use isolated subnets for databases in AWS
  }

  getDatabaseConfig(serviceName: string): DatabaseConfiguration {
    const dbConfig = this.config.databases[serviceName];
    return {
      instanceType: `db.${dbConfig.instanceClass}`,
      allocatedStorage: dbConfig.allocatedStorage,
      multiAZ: dbConfig.multiAZ,
      backupRetention: dbConfig.backupRetention,
      encryptionAtRest: dbConfig.encryptionAtRest,
      deletionProtection: dbConfig.deletionProtection,
    };
  }

  shouldUseDeletionProtection(): boolean {
    return this.config.environment === 'prod';
  }

  getRemovalPolicy() {
    return this.config.environment === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY;
  }  getCacheConfig(): CacheConfiguration {
    return {
      nodeType: this.config.cache.nodeType,
      engine: this.config.cache.engine,
      engineVersion: this.config.cache.engineVersion,
      numCacheNodes: this.config.cache.numCacheNodes,
    };
  }

  getMessagingConfig(): MessagingConfiguration {
    return {
      deploymentMode: this.config.messageBroker.deploymentMode,
      hostInstanceType: this.config.messageBroker.hostInstanceType,
      engineVersion: '3.11.20',
    };
  }

  getAmazonMQInstanceType(): string {
    return this.config.messageBroker.hostInstanceType;
  }

  shouldExposePublicly(): boolean {
    return false; // Private access in AWS
  }

  getSearchConfig(): SearchConfiguration {
    return {
      instanceType: this.config.search.instanceType,
      instanceCount: this.config.search.instanceCount,
      masterNodes: this.config.search.masterNodes,
      encryptionAtRest: this.config.search.encryptionAtRest,
      nodeToNodeEncryption: this.config.search.nodeToNodeEncryption,
      enforceHTTPS: this.config.search.enforceHTTPS,
    };
  }

  getStorageConfig(): StorageConfiguration {
    return {
      versioningEnabled: this.config.s3.versioningEnabled,
      encryptionAtRest: this.config.s3.encryptionAtRest,
    };
  }
}