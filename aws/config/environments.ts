// Environment-specific configurations for both LocalStack and AWS deployments

export interface EnvironmentConfig {
  environment: 'local' | 'dev' | 'staging' | 'prod';
  isLocalStack: boolean;
  
  // AWS Account/Region (ignored for LocalStack)
  account?: string;
  region: string;
  
  // Database Configuration
  databases: {
    [serviceName: string]: {
      engine: 'postgres' | 'mysql';
      version: string;
      instanceClass: string;
      allocatedStorage: number;
      multiAZ: boolean;
      backupRetention: number;
      deletionProtection: boolean;
      encryptionAtRest: boolean;
    };
  };
  
  // Cache Configuration
  cache: {
    nodeType: string;
    numCacheNodes: number;
    engine: 'redis';
    engineVersion: string;
    transitEncryption: boolean;
    atRestEncryption: boolean;
  };
  
  // Message Broker Configuration
  messageBroker: {
    engine: 'rabbitmq';
    hostInstanceType: string;
    deploymentMode: 'SINGLE_INSTANCE' | 'CLUSTER';
    encryptionInTransit: boolean;
    logs: {
      general: boolean;
      audit: boolean;
    };
  };
  
  // Search Configuration
  search: {
    engine: 'opensearch';
    instanceType: string;
    instanceCount: number;
    masterNodes: number;
    encryptionAtRest: boolean;
    nodeToNodeEncryption: boolean;
    enforceHTTPS: boolean;
  };
  
  // S3 Configuration
  s3: {
    encryptionAtRest: boolean;
    versioningEnabled: boolean;
    lifecyclePolicies: boolean;
  };
  
  // Monitoring & Logging
  monitoring: {
    enableCloudWatch: boolean;
    enableXRay: boolean;
    logRetentionDays: number;
  };
}

