"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheConstruct = void 0;
const constructs_1 = require("constructs");
const elasticache = __importStar(require("aws-cdk-lib/aws-elasticache"));
const ssm = __importStar(require("aws-cdk-lib/aws-ssm"));
/**
 * Cache Construct - Handles Redis/ElastiCache
 * Single Responsibility: Caching infrastructure only
 */
class CacheConstruct extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const { provider, vpc, securityGroup } = props;
        const cacheConfig = provider.getCacheConfig();
        // Create subnet group for ElastiCache
        const subnetGroup = new elasticache.CfnSubnetGroup(this, 'SubnetGroup', {
            description: 'Subnet group for ElastiCache',
            subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
            cacheSubnetGroupName: `ecommerce-cache-subnet-group-${provider.environment}`,
        });
        // Create Redis cache cluster
        this.cacheCluster = new elasticache.CfnCacheCluster(this, 'RedisCluster', {
            cacheNodeType: cacheConfig.nodeType,
            engine: cacheConfig.engine,
            engineVersion: cacheConfig.engineVersion,
            numCacheNodes: cacheConfig.numCacheNodes,
            cacheSubnetGroupName: subnetGroup.cacheSubnetGroupName,
            vpcSecurityGroupIds: [securityGroup.securityGroupId],
            clusterName: `ecommerce-redis-${provider.environment}`,
        });
        this.cacheCluster.addDependency(subnetGroup);
        // Store Redis connection info
        this.createParameters(provider);
    }
    createParameters(provider) {
        new ssm.StringParameter(this, 'redis-endpoint', {
            parameterName: `/ecommerce/${provider.environment}/cache/redis/endpoint`,
            stringValue: this.cacheCluster.attrRedisEndpointAddress || 'localhost',
        });
    }
}
exports.CacheConstruct = CacheConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUtY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2FjaGUtY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQXVDO0FBRXZDLHlFQUEyRDtBQUMzRCx5REFBMkM7QUFTM0M7OztHQUdHO0FBQ0gsTUFBYSxjQUFlLFNBQVEsc0JBQVM7SUFHM0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEwQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxHQUFHLEtBQUssQ0FBQztRQUMvQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFOUMsc0NBQXNDO1FBQ3RDLE1BQU0sV0FBVyxHQUFHLElBQUksV0FBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3RFLFdBQVcsRUFBRSw4QkFBOEI7WUFDM0MsU0FBUyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUM1RCxvQkFBb0IsRUFBRSxnQ0FBZ0MsUUFBUSxDQUFDLFdBQVcsRUFBRTtTQUM3RSxDQUFDLENBQUM7UUFFSCw2QkFBNkI7UUFDN0IsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLFdBQVcsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUN4RSxhQUFhLEVBQUUsV0FBVyxDQUFDLFFBQVE7WUFDbkMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxNQUFNO1lBQzFCLGFBQWEsRUFBRSxXQUFXLENBQUMsYUFBYTtZQUN4QyxhQUFhLEVBQUUsV0FBVyxDQUFDLGFBQWE7WUFDeEMsb0JBQW9CLEVBQUUsV0FBVyxDQUFDLG9CQUFvQjtZQUN0RCxtQkFBbUIsRUFBRSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUM7WUFDcEQsV0FBVyxFQUFFLG1CQUFtQixRQUFRLENBQUMsV0FBVyxFQUFFO1NBQ3ZELENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTdDLDhCQUE4QjtRQUM5QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVPLGdCQUFnQixDQUFDLFFBQTZCO1FBQ3BELElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDOUMsYUFBYSxFQUFFLGNBQWMsUUFBUSxDQUFDLFdBQVcsdUJBQXVCO1lBQ3hFLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLHdCQUF3QixJQUFJLFdBQVc7U0FDdkUsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBdkNELHdDQXVDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWxhc3RpY2FjaGUgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVsYXN0aWNhY2hlJztcbmltcG9ydCAqIGFzIHNzbSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3NtJztcbmltcG9ydCB7IEVudmlyb25tZW50UHJvdmlkZXIgfSBmcm9tICcuLi8uLi9wcm92aWRlcnMvZW52aXJvbm1lbnQtcHJvdmlkZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIENhY2hlQ29uc3RydWN0UHJvcHMge1xuICBwcm92aWRlcjogRW52aXJvbm1lbnRQcm92aWRlcjtcbiAgdnBjOiBlYzIuVnBjO1xuICBzZWN1cml0eUdyb3VwOiBlYzIuU2VjdXJpdHlHcm91cDtcbn1cblxuLyoqXG4gKiBDYWNoZSBDb25zdHJ1Y3QgLSBIYW5kbGVzIFJlZGlzL0VsYXN0aUNhY2hlXG4gKiBTaW5nbGUgUmVzcG9uc2liaWxpdHk6IENhY2hpbmcgaW5mcmFzdHJ1Y3R1cmUgb25seVxuICovXG5leHBvcnQgY2xhc3MgQ2FjaGVDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBwdWJsaWMgcmVhZG9ubHkgY2FjaGVDbHVzdGVyOiBlbGFzdGljYWNoZS5DZm5DYWNoZUNsdXN0ZXI7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENhY2hlQ29uc3RydWN0UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgeyBwcm92aWRlciwgdnBjLCBzZWN1cml0eUdyb3VwIH0gPSBwcm9wcztcbiAgICBjb25zdCBjYWNoZUNvbmZpZyA9IHByb3ZpZGVyLmdldENhY2hlQ29uZmlnKCk7XG5cbiAgICAvLyBDcmVhdGUgc3VibmV0IGdyb3VwIGZvciBFbGFzdGlDYWNoZVxuICAgIGNvbnN0IHN1Ym5ldEdyb3VwID0gbmV3IGVsYXN0aWNhY2hlLkNmblN1Ym5ldEdyb3VwKHRoaXMsICdTdWJuZXRHcm91cCcsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnU3VibmV0IGdyb3VwIGZvciBFbGFzdGlDYWNoZScsXG4gICAgICBzdWJuZXRJZHM6IHZwYy5wcml2YXRlU3VibmV0cy5tYXAoc3VibmV0ID0+IHN1Ym5ldC5zdWJuZXRJZCksXG4gICAgICBjYWNoZVN1Ym5ldEdyb3VwTmFtZTogYGVjb21tZXJjZS1jYWNoZS1zdWJuZXQtZ3JvdXAtJHtwcm92aWRlci5lbnZpcm9ubWVudH1gLFxuICAgIH0pO1xuXG4gICAgLy8gQ3JlYXRlIFJlZGlzIGNhY2hlIGNsdXN0ZXJcbiAgICB0aGlzLmNhY2hlQ2x1c3RlciA9IG5ldyBlbGFzdGljYWNoZS5DZm5DYWNoZUNsdXN0ZXIodGhpcywgJ1JlZGlzQ2x1c3RlcicsIHtcbiAgICAgIGNhY2hlTm9kZVR5cGU6IGNhY2hlQ29uZmlnLm5vZGVUeXBlLFxuICAgICAgZW5naW5lOiBjYWNoZUNvbmZpZy5lbmdpbmUsXG4gICAgICBlbmdpbmVWZXJzaW9uOiBjYWNoZUNvbmZpZy5lbmdpbmVWZXJzaW9uLFxuICAgICAgbnVtQ2FjaGVOb2RlczogY2FjaGVDb25maWcubnVtQ2FjaGVOb2RlcyxcbiAgICAgIGNhY2hlU3VibmV0R3JvdXBOYW1lOiBzdWJuZXRHcm91cC5jYWNoZVN1Ym5ldEdyb3VwTmFtZSxcbiAgICAgIHZwY1NlY3VyaXR5R3JvdXBJZHM6IFtzZWN1cml0eUdyb3VwLnNlY3VyaXR5R3JvdXBJZF0sXG4gICAgICBjbHVzdGVyTmFtZTogYGVjb21tZXJjZS1yZWRpcy0ke3Byb3ZpZGVyLmVudmlyb25tZW50fWAsXG4gICAgfSk7XG5cbiAgICB0aGlzLmNhY2hlQ2x1c3Rlci5hZGREZXBlbmRlbmN5KHN1Ym5ldEdyb3VwKTtcblxuICAgIC8vIFN0b3JlIFJlZGlzIGNvbm5lY3Rpb24gaW5mb1xuICAgIHRoaXMuY3JlYXRlUGFyYW1ldGVycyhwcm92aWRlcik7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVBhcmFtZXRlcnMocHJvdmlkZXI6IEVudmlyb25tZW50UHJvdmlkZXIpIHtcbiAgICBuZXcgc3NtLlN0cmluZ1BhcmFtZXRlcih0aGlzLCAncmVkaXMtZW5kcG9pbnQnLCB7XG4gICAgICBwYXJhbWV0ZXJOYW1lOiBgL2Vjb21tZXJjZS8ke3Byb3ZpZGVyLmVudmlyb25tZW50fS9jYWNoZS9yZWRpcy9lbmRwb2ludGAsXG4gICAgICBzdHJpbmdWYWx1ZTogdGhpcy5jYWNoZUNsdXN0ZXIuYXR0clJlZGlzRW5kcG9pbnRBZGRyZXNzIHx8ICdsb2NhbGhvc3QnLFxuICAgIH0pO1xuICB9XG59Il19