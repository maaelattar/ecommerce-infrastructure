"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStackProvider = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const environment_provider_1 = require("./environment-provider");
/**
 * LocalStack-specific environment provider
 * Optimized for local development with simplified configurations
 */
class LocalStackProvider extends environment_provider_1.EnvironmentProvider {
    getVpcConfig() {
        return {
            cidr: '10.0.0.0/16',
            enableDnsHostnames: true,
            enableDnsSupport: true,
            natGateways: 0, // LocalStack doesn't need NAT gateways
        };
    }
    getMaxAzs() {
        return 1; // LocalStack typically uses single AZ
    }
    shouldUseIsolatedSubnets() {
        return false; // LocalStack doesn't handle isolated subnets well
    }
    getDatabaseConfig(serviceName) {
        return {
            instanceType: 'db.t3.micro',
            allocatedStorage: 20,
            multiAZ: false,
            backupRetention: 1,
            encryptionAtRest: false,
            deletionProtection: false,
        };
    }
    shouldUseDeletionProtection() {
        return false;
    }
    getRemovalPolicy() {
        return aws_cdk_lib_1.RemovalPolicy.DESTROY; // Easy cleanup for local dev
    }
    getCacheConfig() {
        return {
            nodeType: 'cache.t3.micro',
            engine: 'redis',
            engineVersion: '6.2',
            numCacheNodes: 1,
        };
    }
    getMessagingConfig() {
        return {
            deploymentMode: 'SINGLE_INSTANCE',
            hostInstanceType: 'mq.t3.micro',
            engineVersion: '3.10.10',
        };
    }
    getSearchConfig() {
        return {
            instanceType: 't3.small.search',
            instanceCount: 1,
            masterNodes: 0,
            encryptionAtRest: false,
            nodeToNodeEncryption: false,
            enforceHTTPS: false,
        };
    }
    getStorageConfig() {
        return {
            versioningEnabled: false,
            encryptionAtRest: false,
        };
    }
}
exports.LocalStackProvider = LocalStackProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxzdGFjay1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvY2Fsc3RhY2stcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQTRDO0FBQzVDLGlFQVFnQztBQUVoQzs7O0dBR0c7QUFDSCxNQUFhLGtCQUFtQixTQUFRLDBDQUFtQjtJQUV6RCxZQUFZO1FBQ1YsT0FBTztZQUNMLElBQUksRUFBRSxhQUFhO1lBQ25CLGtCQUFrQixFQUFFLElBQUk7WUFDeEIsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixXQUFXLEVBQUUsQ0FBQyxFQUFFLHVDQUF1QztTQUN4RCxDQUFDO0lBQ0osQ0FBQztJQUVELFNBQVM7UUFDUCxPQUFPLENBQUMsQ0FBQyxDQUFDLHNDQUFzQztJQUNsRCxDQUFDO0lBRUQsd0JBQXdCO1FBQ3RCLE9BQU8sS0FBSyxDQUFDLENBQUMsa0RBQWtEO0lBQ2xFLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxXQUFtQjtRQUNuQyxPQUFPO1lBQ0wsWUFBWSxFQUFFLGFBQWE7WUFDM0IsZ0JBQWdCLEVBQUUsRUFBRTtZQUNwQixPQUFPLEVBQUUsS0FBSztZQUNkLGVBQWUsRUFBRSxDQUFDO1lBQ2xCLGdCQUFnQixFQUFFLEtBQUs7WUFDdkIsa0JBQWtCLEVBQUUsS0FBSztTQUMxQixDQUFDO0lBQ0osQ0FBQztJQUVELDJCQUEyQjtRQUN6QixPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxnQkFBZ0I7UUFDZCxPQUFPLDJCQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsNkJBQTZCO0lBQzdELENBQUM7SUFFRCxjQUFjO1FBQ1osT0FBTztZQUNMLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsTUFBTSxFQUFFLE9BQU87WUFDZixhQUFhLEVBQUUsS0FBSztZQUNwQixhQUFhLEVBQUUsQ0FBQztTQUNqQixDQUFDO0lBQ0osQ0FBQztJQUVELGtCQUFrQjtRQUNoQixPQUFPO1lBQ0wsY0FBYyxFQUFFLGlCQUFpQjtZQUNqQyxnQkFBZ0IsRUFBRSxhQUFhO1lBQy9CLGFBQWEsRUFBRSxTQUFTO1NBQ3pCLENBQUM7SUFDSixDQUFDO0lBRUQsZUFBZTtRQUNiLE9BQU87WUFDTCxZQUFZLEVBQUUsaUJBQWlCO1lBQy9CLGFBQWEsRUFBRSxDQUFDO1lBQ2hCLFdBQVcsRUFBRSxDQUFDO1lBQ2QsZ0JBQWdCLEVBQUUsS0FBSztZQUN2QixvQkFBb0IsRUFBRSxLQUFLO1lBQzNCLFlBQVksRUFBRSxLQUFLO1NBQ3BCLENBQUM7SUFDSixDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsT0FBTztZQUNMLGlCQUFpQixFQUFFLEtBQUs7WUFDeEIsZ0JBQWdCLEVBQUUsS0FBSztTQUN4QixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBeEVELGdEQXdFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlbW92YWxQb2xpY3kgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBcbiAgRW52aXJvbm1lbnRQcm92aWRlciwgXG4gIFZwY0NvbmZpZ3VyYXRpb24sIFxuICBEYXRhYmFzZUNvbmZpZ3VyYXRpb24sXG4gIENhY2hlQ29uZmlndXJhdGlvbixcbiAgTWVzc2FnaW5nQ29uZmlndXJhdGlvbixcbiAgU2VhcmNoQ29uZmlndXJhdGlvbixcbiAgU3RvcmFnZUNvbmZpZ3VyYXRpb25cbn0gZnJvbSAnLi9lbnZpcm9ubWVudC1wcm92aWRlcic7XG5cbi8qKlxuICogTG9jYWxTdGFjay1zcGVjaWZpYyBlbnZpcm9ubWVudCBwcm92aWRlclxuICogT3B0aW1pemVkIGZvciBsb2NhbCBkZXZlbG9wbWVudCB3aXRoIHNpbXBsaWZpZWQgY29uZmlndXJhdGlvbnNcbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsU3RhY2tQcm92aWRlciBleHRlbmRzIEVudmlyb25tZW50UHJvdmlkZXIge1xuICBcbiAgZ2V0VnBjQ29uZmlnKCk6IFZwY0NvbmZpZ3VyYXRpb24ge1xuICAgIHJldHVybiB7XG4gICAgICBjaWRyOiAnMTAuMC4wLjAvMTYnLFxuICAgICAgZW5hYmxlRG5zSG9zdG5hbWVzOiB0cnVlLFxuICAgICAgZW5hYmxlRG5zU3VwcG9ydDogdHJ1ZSxcbiAgICAgIG5hdEdhdGV3YXlzOiAwLCAvLyBMb2NhbFN0YWNrIGRvZXNuJ3QgbmVlZCBOQVQgZ2F0ZXdheXNcbiAgICB9O1xuICB9XG5cbiAgZ2V0TWF4QXpzKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIDE7IC8vIExvY2FsU3RhY2sgdHlwaWNhbGx5IHVzZXMgc2luZ2xlIEFaXG4gIH1cblxuICBzaG91bGRVc2VJc29sYXRlZFN1Ym5ldHMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlOyAvLyBMb2NhbFN0YWNrIGRvZXNuJ3QgaGFuZGxlIGlzb2xhdGVkIHN1Ym5ldHMgd2VsbFxuICB9XG5cbiAgZ2V0RGF0YWJhc2VDb25maWcoc2VydmljZU5hbWU6IHN0cmluZyk6IERhdGFiYXNlQ29uZmlndXJhdGlvbiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGluc3RhbmNlVHlwZTogJ2RiLnQzLm1pY3JvJyxcbiAgICAgIGFsbG9jYXRlZFN0b3JhZ2U6IDIwLFxuICAgICAgbXVsdGlBWjogZmFsc2UsXG4gICAgICBiYWNrdXBSZXRlbnRpb246IDEsXG4gICAgICBlbmNyeXB0aW9uQXRSZXN0OiBmYWxzZSxcbiAgICAgIGRlbGV0aW9uUHJvdGVjdGlvbjogZmFsc2UsXG4gICAgfTtcbiAgfVxuXG4gIHNob3VsZFVzZURlbGV0aW9uUHJvdGVjdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRSZW1vdmFsUG9saWN5KCkge1xuICAgIHJldHVybiBSZW1vdmFsUG9saWN5LkRFU1RST1k7IC8vIEVhc3kgY2xlYW51cCBmb3IgbG9jYWwgZGV2XG4gIH1cblxuICBnZXRDYWNoZUNvbmZpZygpOiBDYWNoZUNvbmZpZ3VyYXRpb24ge1xuICAgIHJldHVybiB7XG4gICAgICBub2RlVHlwZTogJ2NhY2hlLnQzLm1pY3JvJyxcbiAgICAgIGVuZ2luZTogJ3JlZGlzJyxcbiAgICAgIGVuZ2luZVZlcnNpb246ICc2LjInLFxuICAgICAgbnVtQ2FjaGVOb2RlczogMSxcbiAgICB9O1xuICB9XG5cbiAgZ2V0TWVzc2FnaW5nQ29uZmlnKCk6IE1lc3NhZ2luZ0NvbmZpZ3VyYXRpb24ge1xuICAgIHJldHVybiB7XG4gICAgICBkZXBsb3ltZW50TW9kZTogJ1NJTkdMRV9JTlNUQU5DRScsXG4gICAgICBob3N0SW5zdGFuY2VUeXBlOiAnbXEudDMubWljcm8nLFxuICAgICAgZW5naW5lVmVyc2lvbjogJzMuMTAuMTAnLFxuICAgIH07XG4gIH1cblxuICBnZXRTZWFyY2hDb25maWcoKTogU2VhcmNoQ29uZmlndXJhdGlvbiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGluc3RhbmNlVHlwZTogJ3QzLnNtYWxsLnNlYXJjaCcsXG4gICAgICBpbnN0YW5jZUNvdW50OiAxLFxuICAgICAgbWFzdGVyTm9kZXM6IDAsXG4gICAgICBlbmNyeXB0aW9uQXRSZXN0OiBmYWxzZSxcbiAgICAgIG5vZGVUb05vZGVFbmNyeXB0aW9uOiBmYWxzZSxcbiAgICAgIGVuZm9yY2VIVFRQUzogZmFsc2UsXG4gICAgfTtcbiAgfVxuXG4gIGdldFN0b3JhZ2VDb25maWcoKTogU3RvcmFnZUNvbmZpZ3VyYXRpb24ge1xuICAgIHJldHVybiB7XG4gICAgICB2ZXJzaW9uaW5nRW5hYmxlZDogZmFsc2UsXG4gICAgICBlbmNyeXB0aW9uQXRSZXN0OiBmYWxzZSxcbiAgICB9O1xuICB9XG59Il19