export const ENVIRONMENT_CONFIGS: Record<string, EnvironmentConfig> = {
  // LocalStack configuration - minimal resources for fast local development
  local: {
    environment: 'local',
    isLocalStack: true,
    region: 'us-east-1', // LocalStack default
    
    databases: {
      'user-service': {
        engine: 'postgres',
        version: '14.9',
        instanceClass: 'db.t3.micro',
        allocatedStorage: 20,
        multiAZ: false,
        backupRetention: 0,
        deletionProtection: false,
        encryptionAtRest: false,
      },
      'product-service': {
        engine: 'postgres', 
        version: '14.9',
        instanceClass: 'db.t3.micro',
        allocatedStorage: 20,
        multiAZ: false,
        backupRetention: 0,
        deletionProtection: false,
        encryptionAtRest: false,
      },
      'order-service': {
        engine: 'postgres',
        version: '14.9', 
        instanceClass: 'db.t3.micro',
        allocatedStorage: 20,
        multiAZ: false,
        backupRetention: 0,
        deletionProtection: false,
        encryptionAtRest: false,
      },
      'payment-service': {
        engine: 'postgres',
        version: '14.9',
        instanceClass: 'db.t3.micro', 
        allocatedStorage: 20,
        multiAZ: false,
        backupRetention: 0,
        deletionProtection: false,
        encryptionAtRest: false,
      },
      'inventory-service': {
        engine: 'postgres',
        version: '14.9',
        instanceClass: 'db.t3.micro',
        allocatedStorage: 20,
        multiAZ: false,
        backupRetention: 0,
        deletionProtection: false,
        encryptionAtRest: false,
      },
    },
    
    cache: {
      nodeType: 'cache.t3.micro',
      numCacheNodes: 1,
      engine: 'redis',
      engineVersion: '7.0',
      transitEncryption: false,
      atRestEncryption: false,
    },
    
    messageBroker: {
      engine: 'rabbitmq',
      hostInstanceType: 'mq.t3.micro',
      deploymentMode: 'SINGLE_INSTANCE',
      encryptionInTransit: false,
      logs: {
        general: false,
        audit: false,
      },
    },
    
    search: {
      engine: 'opensearch',
      instanceType: 't3.small.search',
      instanceCount: 1,
      masterNodes: 0,
      encryptionAtRest: false,
      nodeToNodeEncryption: false,
      enforceHTTPS: false,
    },
    
    s3: {
      encryptionAtRest: false,
      versioningEnabled: false,
      lifecyclePolicies: false,
    },
    
    monitoring: {
      enableCloudWatch: false,
      enableXRay: false,
      logRetentionDays: 1,
    },
  },

  // Development environment - cost-optimized with basic monitoring
  dev: {
    environment: 'dev',
    isLocalStack: false,
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-west-2',
    
    databases: {
      'user-service': {
        engine: 'postgres',
        version: '14.9',
        instanceClass: 'db.t3.small',
        allocatedStorage: 50,
        multiAZ: false,
        backupRetention: 7,
        deletionProtection: false,
        encryptionAtRest: true,
      },
      'product-service': {
        engine: 'postgres', 
        version: '14.9',
        instanceClass: 'db.t3.small',
        allocatedStorage: 100,
        multiAZ: false,
        backupRetention: 7,
        deletionProtection: false,
        encryptionAtRest: true,
      },
      'order-service': {
        engine: 'postgres',
        version: '14.9', 
        instanceClass: 'db.t3.small',
        allocatedStorage: 100,
        multiAZ: false,
        backupRetention: 7,
        deletionProtection: false,
        encryptionAtRest: true,
      },
      'payment-service': {
        engine: 'postgres',
        version: '14.9',
        instanceClass: 'db.t3.small', 
        allocatedStorage: 50,
        multiAZ: false,
        backupRetention: 7,
        deletionProtection: false,
        encryptionAtRest: true,
      },
      'inventory-service': {
        engine: 'postgres',
        version: '14.9',
        instanceClass: 'db.t3.small',
        allocatedStorage: 50,
        multiAZ: false,
        backupRetention: 7,
        deletionProtection: false,
        encryptionAtRest: true,
      },
    },
    
    cache: {
      nodeType: 'cache.t3.small',
      numCacheNodes: 1,
      engine: 'redis',
      engineVersion: '7.0',
      transitEncryption: true,
      atRestEncryption: true,
    },
    
    messageBroker: {
      engine: 'rabbitmq',
      hostInstanceType: 'mq.t3.small',
      deploymentMode: 'SINGLE_INSTANCE',
      encryptionInTransit: true,
      logs: {
        general: true,
        audit: false,
      },
    },
    
    search: {
      engine: 'opensearch',
      instanceType: 't3.small.search',
      instanceCount: 1,
      masterNodes: 0,
      encryptionAtRest: true,
      nodeToNodeEncryption: true,
      enforceHTTPS: true,
    },
    
    s3: {
      encryptionAtRest: true,
      versioningEnabled: true,
      lifecyclePolicies: false,
    },
    
    monitoring: {
      enableCloudWatch: true,
      enableXRay: true,
      logRetentionDays: 14,
    },
  },

  // Staging environment - production-like with full monitoring
  staging: {
    environment: 'staging',
    isLocalStack: false,
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-west-2',
    
    databases: {
      'user-service': {
        engine: 'postgres',
        version: '14.9',
        instanceClass: 'db.r5.large',
        allocatedStorage: 100,
        multiAZ: true,
        backupRetention: 14,
        deletionProtection: true,
        encryptionAtRest: true,
      },
      'product-service': {
        engine: 'postgres', 
        version: '14.9',
        instanceClass: 'db.r5.large',
        allocatedStorage: 200,
        multiAZ: true,
        backupRetention: 14,
        deletionProtection: true,
        encryptionAtRest: true,
      },
      'order-service': {
        engine: 'postgres',
        version: '14.9', 
        instanceClass: 'db.r5.large',
        allocatedStorage: 200,
        multiAZ: true,
        backupRetention: 14,
        deletionProtection: true,
        encryptionAtRest: true,
      },
      'payment-service': {
        engine: 'postgres',
        version: '14.9',
        instanceClass: 'db.r5.large', 
        allocatedStorage: 100,
        multiAZ: true,
        backupRetention: 14,
        deletionProtection: true,
        encryptionAtRest: true,
      },
      'inventory-service': {
        engine: 'postgres',
        version: '14.9',
        instanceClass: 'db.r5.large',
        allocatedStorage: 100,
        multiAZ: true,
        backupRetention: 14,
        deletionProtection: true,
        encryptionAtRest: true,
      },
    },
    
    cache: {
      nodeType: 'cache.r5.large',
      numCacheNodes: 2,
      engine: 'redis',
      engineVersion: '7.0',
      transitEncryption: true,
      atRestEncryption: true,
    },
    
    messageBroker: {
      engine: 'rabbitmq',
      hostInstanceType: 'mq.m5.large',
      deploymentMode: 'CLUSTER',
      encryptionInTransit: true,
      logs: {
        general: true,
        audit: true,
      },
    },
    
    search: {
      engine: 'opensearch',
      instanceType: 'r5.large.search',
      instanceCount: 3,
      masterNodes: 3,
      encryptionAtRest: true,
      nodeToNodeEncryption: true,
      enforceHTTPS: true,
    },
    
    s3: {
      encryptionAtRest: true,
      versioningEnabled: true,
      lifecyclePolicies: true,
    },
    
    monitoring: {
      enableCloudWatch: true,
      enableXRay: true,
      logRetentionDays: 30,
    },
  },

  // Production environment - high availability, security, and compliance
  prod: {
    environment: 'prod',
    isLocalStack: false,
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-west-2',
    
    databases: {
      'user-service': {
        engine: 'postgres',
        version: '14.9',
        instanceClass: 'db.r5.xlarge',
        allocatedStorage: 200,
        multiAZ: true,
        backupRetention: 30,
        deletionProtection: true,
        encryptionAtRest: true,
      },
      'product-service': {
        engine: 'postgres', 
        version: '14.9',
        instanceClass: 'db.r5.xlarge',
        allocatedStorage: 500,
        multiAZ: true,
        backupRetention: 30,
        deletionProtection: true,
        encryptionAtRest: true,
      },
      'order-service': {
        engine: 'postgres',
        version: '14.9', 
        instanceClass: 'db.r5.xlarge',
        allocatedStorage: 500,
        multiAZ: true,
        backupRetention: 30,
        deletionProtection: true,
        encryptionAtRest: true,
      },
      'payment-service': {
        engine: 'postgres',
        version: '14.9',
        instanceClass: 'db.r5.xlarge', 
        allocatedStorage: 200,
        multiAZ: true,
        backupRetention: 30,
        deletionProtection: true,
        encryptionAtRest: true,
      },
      'inventory-service': {
        engine: 'postgres',
        version: '14.9',
        instanceClass: 'db.r5.xlarge',
        allocatedStorage: 200,
        multiAZ: true,
        backupRetention: 30,
        deletionProtection: true,
        encryptionAtRest: true,
      },
    },
    
    cache: {
      nodeType: 'cache.r5.xlarge',
      numCacheNodes: 3,
      engine: 'redis',
      engineVersion: '7.0',
      transitEncryption: true,
      atRestEncryption: true,
    },
    
    messageBroker: {
      engine: 'rabbitmq',
      hostInstanceType: 'mq.m5.xlarge',
      deploymentMode: 'CLUSTER',
      encryptionInTransit: true,
      logs: {
        general: true,
        audit: true,
      },
    },
    
    search: {
      engine: 'opensearch',
      instanceType: 'r5.xlarge.search',
      instanceCount: 5,
      masterNodes: 3,
      encryptionAtRest: true,
      nodeToNodeEncryption: true,
      enforceHTTPS: true,
    },
    
    s3: {
      encryptionAtRest: true,
      versioningEnabled: true,
      lifecyclePolicies: true,
    },
    
    monitoring: {
      enableCloudWatch: true,
      enableXRay: true,
      logRetentionDays: 90,
    },
  },
};