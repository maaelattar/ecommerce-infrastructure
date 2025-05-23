"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsProvider = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const environment_provider_1 = require("./environment-provider");
/**
 * AWS-specific environment provider
 * Production-ready configurations for real AWS environments
 */
class AwsProvider extends environment_provider_1.EnvironmentProvider {
    getVpcConfig() {
        return {
            cidr: '10.0.0.0/16',
            enableDnsHostnames: true,
            enableDnsSupport: true,
            natGateways: this.config.environment === 'prod' ? 3 : 1,
        };
    }
    getMaxAzs() {
        return this.config.environment === 'prod' ? 3 : 2;
    }
    shouldUseIsolatedSubnets() {
        return true; // Use isolated subnets for databases in AWS
    }
    getDatabaseConfig(serviceName) {
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
    shouldUseDeletionProtection() {
        return this.config.environment === 'prod';
    }
    getRemovalPolicy() {
        return this.config.environment === 'prod' ? aws_cdk_lib_1.RemovalPolicy.RETAIN : aws_cdk_lib_1.RemovalPolicy.DESTROY;
    }
    getCacheConfig() {
        return {
            nodeType: this.config.cache.nodeType,
            engine: this.config.cache.engine,
            engineVersion: this.config.cache.engineVersion,
            numCacheNodes: this.config.cache.numCacheNodes,
        };
    }
    getMessagingConfig() {
        return {
            deploymentMode: this.config.messageBroker.deploymentMode,
            hostInstanceType: this.config.messageBroker.hostInstanceType,
            engineVersion: '3.10.10',
        };
    }
    getSearchConfig() {
        return {
            instanceType: this.config.search.instanceType,
            instanceCount: this.config.search.instanceCount,
            masterNodes: this.config.search.masterNodes,
            encryptionAtRest: this.config.search.encryptionAtRest,
            nodeToNodeEncryption: this.config.search.nodeToNodeEncryption,
            enforceHTTPS: this.config.search.enforceHTTPS,
        };
    }
    getStorageConfig() {
        return {
            versioningEnabled: this.config.s3.versioningEnabled,
            encryptionAtRest: this.config.s3.encryptionAtRest,
        };
    }
}
exports.AwsProvider = AwsProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXdzLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUE0QztBQUM1QyxpRUFRZ0M7QUFFaEM7OztHQUdHO0FBQ0gsTUFBYSxXQUFZLFNBQVEsMENBQW1CO0lBRWxELFlBQVk7UUFDVixPQUFPO1lBQ0wsSUFBSSxFQUFFLGFBQWE7WUFDbkIsa0JBQWtCLEVBQUUsSUFBSTtZQUN4QixnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLFdBQVcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN4RCxDQUFDO0lBQ0osQ0FBQztJQUVELFNBQVM7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELHdCQUF3QjtRQUN0QixPQUFPLElBQUksQ0FBQyxDQUFDLDRDQUE0QztJQUMzRCxDQUFDO0lBRUQsaUJBQWlCLENBQUMsV0FBbUI7UUFDbkMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDcEQsT0FBTztZQUNMLFlBQVksRUFBRSxNQUFNLFFBQVEsQ0FBQyxhQUFhLEVBQUU7WUFDNUMsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLGdCQUFnQjtZQUMzQyxPQUFPLEVBQUUsUUFBUSxDQUFDLE9BQU87WUFDekIsZUFBZSxFQUFFLFFBQVEsQ0FBQyxlQUFlO1lBQ3pDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxnQkFBZ0I7WUFDM0Msa0JBQWtCLEVBQUUsUUFBUSxDQUFDLGtCQUFrQjtTQUNoRCxDQUFDO0lBQ0osQ0FBQztJQUVELDJCQUEyQjtRQUN6QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxLQUFLLE1BQU0sQ0FBQztJQUM1QyxDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLDJCQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQywyQkFBYSxDQUFDLE9BQU8sQ0FBQztJQUMzRixDQUFDO0lBQUUsY0FBYztRQUNmLE9BQU87WUFDTCxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUTtZQUNwQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTTtZQUNoQyxhQUFhLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYTtZQUM5QyxhQUFhLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYTtTQUMvQyxDQUFDO0lBQ0osQ0FBQztJQUVELGtCQUFrQjtRQUNoQixPQUFPO1lBQ0wsY0FBYyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGNBQWM7WUFDeEQsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsZ0JBQWdCO1lBQzVELGFBQWEsRUFBRSxTQUFTO1NBQ3pCLENBQUM7SUFDSixDQUFDO0lBRUQsZUFBZTtRQUNiLE9BQU87WUFDTCxZQUFZLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWTtZQUM3QyxhQUFhLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBYTtZQUMvQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVztZQUMzQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0I7WUFDckQsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsb0JBQW9CO1lBQzdELFlBQVksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZO1NBQzlDLENBQUM7SUFDSixDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsT0FBTztZQUNMLGlCQUFpQixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLGlCQUFpQjtZQUNuRCxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0I7U0FDbEQsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQXZFRCxrQ0F1RUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZW1vdmFsUG9saWN5IH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgXG4gIEVudmlyb25tZW50UHJvdmlkZXIsIFxuICBWcGNDb25maWd1cmF0aW9uLCBcbiAgRGF0YWJhc2VDb25maWd1cmF0aW9uLFxuICBDYWNoZUNvbmZpZ3VyYXRpb24sXG4gIE1lc3NhZ2luZ0NvbmZpZ3VyYXRpb24sXG4gIFNlYXJjaENvbmZpZ3VyYXRpb24sXG4gIFN0b3JhZ2VDb25maWd1cmF0aW9uXG59IGZyb20gJy4vZW52aXJvbm1lbnQtcHJvdmlkZXInO1xuXG4vKipcbiAqIEFXUy1zcGVjaWZpYyBlbnZpcm9ubWVudCBwcm92aWRlclxuICogUHJvZHVjdGlvbi1yZWFkeSBjb25maWd1cmF0aW9ucyBmb3IgcmVhbCBBV1MgZW52aXJvbm1lbnRzXG4gKi9cbmV4cG9ydCBjbGFzcyBBd3NQcm92aWRlciBleHRlbmRzIEVudmlyb25tZW50UHJvdmlkZXIge1xuICBcbiAgZ2V0VnBjQ29uZmlnKCk6IFZwY0NvbmZpZ3VyYXRpb24ge1xuICAgIHJldHVybiB7XG4gICAgICBjaWRyOiAnMTAuMC4wLjAvMTYnLFxuICAgICAgZW5hYmxlRG5zSG9zdG5hbWVzOiB0cnVlLFxuICAgICAgZW5hYmxlRG5zU3VwcG9ydDogdHJ1ZSxcbiAgICAgIG5hdEdhdGV3YXlzOiB0aGlzLmNvbmZpZy5lbnZpcm9ubWVudCA9PT0gJ3Byb2QnID8gMyA6IDEsXG4gICAgfTtcbiAgfVxuXG4gIGdldE1heEF6cygpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZy5lbnZpcm9ubWVudCA9PT0gJ3Byb2QnID8gMyA6IDI7XG4gIH1cblxuICBzaG91bGRVc2VJc29sYXRlZFN1Ym5ldHMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRydWU7IC8vIFVzZSBpc29sYXRlZCBzdWJuZXRzIGZvciBkYXRhYmFzZXMgaW4gQVdTXG4gIH1cblxuICBnZXREYXRhYmFzZUNvbmZpZyhzZXJ2aWNlTmFtZTogc3RyaW5nKTogRGF0YWJhc2VDb25maWd1cmF0aW9uIHtcbiAgICBjb25zdCBkYkNvbmZpZyA9IHRoaXMuY29uZmlnLmRhdGFiYXNlc1tzZXJ2aWNlTmFtZV07XG4gICAgcmV0dXJuIHtcbiAgICAgIGluc3RhbmNlVHlwZTogYGRiLiR7ZGJDb25maWcuaW5zdGFuY2VDbGFzc31gLFxuICAgICAgYWxsb2NhdGVkU3RvcmFnZTogZGJDb25maWcuYWxsb2NhdGVkU3RvcmFnZSxcbiAgICAgIG11bHRpQVo6IGRiQ29uZmlnLm11bHRpQVosXG4gICAgICBiYWNrdXBSZXRlbnRpb246IGRiQ29uZmlnLmJhY2t1cFJldGVudGlvbixcbiAgICAgIGVuY3J5cHRpb25BdFJlc3Q6IGRiQ29uZmlnLmVuY3J5cHRpb25BdFJlc3QsXG4gICAgICBkZWxldGlvblByb3RlY3Rpb246IGRiQ29uZmlnLmRlbGV0aW9uUHJvdGVjdGlvbixcbiAgICB9O1xuICB9XG5cbiAgc2hvdWxkVXNlRGVsZXRpb25Qcm90ZWN0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZy5lbnZpcm9ubWVudCA9PT0gJ3Byb2QnO1xuICB9XG5cbiAgZ2V0UmVtb3ZhbFBvbGljeSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWcuZW52aXJvbm1lbnQgPT09ICdwcm9kJyA/IFJlbW92YWxQb2xpY3kuUkVUQUlOIDogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZO1xuICB9ICBnZXRDYWNoZUNvbmZpZygpOiBDYWNoZUNvbmZpZ3VyYXRpb24ge1xuICAgIHJldHVybiB7XG4gICAgICBub2RlVHlwZTogdGhpcy5jb25maWcuY2FjaGUubm9kZVR5cGUsXG4gICAgICBlbmdpbmU6IHRoaXMuY29uZmlnLmNhY2hlLmVuZ2luZSxcbiAgICAgIGVuZ2luZVZlcnNpb246IHRoaXMuY29uZmlnLmNhY2hlLmVuZ2luZVZlcnNpb24sXG4gICAgICBudW1DYWNoZU5vZGVzOiB0aGlzLmNvbmZpZy5jYWNoZS5udW1DYWNoZU5vZGVzLFxuICAgIH07XG4gIH1cblxuICBnZXRNZXNzYWdpbmdDb25maWcoKTogTWVzc2FnaW5nQ29uZmlndXJhdGlvbiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlcGxveW1lbnRNb2RlOiB0aGlzLmNvbmZpZy5tZXNzYWdlQnJva2VyLmRlcGxveW1lbnRNb2RlLFxuICAgICAgaG9zdEluc3RhbmNlVHlwZTogdGhpcy5jb25maWcubWVzc2FnZUJyb2tlci5ob3N0SW5zdGFuY2VUeXBlLFxuICAgICAgZW5naW5lVmVyc2lvbjogJzMuMTAuMTAnLFxuICAgIH07XG4gIH1cblxuICBnZXRTZWFyY2hDb25maWcoKTogU2VhcmNoQ29uZmlndXJhdGlvbiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGluc3RhbmNlVHlwZTogdGhpcy5jb25maWcuc2VhcmNoLmluc3RhbmNlVHlwZSxcbiAgICAgIGluc3RhbmNlQ291bnQ6IHRoaXMuY29uZmlnLnNlYXJjaC5pbnN0YW5jZUNvdW50LFxuICAgICAgbWFzdGVyTm9kZXM6IHRoaXMuY29uZmlnLnNlYXJjaC5tYXN0ZXJOb2RlcyxcbiAgICAgIGVuY3J5cHRpb25BdFJlc3Q6IHRoaXMuY29uZmlnLnNlYXJjaC5lbmNyeXB0aW9uQXRSZXN0LFxuICAgICAgbm9kZVRvTm9kZUVuY3J5cHRpb246IHRoaXMuY29uZmlnLnNlYXJjaC5ub2RlVG9Ob2RlRW5jcnlwdGlvbixcbiAgICAgIGVuZm9yY2VIVFRQUzogdGhpcy5jb25maWcuc2VhcmNoLmVuZm9yY2VIVFRQUyxcbiAgICB9O1xuICB9XG5cbiAgZ2V0U3RvcmFnZUNvbmZpZygpOiBTdG9yYWdlQ29uZmlndXJhdGlvbiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZlcnNpb25pbmdFbmFibGVkOiB0aGlzLmNvbmZpZy5zMy52ZXJzaW9uaW5nRW5hYmxlZCxcbiAgICAgIGVuY3J5cHRpb25BdFJlc3Q6IHRoaXMuY29uZmlnLnMzLmVuY3J5cHRpb25BdFJlc3QsXG4gICAgfTtcbiAgfVxufSJdfQ==