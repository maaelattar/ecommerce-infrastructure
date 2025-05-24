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
            engineVersion: '3.11.20',
        };
    }
    getAmazonMQInstanceType() {
        return 'mq.t3.micro';
    }
    shouldExposePublicly() {
        return true; // LocalStack development access
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxzdGFjay1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvY2Fsc3RhY2stcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQTRDO0FBQzVDLGlFQVFnQztBQUVoQzs7O0dBR0c7QUFDSCxNQUFhLGtCQUFtQixTQUFRLDBDQUFtQjtJQUV6RCxZQUFZO1FBQ1YsT0FBTztZQUNMLElBQUksRUFBRSxhQUFhO1lBQ25CLGtCQUFrQixFQUFFLElBQUk7WUFDeEIsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixXQUFXLEVBQUUsQ0FBQyxFQUFFLHVDQUF1QztTQUN4RCxDQUFDO0lBQ0osQ0FBQztJQUVELFNBQVM7UUFDUCxPQUFPLENBQUMsQ0FBQyxDQUFDLHNDQUFzQztJQUNsRCxDQUFDO0lBRUQsd0JBQXdCO1FBQ3RCLE9BQU8sS0FBSyxDQUFDLENBQUMsa0RBQWtEO0lBQ2xFLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxXQUFtQjtRQUNuQyxPQUFPO1lBQ0wsWUFBWSxFQUFFLGFBQWE7WUFDM0IsZ0JBQWdCLEVBQUUsRUFBRTtZQUNwQixPQUFPLEVBQUUsS0FBSztZQUNkLGVBQWUsRUFBRSxDQUFDO1lBQ2xCLGdCQUFnQixFQUFFLEtBQUs7WUFDdkIsa0JBQWtCLEVBQUUsS0FBSztTQUMxQixDQUFDO0lBQ0osQ0FBQztJQUVELDJCQUEyQjtRQUN6QixPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxnQkFBZ0I7UUFDZCxPQUFPLDJCQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsNkJBQTZCO0lBQzdELENBQUM7SUFFRCxjQUFjO1FBQ1osT0FBTztZQUNMLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsTUFBTSxFQUFFLE9BQU87WUFDZixhQUFhLEVBQUUsS0FBSztZQUNwQixhQUFhLEVBQUUsQ0FBQztTQUNqQixDQUFDO0lBQ0osQ0FBQztJQUVELGtCQUFrQjtRQUNoQixPQUFPO1lBQ0wsY0FBYyxFQUFFLGlCQUFpQjtZQUNqQyxnQkFBZ0IsRUFBRSxhQUFhO1lBQy9CLGFBQWEsRUFBRSxTQUFTO1NBQ3pCLENBQUM7SUFDSixDQUFDO0lBRUQsdUJBQXVCO1FBQ3JCLE9BQU8sYUFBYSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxvQkFBb0I7UUFDbEIsT0FBTyxJQUFJLENBQUMsQ0FBQyxnQ0FBZ0M7SUFDL0MsQ0FBQztJQUVELGVBQWU7UUFDYixPQUFPO1lBQ0wsWUFBWSxFQUFFLGlCQUFpQjtZQUMvQixhQUFhLEVBQUUsQ0FBQztZQUNoQixXQUFXLEVBQUUsQ0FBQztZQUNkLGdCQUFnQixFQUFFLEtBQUs7WUFDdkIsb0JBQW9CLEVBQUUsS0FBSztZQUMzQixZQUFZLEVBQUUsS0FBSztTQUNwQixDQUFDO0lBQ0osQ0FBQztJQUVELGdCQUFnQjtRQUNkLE9BQU87WUFDTCxpQkFBaUIsRUFBRSxLQUFLO1lBQ3hCLGdCQUFnQixFQUFFLEtBQUs7U0FDeEIsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQWhGRCxnREFnRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZW1vdmFsUG9saWN5IH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgXG4gIEVudmlyb25tZW50UHJvdmlkZXIsIFxuICBWcGNDb25maWd1cmF0aW9uLCBcbiAgRGF0YWJhc2VDb25maWd1cmF0aW9uLFxuICBDYWNoZUNvbmZpZ3VyYXRpb24sXG4gIE1lc3NhZ2luZ0NvbmZpZ3VyYXRpb24sXG4gIFNlYXJjaENvbmZpZ3VyYXRpb24sXG4gIFN0b3JhZ2VDb25maWd1cmF0aW9uXG59IGZyb20gJy4vZW52aXJvbm1lbnQtcHJvdmlkZXInO1xuXG4vKipcbiAqIExvY2FsU3RhY2stc3BlY2lmaWMgZW52aXJvbm1lbnQgcHJvdmlkZXJcbiAqIE9wdGltaXplZCBmb3IgbG9jYWwgZGV2ZWxvcG1lbnQgd2l0aCBzaW1wbGlmaWVkIGNvbmZpZ3VyYXRpb25zXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2NhbFN0YWNrUHJvdmlkZXIgZXh0ZW5kcyBFbnZpcm9ubWVudFByb3ZpZGVyIHtcbiAgXG4gIGdldFZwY0NvbmZpZygpOiBWcGNDb25maWd1cmF0aW9uIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2lkcjogJzEwLjAuMC4wLzE2JyxcbiAgICAgIGVuYWJsZURuc0hvc3RuYW1lczogdHJ1ZSxcbiAgICAgIGVuYWJsZURuc1N1cHBvcnQ6IHRydWUsXG4gICAgICBuYXRHYXRld2F5czogMCwgLy8gTG9jYWxTdGFjayBkb2Vzbid0IG5lZWQgTkFUIGdhdGV3YXlzXG4gICAgfTtcbiAgfVxuXG4gIGdldE1heEF6cygpOiBudW1iZXIge1xuICAgIHJldHVybiAxOyAvLyBMb2NhbFN0YWNrIHR5cGljYWxseSB1c2VzIHNpbmdsZSBBWlxuICB9XG5cbiAgc2hvdWxkVXNlSXNvbGF0ZWRTdWJuZXRzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTsgLy8gTG9jYWxTdGFjayBkb2Vzbid0IGhhbmRsZSBpc29sYXRlZCBzdWJuZXRzIHdlbGxcbiAgfVxuXG4gIGdldERhdGFiYXNlQ29uZmlnKHNlcnZpY2VOYW1lOiBzdHJpbmcpOiBEYXRhYmFzZUNvbmZpZ3VyYXRpb24ge1xuICAgIHJldHVybiB7XG4gICAgICBpbnN0YW5jZVR5cGU6ICdkYi50My5taWNybycsXG4gICAgICBhbGxvY2F0ZWRTdG9yYWdlOiAyMCxcbiAgICAgIG11bHRpQVo6IGZhbHNlLFxuICAgICAgYmFja3VwUmV0ZW50aW9uOiAxLFxuICAgICAgZW5jcnlwdGlvbkF0UmVzdDogZmFsc2UsXG4gICAgICBkZWxldGlvblByb3RlY3Rpb246IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBzaG91bGRVc2VEZWxldGlvblByb3RlY3Rpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0UmVtb3ZhbFBvbGljeSgpIHtcbiAgICByZXR1cm4gUmVtb3ZhbFBvbGljeS5ERVNUUk9ZOyAvLyBFYXN5IGNsZWFudXAgZm9yIGxvY2FsIGRldlxuICB9XG5cbiAgZ2V0Q2FjaGVDb25maWcoKTogQ2FjaGVDb25maWd1cmF0aW9uIHtcbiAgICByZXR1cm4ge1xuICAgICAgbm9kZVR5cGU6ICdjYWNoZS50My5taWNybycsXG4gICAgICBlbmdpbmU6ICdyZWRpcycsXG4gICAgICBlbmdpbmVWZXJzaW9uOiAnNi4yJyxcbiAgICAgIG51bUNhY2hlTm9kZXM6IDEsXG4gICAgfTtcbiAgfVxuXG4gIGdldE1lc3NhZ2luZ0NvbmZpZygpOiBNZXNzYWdpbmdDb25maWd1cmF0aW9uIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVwbG95bWVudE1vZGU6ICdTSU5HTEVfSU5TVEFOQ0UnLFxuICAgICAgaG9zdEluc3RhbmNlVHlwZTogJ21xLnQzLm1pY3JvJyxcbiAgICAgIGVuZ2luZVZlcnNpb246ICczLjExLjIwJyxcbiAgICB9O1xuICB9XG5cbiAgZ2V0QW1hem9uTVFJbnN0YW5jZVR5cGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ21xLnQzLm1pY3JvJztcbiAgfVxuXG4gIHNob3VsZEV4cG9zZVB1YmxpY2x5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0cnVlOyAvLyBMb2NhbFN0YWNrIGRldmVsb3BtZW50IGFjY2Vzc1xuICB9XG5cbiAgZ2V0U2VhcmNoQ29uZmlnKCk6IFNlYXJjaENvbmZpZ3VyYXRpb24ge1xuICAgIHJldHVybiB7XG4gICAgICBpbnN0YW5jZVR5cGU6ICd0My5zbWFsbC5zZWFyY2gnLFxuICAgICAgaW5zdGFuY2VDb3VudDogMSxcbiAgICAgIG1hc3Rlck5vZGVzOiAwLFxuICAgICAgZW5jcnlwdGlvbkF0UmVzdDogZmFsc2UsXG4gICAgICBub2RlVG9Ob2RlRW5jcnlwdGlvbjogZmFsc2UsXG4gICAgICBlbmZvcmNlSFRUUFM6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBnZXRTdG9yYWdlQ29uZmlnKCk6IFN0b3JhZ2VDb25maWd1cmF0aW9uIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmVyc2lvbmluZ0VuYWJsZWQ6IGZhbHNlLFxuICAgICAgZW5jcnlwdGlvbkF0UmVzdDogZmFsc2UsXG4gICAgfTtcbiAgfVxufSJdfQ==