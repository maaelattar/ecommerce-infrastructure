"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcommerceInfrastructure = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const environment_provider_1 = require("./providers/environment-provider");
const vpc_construct_1 = require("./constructs/networking/vpc-construct");
const database_construct_1 = require("./constructs/data/database-construct");
const cache_construct_1 = require("./constructs/data/cache-construct");
const amazon_mq_construct_1 = require("./constructs/messaging/amazon-mq-construct");
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
        // Create messaging layer (Amazon MQ)
        this.messaging = new amazon_mq_construct_1.AmazonMQConstruct(this, 'Messaging', {
            provider,
            vpc: this.vpc.vpc,
            securityGroup: this.vpc.securityGroups.get('messaging'),
        });
        // TODO: Add other constructs when needed
        // this.search = new SearchConstruct(this, 'Search', { ... });
        // this.storage = new StorageConstruct(this, 'Storage', { ... });
    }
}
exports.EcommerceInfrastructure = EcommerceInfrastructure;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNvbW1lcmNlLWluZnJhc3RydWN0dXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZWNvbW1lcmNlLWluZnJhc3RydWN0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUFnRDtBQUdoRCwyRUFBOEU7QUFDOUUseUVBQXFFO0FBQ3JFLDZFQUF5RTtBQUN6RSx1RUFBbUU7QUFDbkUsb0ZBQStFO0FBTS9FOzs7Ozs7O0dBT0c7QUFDSCxNQUFhLHVCQUF3QixTQUFRLG1CQUFLO0lBTWhELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBbUM7UUFDM0UsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQztRQUN6QixNQUFNLFFBQVEsR0FBRyxpREFBMEIsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFM0QsMEJBQTBCO1FBQzFCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSw0QkFBWSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBRTNELG9CQUFvQjtRQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksc0NBQWlCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUN0RCxRQUFRO1lBQ1IsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRztZQUNqQixhQUFhLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBRTtTQUN4RCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksZ0NBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQzdDLFFBQVE7WUFDUixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHO1lBQ2pCLGFBQWEsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFFO1NBQ3JELENBQUMsQ0FBQztRQUVILHFDQUFxQztRQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksdUNBQWlCLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUN4RCxRQUFRO1lBQ1IsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRztZQUNqQixhQUFhLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBRTtTQUN6RCxDQUFDLENBQUM7UUFFSCx5Q0FBeUM7UUFDekMsOERBQThEO1FBQzlELGlFQUFpRTtJQUNuRSxDQUFDO0NBQ0Y7QUF2Q0QsMERBdUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEVudmlyb25tZW50Q29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2Vudmlyb25tZW50cyc7XG5pbXBvcnQgeyBFbnZpcm9ubWVudFByb3ZpZGVyRmFjdG9yeSB9IGZyb20gJy4vcHJvdmlkZXJzL2Vudmlyb25tZW50LXByb3ZpZGVyJztcbmltcG9ydCB7IFZwY0NvbnN0cnVjdCB9IGZyb20gJy4vY29uc3RydWN0cy9uZXR3b3JraW5nL3ZwYy1jb25zdHJ1Y3QnO1xuaW1wb3J0IHsgRGF0YWJhc2VDb25zdHJ1Y3QgfSBmcm9tICcuL2NvbnN0cnVjdHMvZGF0YS9kYXRhYmFzZS1jb25zdHJ1Y3QnO1xuaW1wb3J0IHsgQ2FjaGVDb25zdHJ1Y3QgfSBmcm9tICcuL2NvbnN0cnVjdHMvZGF0YS9jYWNoZS1jb25zdHJ1Y3QnO1xuaW1wb3J0IHsgQW1hem9uTVFDb25zdHJ1Y3QgfSBmcm9tICcuL2NvbnN0cnVjdHMvbWVzc2FnaW5nL2FtYXpvbi1tcS1jb25zdHJ1Y3QnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVjb21tZXJjZUluZnJhc3RydWN0dXJlUHJvcHMgZXh0ZW5kcyBTdGFja1Byb3BzIHtcbiAgY29uZmlnOiBFbnZpcm9ubWVudENvbmZpZztcbn1cblxuLyoqXG4gKiBSZWZhY3RvcmVkIEVjb21tZXJjZUluZnJhc3RydWN0dXJlIC0gTm93IGZvbGxvd3MgU09MSUQgcHJpbmNpcGxlc1xuICogXG4gKiBTaW5nbGUgUmVzcG9uc2liaWxpdHk6IE9yY2hlc3RyYXRlcyBpbmZyYXN0cnVjdHVyZSBjb21wb25lbnRzXG4gKiBPcGVuL0Nsb3NlZDogRWFzeSB0byBleHRlbmQgd2l0aCBuZXcgY29uc3RydWN0c1xuICogQ29tcG9zaXRpb24gb3ZlciBJbmhlcml0YW5jZTogVXNlcyBjb25zdHJ1Y3QgY29tcG9zaXRpb25cbiAqIFN0cmF0ZWd5IFBhdHRlcm46IEVudmlyb25tZW50IGRpZmZlcmVuY2VzIGhhbmRsZWQgYnkgcHJvdmlkZXJzXG4gKi9cbmV4cG9ydCBjbGFzcyBFY29tbWVyY2VJbmZyYXN0cnVjdHVyZSBleHRlbmRzIFN0YWNrIHtcbiAgcHVibGljIHJlYWRvbmx5IHZwYzogVnBjQ29uc3RydWN0O1xuICBwdWJsaWMgcmVhZG9ubHkgZGF0YWJhc2U6IERhdGFiYXNlQ29uc3RydWN0O1xuICBwdWJsaWMgcmVhZG9ubHkgY2FjaGU6IENhY2hlQ29uc3RydWN0O1xuICBwdWJsaWMgcmVhZG9ubHkgbWVzc2FnaW5nOiBBbWF6b25NUUNvbnN0cnVjdDtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRWNvbW1lcmNlSW5mcmFzdHJ1Y3R1cmVQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuICAgIFxuICAgIGNvbnN0IHsgY29uZmlnIH0gPSBwcm9wcztcbiAgICBjb25zdCBwcm92aWRlciA9IEVudmlyb25tZW50UHJvdmlkZXJGYWN0b3J5LmNyZWF0ZShjb25maWcpO1xuXG4gICAgLy8gQ3JlYXRlIG5ldHdvcmtpbmcgbGF5ZXJcbiAgICB0aGlzLnZwYyA9IG5ldyBWcGNDb25zdHJ1Y3QodGhpcywgJ05ldHdvcmsnLCB7IHByb3ZpZGVyIH0pO1xuXG4gICAgLy8gQ3JlYXRlIGRhdGEgbGF5ZXJcbiAgICB0aGlzLmRhdGFiYXNlID0gbmV3IERhdGFiYXNlQ29uc3RydWN0KHRoaXMsICdEYXRhYmFzZScsIHtcbiAgICAgIHByb3ZpZGVyLFxuICAgICAgdnBjOiB0aGlzLnZwYy52cGMsXG4gICAgICBzZWN1cml0eUdyb3VwOiB0aGlzLnZwYy5zZWN1cml0eUdyb3Vwcy5nZXQoJ2RhdGFiYXNlJykhLFxuICAgIH0pO1xuXG4gICAgdGhpcy5jYWNoZSA9IG5ldyBDYWNoZUNvbnN0cnVjdCh0aGlzLCAnQ2FjaGUnLCB7XG4gICAgICBwcm92aWRlcixcbiAgICAgIHZwYzogdGhpcy52cGMudnBjLFxuICAgICAgc2VjdXJpdHlHcm91cDogdGhpcy52cGMuc2VjdXJpdHlHcm91cHMuZ2V0KCdjYWNoZScpISxcbiAgICB9KTtcblxuICAgIC8vIENyZWF0ZSBtZXNzYWdpbmcgbGF5ZXIgKEFtYXpvbiBNUSlcbiAgICB0aGlzLm1lc3NhZ2luZyA9IG5ldyBBbWF6b25NUUNvbnN0cnVjdCh0aGlzLCAnTWVzc2FnaW5nJywge1xuICAgICAgcHJvdmlkZXIsXG4gICAgICB2cGM6IHRoaXMudnBjLnZwYyxcbiAgICAgIHNlY3VyaXR5R3JvdXA6IHRoaXMudnBjLnNlY3VyaXR5R3JvdXBzLmdldCgnbWVzc2FnaW5nJykhLFxuICAgIH0pO1xuXG4gICAgLy8gVE9ETzogQWRkIG90aGVyIGNvbnN0cnVjdHMgd2hlbiBuZWVkZWRcbiAgICAvLyB0aGlzLnNlYXJjaCA9IG5ldyBTZWFyY2hDb25zdHJ1Y3QodGhpcywgJ1NlYXJjaCcsIHsgLi4uIH0pO1xuICAgIC8vIHRoaXMuc3RvcmFnZSA9IG5ldyBTdG9yYWdlQ29uc3RydWN0KHRoaXMsICdTdG9yYWdlJywgeyAuLi4gfSk7XG4gIH1cbn0iXX0=