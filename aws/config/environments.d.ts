export interface EnvironmentConfig {
    environment: 'local' | 'dev' | 'staging' | 'prod';
    isLocalStack: boolean;
    account?: string;
    region: string;
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
    cache: {
        nodeType: string;
        numCacheNodes: number;
        engine: 'redis';
        engineVersion: string;
        transitEncryption: boolean;
        atRestEncryption: boolean;
    };
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
    search: {
        engine: 'opensearch';
        instanceType: string;
        instanceCount: number;
        masterNodes: number;
        encryptionAtRest: boolean;
        nodeToNodeEncryption: boolean;
        enforceHTTPS: boolean;
    };
    s3: {
        encryptionAtRest: boolean;
        versioningEnabled: boolean;
        lifecyclePolicies: boolean;
    };
    monitoring: {
        enableCloudWatch: boolean;
        enableXRay: boolean;
        logRetentionDays: number;
    };
}
export declare const ENVIRONMENT_CONFIGS: Record<string, EnvironmentConfig>;
