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
exports.VpcConstruct = void 0;
const constructs_1 = require("constructs");
const ec2 = __importStar(require("aws-cdk-lib/aws-ec2"));
/**
 * VPC Construct - Handles all networking concerns
 * Single Responsibility: Network infrastructure only
 */
class VpcConstruct extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.securityGroups = new Map();
        const { provider } = props;
        const vpcConfig = provider.getVpcConfig();
        // Create VPC with environment-specific configuration
        this.vpc = new ec2.Vpc(this, 'VPC', {
            vpcName: `ecommerce-vpc-${provider.environment}`,
            cidr: vpcConfig.cidr,
            maxAzs: provider.getMaxAzs(),
            subnetConfiguration: this.getSubnetConfiguration(provider),
            enableDnsHostnames: vpcConfig.enableDnsHostnames,
            enableDnsSupport: vpcConfig.enableDnsSupport,
            natGateways: vpcConfig.natGateways,
        });
        // Create common security groups
        this.createSecurityGroups(provider);
    }
    getSubnetConfiguration(provider) {
        const config = [
            {
                name: 'PublicSubnet',
                subnetType: ec2.SubnetType.PUBLIC,
                cidrMask: 24,
            },
            {
                name: 'PrivateSubnet',
                subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
                cidrMask: 24,
            },
        ];
        // Add isolated subnets for AWS environments
        if (provider.shouldUseIsolatedSubnets()) {
            config.push({
                name: 'DatabaseSubnet',
                subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                cidrMask: 24,
            });
        }
        return config;
    }
    createSecurityGroups(provider) {
        // Database security group
        const dbSg = new ec2.SecurityGroup(this, 'DatabaseSecurityGroup', {
            vpc: this.vpc,
            description: 'Security group for RDS databases',
            allowAllOutbound: false,
        });
        dbSg.addIngressRule(ec2.Peer.ipv4(this.vpc.vpcCidrBlock), ec2.Port.tcp(5432), 'Allow PostgreSQL connections from VPC');
        this.securityGroups.set('database', dbSg);
        // Cache security group
        const cacheSg = new ec2.SecurityGroup(this, 'CacheSecurityGroup', {
            vpc: this.vpc,
            description: 'Security group for Redis cache',
            allowAllOutbound: false,
        });
        cacheSg.addIngressRule(ec2.Peer.ipv4(this.vpc.vpcCidrBlock), ec2.Port.tcp(6379), 'Allow Redis connections from VPC');
        this.securityGroups.set('cache', cacheSg);
        // Messaging security group
        const mqSg = new ec2.SecurityGroup(this, 'MessagingSecurityGroup', {
            vpc: this.vpc,
            description: 'Security group for message broker',
            allowAllOutbound: true,
        });
        mqSg.addIngressRule(ec2.Peer.ipv4(this.vpc.vpcCidrBlock), ec2.Port.tcp(5672), 'Allow AMQP connections from VPC');
        mqSg.addIngressRule(ec2.Peer.ipv4(this.vpc.vpcCidrBlock), ec2.Port.tcp(15672), 'Allow RabbitMQ Management UI from VPC');
        this.securityGroups.set('messaging', mqSg);
        // Search security group
        const searchSg = new ec2.SecurityGroup(this, 'SearchSecurityGroup', {
            vpc: this.vpc,
            description: 'Security group for search engine',
            allowAllOutbound: false,
        });
        searchSg.addIngressRule(ec2.Peer.ipv4(this.vpc.vpcCidrBlock), ec2.Port.tcp(443), 'Allow HTTPS connections from VPC');
        this.securityGroups.set('search', searchSg);
    }
}
exports.VpcConstruct = VpcConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBjLWNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZwYy1jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBdUM7QUFDdkMseURBQTJDO0FBTzNDOzs7R0FHRztBQUNILE1BQWEsWUFBYSxTQUFRLHNCQUFTO0lBSXpDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBd0I7UUFDaEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUhILG1CQUFjLEdBQW1DLElBQUksR0FBRyxFQUFFLENBQUM7UUFLekUsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEtBQUssQ0FBQztRQUMzQixNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFMUMscURBQXFEO1FBQ3JELElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDbEMsT0FBTyxFQUFFLGlCQUFpQixRQUFRLENBQUMsV0FBVyxFQUFFO1lBQ2hELElBQUksRUFBRSxTQUFTLENBQUMsSUFBSTtZQUNwQixNQUFNLEVBQUUsUUFBUSxDQUFDLFNBQVMsRUFBRTtZQUM1QixtQkFBbUIsRUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDO1lBQzFELGtCQUFrQixFQUFFLFNBQVMsQ0FBQyxrQkFBa0I7WUFDaEQsZ0JBQWdCLEVBQUUsU0FBUyxDQUFDLGdCQUFnQjtZQUM1QyxXQUFXLEVBQUUsU0FBUyxDQUFDLFdBQVc7U0FDbkMsQ0FBQyxDQUFDO1FBRUgsZ0NBQWdDO1FBQ2hDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRU8sc0JBQXNCLENBQUMsUUFBNkI7UUFDMUQsTUFBTSxNQUFNLEdBQThCO1lBQ3hDO2dCQUNFLElBQUksRUFBRSxjQUFj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QUksRUFBRSxxQkFBcUIsRUFBRTtZQUNsRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7WUFDYixXQUFXLEVBQUUsa0NBQWtDO1lBQy9DLGdCQUFnQixFQUFFLEtBQUs7U0FDeEIsQ0FBQyxDQUFDO1FBQ0gsUUFBUSxDQUFDLGNBQWMsQ0FDckIsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFDcEMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQ2pCLGtDQUFrQyxDQUNuQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzlDLENBQUM7Q0FDRjtBQTNHRCxvQ0EyR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCB7IEVudmlyb25tZW50UHJvdmlkZXIgfSBmcm9tICcuLi8uLi9wcm92aWRlcnMvZW52aXJvbm1lbnQtcHJvdmlkZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIFZwY0NvbnN0cnVjdFByb3BzIHtcbiAgcHJvdmlkZXI6IEVudmlyb25tZW50UHJvdmlkZXI7XG59XG5cbi8qKlxuICogVlBDIENvbnN0cnVjdCAtIEhhbmRsZXMgYWxsIG5ldHdvcmtpbmcgY29uY2VybnNcbiAqIFNpbmdsZSBSZXNwb25zaWJpbGl0eTogTmV0d29yayBpbmZyYXN0cnVjdHVyZSBvbmx5XG4gKi9cbmV4cG9ydCBjbGFzcyBWcGNDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBwdWJsaWMgcmVhZG9ubHkgdnBjOiBlYzIuVnBjO1xuICBwdWJsaWMgcmVhZG9ubHkgc2VjdXJpdHlHcm91cHM6IE1hcDxzdHJpbmcsIGVjMi5TZWN1cml0eUdyb3VwPiA9IG5ldyBNYXAoKTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogVnBjQ29uc3RydWN0UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgeyBwcm92aWRlciB9ID0gcHJvcHM7XG4gICAgY29uc3QgdnBjQ29uZmlnID0gcHJvdmlkZXIuZ2V0VnBjQ29uZmlnKCk7XG5cbiAgICAvLyBDcmVhdGUgVlBDIHdpdGggZW52aXJvbm1lbnQtc3BlY2lmaWMgY29uZmlndXJhdGlvblxuICAgIHRoaXMudnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZQQycsIHtcbiAgICAgIHZwY05hbWU6IGBlY29tbWVyY2UtdnBjLSR7cHJvdmlkZXIuZW52aXJvbm1lbnR9YCxcbiAgICAgIGNpZHI6IHZwY0NvbmZpZy5jaWRyLFxuICAgICAgbWF4QXpzOiBwcm92aWRlci5nZXRNYXhBenMoKSxcbiAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IHRoaXMuZ2V0U3VibmV0Q29uZmlndXJhdGlvbihwcm92aWRlciksXG4gICAgICBlbmFibGVEbnNIb3N0bmFtZXM6IHZwY0NvbmZpZy5lbmFibGVEbnNIb3N0bmFtZXMsXG4gICAgICBlbmFibGVEbnNTdXBwb3J0OiB2cGNDb25maWcuZW5hYmxlRG5zU3VwcG9ydCxcbiAgICAgIG5hdEdhdGV3YXlzOiB2cGNDb25maWcubmF0R2F0ZXdheXMsXG4gICAgfSk7XG5cbiAgICAvLyBDcmVhdGUgY29tbW9uIHNlY3VyaXR5IGdyb3Vwc1xuICAgIHRoaXMuY3JlYXRlU2VjdXJpdHlHcm91cHMocHJvdmlkZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRTdWJuZXRDb25maWd1cmF0aW9uKHByb3ZpZGVyOiBFbnZpcm9ubWVudFByb3ZpZGVyKTogZWMyLlN1Ym5ldENvbmZpZ3VyYXRpb25bXSB7XG4gICAgY29uc3QgY29uZmlnOiBlYzIuU3VibmV0Q29uZmlndXJhdGlvbltdID0gW1xuICAgICAge1xuICAgICAgICBuYW1lOiAnUHVibGljU3VibmV0JyxcbiAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnUHJpdmF0ZVN1Ym5ldCcsIFxuICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTLFxuICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICB9LFxuICAgIF07XG5cbiAgICAvLyBBZGQgaXNvbGF0ZWQgc3VibmV0cyBmb3IgQVdTIGVudmlyb25tZW50c1xuICAgIGlmIChwcm92aWRlci5zaG91bGRVc2VJc29sYXRlZFN1Ym5ldHMoKSkge1xuICAgICAgY29uZmlnLnB1c2goe1xuICAgICAgICBuYW1lOiAnRGF0YWJhc2VTdWJuZXQnLFxuICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELFxuICAgICAgICBjaWRyTWFzazogMjQsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29uZmlnO1xuICB9ICBwcml2YXRlIGNyZWF0ZVNlY3VyaXR5R3JvdXBzKHByb3ZpZGVyOiBFbnZpcm9ubWVudFByb3ZpZGVyKSB7XG4gICAgLy8gRGF0YWJhc2Ugc2VjdXJpdHkgZ3JvdXBcbiAgICBjb25zdCBkYlNnID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKHRoaXMsICdEYXRhYmFzZVNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICB2cGM6IHRoaXMudnBjLFxuICAgICAgZGVzY3JpcHRpb246ICdTZWN1cml0eSBncm91cCBmb3IgUkRTIGRhdGFiYXNlcycsXG4gICAgICBhbGxvd0FsbE91dGJvdW5kOiBmYWxzZSxcbiAgICB9KTtcbiAgICBkYlNnLmFkZEluZ3Jlc3NSdWxlKFxuICAgICAgZWMyLlBlZXIuaXB2NCh0aGlzLnZwYy52cGNDaWRyQmxvY2spLFxuICAgICAgZWMyLlBvcnQudGNwKDU0MzIpLFxuICAgICAgJ0FsbG93IFBvc3RncmVTUUwgY29ubmVjdGlvbnMgZnJvbSBWUEMnXG4gICAgKTtcbiAgICB0aGlzLnNlY3VyaXR5R3JvdXBzLnNldCgnZGF0YWJhc2UnLCBkYlNnKTtcblxuICAgIC8vIENhY2hlIHNlY3VyaXR5IGdyb3VwXG4gICAgY29uc3QgY2FjaGVTZyA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cCh0aGlzLCAnQ2FjaGVTZWN1cml0eUdyb3VwJywge1xuICAgICAgdnBjOiB0aGlzLnZwYyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2VjdXJpdHkgZ3JvdXAgZm9yIFJlZGlzIGNhY2hlJyxcbiAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IGZhbHNlLFxuICAgIH0pO1xuICAgIGNhY2hlU2cuYWRkSW5ncmVzc1J1bGUoXG4gICAgICBlYzIuUGVlci5pcHY0KHRoaXMudnBjLnZwY0NpZHJCbG9jayksXG4gICAgICBlYzIuUG9ydC50Y3AoNjM3OSksXG4gICAgICAnQWxsb3cgUmVkaXMgY29ubmVjdGlvbnMgZnJvbSBWUEMnXG4gICAgKTtcbiAgICB0aGlzLnNlY3VyaXR5R3JvdXBzLnNldCgnY2FjaGUnLCBjYWNoZVNnKTtcblxuICAgIC8vIE1lc3NhZ2luZyBzZWN1cml0eSBncm91cFxuICAgIGNvbnN0IG1xU2cgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAodGhpcywgJ01lc3NhZ2luZ1NlY3VyaXR5R3JvdXAnLCB7XG4gICAgICB2cGM6IHRoaXMudnBjLFxuICAgICAgZGVzY3JpcHRpb246ICdTZWN1cml0eSBncm91cCBmb3IgbWVzc2FnZSBicm9rZXInLFxuICAgICAgYWxsb3dBbGxPdXRib3VuZDogdHJ1ZSxcbiAgICB9KTtcbiAgICBtcVNnLmFkZEluZ3Jlc3NSdWxlKFxuICAgICAgZWMyLlBlZXIuaXB2NCh0aGlzLnZwYy52cGNDaWRyQmxvY2spLFxuICAgICAgZWMyLlBvcnQudGNwKDU2NzIpLFxuICAgICAgJ0FsbG93IEFNUVAgY29ubmVjdGlvbnMgZnJvbSBWUEMnXG4gICAgKTtcbiAgICBtcVNnLmFkZEluZ3Jlc3NSdWxlKFxuICAgICAgZWMyLlBlZXIuaXB2NCh0aGlzLnZwYy52cGNDaWRyQmxvY2spLFxuICAgICAgZWMyLlBvcnQudGNwKDE1NjcyKSxcbiAgICAgICdBbGxvdyBSYWJiaXRNUSBNYW5hZ2VtZW50IFVJIGZyb20gVlBDJ1xuICAgICk7XG4gICAgdGhpcy5zZWN1cml0eUdyb3Vwcy5zZXQoJ21lc3NhZ2luZycsIG1xU2cpO1xuXG4gICAgLy8gU2VhcmNoIHNlY3VyaXR5IGdyb3VwXG4gICAgY29uc3Qgc2VhcmNoU2cgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAodGhpcywgJ1NlYXJjaFNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICB2cGM6IHRoaXMudnBjLFxuICAgICAgZGVzY3JpcHRpb246ICdTZWN1cml0eSBncm91cCBmb3Igc2VhcmNoIGVuZ2luZScsXG4gICAgICBhbGxvd0FsbE91dGJvdW5kOiBmYWxzZSxcbiAgICB9KTtcbiAgICBzZWFyY2hTZy5hZGRJbmdyZXNzUnVsZShcbiAgICAgIGVjMi5QZWVyLmlwdjQodGhpcy52cGMudnBjQ2lkckJsb2NrKSxcbiAgICAgIGVjMi5Qb3J0LnRjcCg0NDMpLFxuICAgICAgJ0FsbG93IEhUVFBTIGNvbm5lY3Rpb25zIGZyb20gVlBDJ1xuICAgICk7XG4gICAgdGhpcy5zZWN1cml0eUdyb3Vwcy5zZXQoJ3NlYXJjaCcsIHNlYXJjaFNnKTtcbiAgfVxufSJdfQ==