"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcommerceInfrastructure = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const environment_provider_1 = require("./providers/environment-provider");
const vpc_construct_1 = require("./constructs/networking/vpc-construct");
const database_construct_1 = require("./constructs/data/database-construct");
const cache_construct_1 = require("./constructs/data/cache-construct");
/**
 * Refactored EcommerceInfrastructure - Now follows SOLID principles
 *
 * Single Responsibility: Orchestrates infrastructure components
 * Open/Closed: Easy to extend with new constructs
 * Composition over Inheritance: Uses construct composition
 * Strategy Pattern: Environment differences handled by providers
 */
class EcommerceInfrastructure extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const { config } = props;
        const provider = environment_provider_1.EnvironmentProviderFactory.create(config);
        // Create networking layer
        this.vpc = new vpc_construct_1.VpcConstruct(this, 'Network', { provider });
        // Create data layer
        this.database = new database_construct_1.DatabaseConstruct(this, 'Database', {
            provider,
            vpc: this.vpc.vpc,
            securityGroup: this.vpc.securityGroups.get('database'),
        });
        this.cache = new cache_construct_1.CacheConstruct(this, 'Cache', {
            provider,
            vpc: this.vpc.vpc,
            securityGroup: this.vpc.securityGroups.get('cache'),
        });
        // TODO: Add other constructs when needed
        // this.messaging = new MessagingConstruct(this, 'Messaging', { ... });
        // this.search = new SearchConstruct(this, 'Search', { ... });
        // this.storage = new StorageConstruct(this, 'Storage', { ... });
    }
}
exports.EcommerceInfrastructure = EcommerceInfrastructure;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNvbW1lcmNlLWluZnJhc3RydWN0dXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZWNvbW1lcmNlLWluZnJhc3RydWN0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUFnRDtBQUdoRCwyRUFBOEU7QUFDOUUseUVBQXFFO0FBQ3JFLDZFQUF5RTtBQUN6RSx1RUFBbUU7QUFNbkU7Ozs7Ozs7R0FPRztBQUNILE1BQWEsdUJBQXdCLFNBQVEsbUJBQUs7SUFLaEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFtQztRQUMzRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLE1BQU0sUUFBUSxHQUFHLGlEQUEwQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUzRCwwQkFBMEI7UUFDMUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLDRCQUFZLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFFM0Qsb0JBQW9CO1FBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxzQ0FBaUIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3RELFFBQVE7WUFDUixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHO1lBQ2pCLGFBQWEsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFFO1NBQ3hELENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxnQ0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDN0MsUUFBUTtZQUNSLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUc7WUFDakIsYUFBYSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUU7U0FDckQsQ0FBQyxDQUFDO1FBRUgseUNBQXlDO1FBQ3pDLHVFQUF1RTtRQUN2RSw4REFBOEQ7UUFDOUQsaUVBQWlFO0lBQ25FLENBQUM7Q0FDRjtBQWhDRCwwREFnQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgRW52aXJvbm1lbnRDb25maWcgfSBmcm9tICcuLi9jb25maWcvZW52aXJvbm1lbnRzJztcbmltcG9ydCB7IEVudmlyb25tZW50UHJvdmlkZXJGYWN0b3J5IH0gZnJvbSAnLi9wcm92aWRlcnMvZW52aXJvbm1lbnQtcHJvdmlkZXInO1xuaW1wb3J0IHsgVnBjQ29uc3RydWN0IH0gZnJvbSAnLi9jb25zdHJ1Y3RzL25ldHdvcmtpbmcvdnBjLWNvbnN0cnVjdCc7XG5pbXBvcnQgeyBEYXRhYmFzZUNvbnN0cnVjdCB9IGZyb20gJy4vY29uc3RydWN0cy9kYXRhL2RhdGFiYXNlLWNvbnN0cnVjdCc7XG5pbXBvcnQgeyBDYWNoZUNvbnN0cnVjdCB9IGZyb20gJy4vY29uc3RydWN0cy9kYXRhL2NhY2hlLWNvbnN0cnVjdCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRWNvbW1lcmNlSW5mcmFzdHJ1Y3R1cmVQcm9wcyBleHRlbmRzIFN0YWNrUHJvcHMge1xuICBjb25maWc6IEVudmlyb25tZW50Q29uZmlnO1xufVxuXG4vKipcbiAqIFJlZmFjdG9yZWQgRWNvbW1lcmNlSW5mcmFzdHJ1Y3R1cmUgLSBOb3cgZm9sbG93cyBTT0xJRCBwcmluY2lwbGVzXG4gKiBcbiAqIFNpbmdsZSBSZXNwb25zaWJpbGl0eTogT3JjaGVzdHJhdGVzIGluZnJhc3RydWN0dXJlIGNvbXBvbmVudHNcbiAqIE9wZW4vQ2xvc2VkOiBFYXN5IHRvIGV4dGVuZCB3aXRoIG5ldyBjb25zdHJ1Y3RzXG4gKiBDb21wb3NpdGlvbiBvdmVyIEluaGVyaXRhbmNlOiBVc2VzIGNvbnN0cnVjdCBjb21wb3NpdGlvblxuICogU3RyYXRlZ3kgUGF0dGVybjogRW52aXJvbm1lbnQgZGlmZmVyZW5jZXMgaGFuZGxlZCBieSBwcm92aWRlcnNcbiAqL1xuZXhwb3J0IGNsYXNzIEVjb21tZXJjZUluZnJhc3RydWN0dXJlIGV4dGVuZHMgU3RhY2sge1xuICBwdWJsaWMgcmVhZG9ubHkgdnBjOiBWcGNDb25zdHJ1Y3Q7XG4gIHB1YmxpYyByZWFkb25seSBkYXRhYmFzZTogRGF0YWJhc2VDb25zdHJ1Y3Q7XG4gIHB1YmxpYyByZWFkb25seSBjYWNoZTogQ2FjaGVDb25zdHJ1Y3Q7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEVjb21tZXJjZUluZnJhc3RydWN0dXJlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcbiAgICBcbiAgICBjb25zdCB7IGNvbmZpZyB9ID0gcHJvcHM7XG4gICAgY29uc3QgcHJvdmlkZXIgPSBFbnZpcm9ubWVudFByb3ZpZGVyRmFjdG9yeS5jcmVhdGUoY29uZmlnKTtcblxuICAgIC8vIENyZWF0ZSBuZXR3b3JraW5nIGxheWVyXG4gICAgdGhpcy52cGMgPSBuZXcgVnBjQ29uc3RydWN0KHRoaXMsICdOZXR3b3JrJywgeyBwcm92aWRlciB9KTtcblxuICAgIC8vIENyZWF0ZSBkYXRhIGxheWVyXG4gICAgdGhpcy5kYXRhYmFzZSA9IG5ldyBEYXRhYmFzZUNvbnN0cnVjdCh0aGlzLCAnRGF0YWJhc2UnLCB7XG4gICAgICBwcm92aWRlcixcbiAgICAgIHZwYzogdGhpcy52cGMudnBjLFxuICAgICAgc2VjdXJpdHlHcm91cDogdGhpcy52cGMuc2VjdXJpdHlHcm91cHMuZ2V0KCdkYXRhYmFzZScpISxcbiAgICB9KTtcblxuICAgIHRoaXMuY2FjaGUgPSBuZXcgQ2FjaGVDb25zdHJ1Y3QodGhpcywgJ0NhY2hlJywge1xuICAgICAgcHJvdmlkZXIsXG4gICAgICB2cGM6IHRoaXMudnBjLnZwYyxcbiAgICAgIHNlY3VyaXR5R3JvdXA6IHRoaXMudnBjLnNlY3VyaXR5R3JvdXBzLmdldCgnY2FjaGUnKSEsXG4gICAgfSk7XG5cbiAgICAvLyBUT0RPOiBBZGQgb3RoZXIgY29uc3RydWN0cyB3aGVuIG5lZWRlZFxuICAgIC8vIHRoaXMubWVzc2FnaW5nID0gbmV3IE1lc3NhZ2luZ0NvbnN0cnVjdCh0aGlzLCAnTWVzc2FnaW5nJywgeyAuLi4gfSk7XG4gICAgLy8gdGhpcy5zZWFyY2ggPSBuZXcgU2VhcmNoQ29uc3RydWN0KHRoaXMsICdTZWFyY2gnLCB7IC4uLiB9KTtcbiAgICAvLyB0aGlzLnN0b3JhZ2UgPSBuZXcgU3RvcmFnZUNvbnN0cnVjdCh0aGlzLCAnU3RvcmFnZScsIHsgLi4uIH0pO1xuICB9XG59Il19