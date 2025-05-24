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
 * LocalStack-specific environment provider
 * Optimized for local development with simplified configurations
 */
export class LocalStackProvider extends EnvironmentProvider {
  
  getVpcConfig(): VpcConfiguration {
    return {
      cidr: '10.0.0.0/16',
      enableDnsHostnames: true,
      enableDnsSupport: true,
      natGateways: 0, // LocalStack doesn't need NAT gateways
    };
  }

  getMaxAzs(): number {
    return 1; // LocalStack typically uses single AZ
  }

  shouldUseIsolatedSubnets(): boolean {
    return false; // LocalStack doesn't handle isolated subnets well
  }

  getDatabaseConfig(serviceName: string): DatabaseConfiguration {
    return {
      instanceType: 'db.t3.micro',
      allocatedStorage: 20,
      multiAZ: false,
      backupRetention: 1,
      encryptionAtRest: false,
      deletionProtection: false,
    };
  }

  shouldUseDeletionProtection(): boolean {
    return false;
  }

  getRemovalPolicy() {
    return RemovalPolicy.DESTROY; // Easy cleanup for local dev
  }

  getCacheConfig(): CacheConfiguration {
    return {
      nodeType: 'cache.t3.micro',
      engine: 'redis',
      engineVersion: '6.2',
      numCacheNodes: 1,
    };
  }

  getMessagingConfig(): MessagingConfiguration {
    return {
      deploymentMode: 'SINGLE_INSTANCE',
      hostInstanceType: 'mq.t3.micro',
      engineVersion: '3.11.20',
    };
  }

  getAmazonMQInstanceType(): string {
    return 'mq.t3.micro';
  }

  shouldExposePublicly(): boolean {
    return true; // LocalStack development access
  }

  getSearchConfig(): SearchConfiguration {
    return {
      instanceType: 't3.small.search',
      instanceCount: 1,
      masterNodes: 0,
      encryptionAtRest: false,
      nodeToNodeEncryption: false,
      enforceHTTPS: false,
    };
  }

  getStorageConfig(): StorageConfiguration {
    return {
      versioningEnabled: false,
      encryptionAtRest: false,
    };
  }
}