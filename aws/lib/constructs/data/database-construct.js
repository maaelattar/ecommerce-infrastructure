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
exports.DatabaseConstruct = void 0;
const constructs_1 = require("constructs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const ec2 = __importStar(require("aws-cdk-lib/aws-ec2"));
const rds = __importStar(require("aws-cdk-lib/aws-rds"));
const secretsmanager = __importStar(require("aws-cdk-lib/aws-secretsmanager"));
const ssm = __importStar(require("aws-cdk-lib/aws-ssm"));
/**
 * Database Construct - Handles all RDS database instances
 * Single Responsibility: Database infrastructure only
 */
class DatabaseConstruct extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.databases = new Map();
        this.provider = props.provider;
        this.vpc = props.vpc;
        this.securityGroup = props.securityGroup;
        // Create subnet group
        const subnetGroup = this.createSubnetGroup();
        // Create databases for each microservice
        this.createMicroserviceDatabases(subnetGroup);
    }
    createSubnetGroup() {
        const subnetType = this.provider.shouldUseIsolatedSubnets()
            ? ec2.SubnetType.PRIVATE_ISOLATED
            : ec2.SubnetType.PRIVATE_WITH_EGRESS;
        return new rds.SubnetGroup(this, 'SubnetGroup', {
            vpc: this.vpc,
            description: 'Subnet group for RDS databases',
            vpcSubnets: { subnetType },
            subnetGroupName: `ecommerce-db-subnet-group-${this.provider.environment}`,
        });
    }
    createMicroserviceDatabases(subnetGroup) {
        const services = ['user-service', 'product-service', 'order-service', 'payment-service', 'inventory-service'];
        services.forEach(serviceName => {
            const dbConfig = this.provider.getDatabaseConfig(serviceName);
            // Create master user secret
            const secret = new secretsmanager.Secret(this, `${serviceName}-credentials`, {
                secretName: `ecommerce/${this.provider.environment}/${serviceName}/db-credentials`,
                description: `Database credentials for ${serviceName}`,
                generateSecretString: {
                    secretStringTemplate: JSON.stringify({ username: 'admin' }),
                    generateStringKey: 'password',
                    excludeCharacters: '"@/\\',
                },
            });
            // Create RDS instance
            const database = new rds.DatabaseInstance(this, `${serviceName}-database`, {
                engine: rds.DatabaseInstanceEngine.postgres({
                    version: rds.PostgresEngineVersion.VER_14
                }),
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
                credentials: rds.Credentials.fromSecret(secret),
                databaseName: serviceName.replace('-', '_'),
                allocatedStorage: dbConfig.allocatedStorage,
                storageEncrypted: dbConfig.encryptionAtRest,
                multiAz: dbConfig.multiAZ,
                deletionProtection: dbConfig.deletionProtection,
                backupRetention: aws_cdk_lib_1.Duration.days(dbConfig.backupRetention),
                vpc: this.vpc,
                subnetGroup,
                securityGroups: [this.securityGroup],
                removalPolicy: this.provider.getRemovalPolicy(),
            });
            this.databases.set(serviceName, database);
            this.createDatabaseParameters(serviceName, database);
        });
    }
    createDatabaseParameters(serviceName, database) {
        new ssm.StringParameter(this, `${serviceName}-db-endpoint`, {
            parameterName: `/ecommerce/${this.provider.environment}/${serviceName}/database/endpoint`,
            stringValue: database.instanceEndpoint.hostname,
        });
        new ssm.StringParameter(this, `${serviceName}-db-port`, {
            parameterName: `/ecommerce/${this.provider.environment}/${serviceName}/database/port`,
            stringValue: database.instanceEndpoint.port.toString(),
        });
        new ssm.StringParameter(this, `${serviceName}-db-name`, {
            parameterName: `/ecommerce/${this.provider.environment}/${serviceName}/database/name`,
            stringValue: serviceName.replace('-', '_'),
        });
    }
}
exports.DatabaseConstruct = DatabaseConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWJhc2UtY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGF0YWJhc2UtY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQXVDO0FBQ3ZDLDZDQUF1QztBQUN2Qyx5REFBMkM7QUFDM0MseURBQTJDO0FBQzNDLCtFQUFpRTtBQUNqRSx5REFBMkM7QUFTM0M7OztHQUdHO0FBQ0gsTUFBYSxpQkFBa0IsU0FBUSxzQkFBUztJQU05QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTZCO1FBQ3JFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFOSCxjQUFTLEdBQXNDLElBQUksR0FBRyxFQUFFLENBQUM7UUFRdkUsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQy9CLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUNyQixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7UUFFekMsc0JBQXNCO1FBQ3RCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBRTdDLHlDQUF5QztRQUN6QyxJQUFJLENBQUMsMkJBQTJCLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVPLGlCQUFpQjtRQUN2QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLHdCQUF3QixFQUFFO1lBQ3pELENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLGdCQUFnQjtZQUNqQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQztRQUV2QyxPQUFPLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQzlDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztZQUNiLFdBQVcsRUFB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LENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLEdBQUcsV0FBVyxVQUFVLEVBQUU7WUFDdEQsYUFBYSxFQUFFLGNBQWMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLElBQUksV0FBVyxnQkFBZ0I7WUFDckYsV0FBVyxFQUFFLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1NBQ3ZELENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxXQUFXLFVBQVUsRUFBRTtZQUN0RCxhQUFhLEVBQUUsY0FBYyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsSUFBSSxXQUFXLGdCQUFnQjtZQUNyRixXQUFXLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO1NBQzNDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQXhGRCw4Q0F3RkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IER1cmF0aW9uIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgcmRzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1yZHMnO1xuaW1wb3J0ICogYXMgc2VjcmV0c21hbmFnZXIgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNlY3JldHNtYW5hZ2VyJztcbmltcG9ydCAqIGFzIHNzbSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3NtJztcbmltcG9ydCB7IEVudmlyb25tZW50UHJvdmlkZXIgfSBmcm9tICcuLi8uLi9wcm92aWRlcnMvZW52aXJvbm1lbnQtcHJvdmlkZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIERhdGFiYXNlQ29uc3RydWN0UHJvcHMge1xuICBwcm92aWRlcjogRW52aXJvbm1lbnRQcm92aWRlcjtcbiAgdnBjOiBlYzIuVnBjO1xuICBzZWN1cml0eUdyb3VwOiBlYzIuU2VjdXJpdHlHcm91cDtcbn1cblxuLyoqXG4gKiBEYXRhYmFzZSBDb25zdHJ1Y3QgLSBIYW5kbGVzIGFsbCBSRFMgZGF0YWJhc2UgaW5zdGFuY2VzXG4gKiBTaW5nbGUgUmVzcG9uc2liaWxpdHk6IERhdGFiYXNlIGluZnJhc3RydWN0dXJlIG9ubHlcbiAqL1xuZXhwb3J0IGNsYXNzIERhdGFiYXNlQ29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgcHVibGljIHJlYWRvbmx5IGRhdGFiYXNlczogTWFwPHN0cmluZywgcmRzLkRhdGFiYXNlSW5zdGFuY2U+ID0gbmV3IE1hcCgpO1xuICBwcml2YXRlIHJlYWRvbmx5IHByb3ZpZGVyOiBFbnZpcm9ubWVudFByb3ZpZGVyO1xuICBwcml2YXRlIHJlYWRvbmx5IHZwYzogZWMyLlZwYztcbiAgcHJpdmF0ZSByZWFkb25seSBzZWN1cml0eUdyb3VwOiBlYzIuU2VjdXJpdHlHcm91cDtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRGF0YWJhc2VDb25zdHJ1Y3RQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLnByb3ZpZGVyID0gcHJvcHMucHJvdmlkZXI7XG4gICAgdGhpcy52cGMgPSBwcm9wcy52cGM7XG4gICAgdGhpcy5zZWN1cml0eUdyb3VwID0gcHJvcHMuc2VjdXJpdHlHcm91cDtcblxuICAgIC8vIENyZWF0ZSBzdWJuZXQgZ3JvdXBcbiAgICBjb25zdCBzdWJuZXRHcm91cCA9IHRoaXMuY3JlYXRlU3VibmV0R3JvdXAoKTtcbiAgICBcbiAgICAvLyBDcmVhdGUgZGF0YWJhc2VzIGZvciBlYWNoIG1pY3Jvc2VydmljZVxuICAgIHRoaXMuY3JlYXRlTWljcm9zZXJ2aWNlRGF0YWJhc2VzKHN1Ym5ldEdyb3VwKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlU3VibmV0R3JvdXAoKTogcmRzLlN1Ym5ldEdyb3VwIHtcbiAgICBjb25zdCBzdWJuZXRUeXBlID0gdGhpcy5wcm92aWRlci5zaG91bGRVc2VJc29sYXRlZFN1Ym5ldHMoKSBcbiAgICAgID8gZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRFxuICAgICAgOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTO1xuXG4gICAgcmV0dXJuIG5ldyByZHMuU3VibmV0R3JvdXAodGhpcywgJ1N1Ym5ldEdyb3VwJywge1xuICAgICAgdnBjOiB0aGlzLnZwYyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnU3VibmV0IGdyb3VwIGZvciBSRFMgZGF0YWJhc2VzJyxcbiAgICAgIHZwY1N1Ym5ldHM6IHsgc3VibmV0VHlwZSB9LFxuICAgICAgc3VibmV0R3JvdXBOYW1lOiBgZWNvbW1lcmNlLWRiLXN1Ym5ldC1ncm91cC0ke3RoaXMucHJvdmlkZXIuZW52aXJvbm1lbnR9YCxcbiAgICB9KTtcbiAgfSAgcHJpdmF0ZSBjcmVhdGVNaWNyb3NlcnZpY2VEYXRhYmFzZXMoc3VibmV0R3JvdXA6IHJkcy5TdWJuZXRHcm91cCkge1xuICAgIGNvbnN0IHNlcnZpY2VzID0gWyd1c2VyLXNlcnZpY2UnLCAncHJvZHVjdC1zZXJ2aWNlJywgJ29yZGVyLXNlcnZpY2UnLCAncGF5bWVudC1zZXJ2aWNlJywgJ2ludmVudG9yeS1zZXJ2aWNlJ107XG5cbiAgICBzZXJ2aWNlcy5mb3JFYWNoKHNlcnZpY2VOYW1lID0+IHtcbiAgICAgIGNvbnN0IGRiQ29uZmlnID0gdGhpcy5wcm92aWRlci5nZXREYXRhYmFzZUNvbmZpZyhzZXJ2aWNlTmFtZSk7XG4gICAgICBcbiAgICAgIC8vIENyZWF0ZSBtYXN0ZXIgdXNlciBzZWNyZXRcbiAgICAgIGNvbnN0IHNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQodGhpcywgYCR7c2VydmljZU5hbWV9LWNyZWRlbnRpYWxzYCwge1xuICAgICAgICBzZWNyZXROYW1lOiBgZWNvbW1lcmNlLyR7dGhpcy5wcm92aWRlci5lbnZpcm9ubWVudH0vJHtzZXJ2aWNlTmFtZX0vZGItY3JlZGVudGlhbHNgLFxuICAgICAgICBkZXNjcmlwdGlvbjogYERhdGFiYXNlIGNyZWRlbnRpYWxzIGZvciAke3NlcnZpY2VOYW1lfWAsXG4gICAgICAgIGdlbmVyYXRlU2VjcmV0U3RyaW5nOiB7XG4gICAgICAgICAgc2VjcmV0U3RyaW5nVGVtcGxhdGU6IEpTT04uc3RyaW5naWZ5KHsgdXNlcm5hbWU6ICdhZG1pbicgfSksXG4gICAgICAgICAgZ2VuZXJhdGVTdHJpbmdLZXk6ICdwYXNzd29yZCcsXG4gICAgICAgICAgZXhjbHVkZUNoYXJhY3RlcnM6ICdcIkAvXFxcXCcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gQ3JlYXRlIFJEUyBpbnN0YW5jZVxuICAgICAgY29uc3QgZGF0YWJhc2UgPSBuZXcgcmRzLkRhdGFiYXNlSW5zdGFuY2UodGhpcywgYCR7c2VydmljZU5hbWV9LWRhdGFiYXNlYCwge1xuICAgICAgICBlbmdpbmU6IHJkcy5EYXRhYmFzZUluc3RhbmNlRW5naW5lLnBvc3RncmVzKHtcbiAgICAgICAgICB2ZXJzaW9uOiByZHMuUG9zdGdyZXNFbmdpbmVWZXJzaW9uLlZFUl8xNFxuICAgICAgICB9KSxcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLlQzLCBlYzIuSW5zdGFuY2VTaXplLk1JQ1JPKSxcbiAgICAgICAgY3JlZGVudGlhbHM6IHJkcy5DcmVkZW50aWFscy5mcm9tU2VjcmV0KHNlY3JldCksXG4gICAgICAgIGRhdGFiYXNlTmFtZTogc2VydmljZU5hbWUucmVwbGFjZSgnLScsICdfJyksXG4gICAgICAgIGFsbG9jYXRlZFN0b3JhZ2U6IGRiQ29uZmlnLmFsbG9jYXRlZFN0b3JhZ2UsXG4gICAgICAgIHN0b3JhZ2VFbmNyeXB0ZWQ6IGRiQ29uZmlnLmVuY3J5cHRpb25BdFJlc3QsXG4gICAgICAgIG11bHRpQXo6IGRiQ29uZmlnLm11bHRpQVosXG4gICAgICAgIGRlbGV0aW9uUHJvdGVjdGlvbjogZGJDb25maWcuZGVsZXRpb25Qcm90ZWN0aW9uLFxuICAgICAgICBiYWNrdXBSZXRlbnRpb246IER1cmF0aW9uLmRheXMoZGJDb25maWcuYmFja3VwUmV0ZW50aW9uKSxcbiAgICAgICAgdnBjOiB0aGlzLnZwYyxcbiAgICAgICAgc3VibmV0R3JvdXAsXG4gICAgICAgIHNlY3VyaXR5R3JvdXBzOiBbdGhpcy5zZWN1cml0eUdyb3VwXSxcbiAgICAgICAgcmVtb3ZhbFBvbGljeTogdGhpcy5wcm92aWRlci5nZXRSZW1vdmFsUG9saWN5KCksXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5kYXRhYmFzZXMuc2V0KHNlcnZpY2VOYW1lLCBkYXRhYmFzZSk7XG4gICAgICB0aGlzLmNyZWF0ZURhdGFiYXNlUGFyYW1ldGVycyhzZXJ2aWNlTmFtZSwgZGF0YWJhc2UpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVEYXRhYmFzZVBhcmFtZXRlcnMoc2VydmljZU5hbWU6IHN0cmluZywgZGF0YWJhc2U6IHJkcy5EYXRhYmFzZUluc3RhbmNlKSB7XG4gICAgbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIodGhpcywgYCR7c2VydmljZU5hbWV9LWRiLWVuZHBvaW50YCwge1xuICAgICAgcGFyYW1ldGVyTmFtZTogYC9lY29tbWVyY2UvJHt0aGlzLnByb3ZpZGVyLmVudmlyb25tZW50fS8ke3NlcnZpY2VOYW1lfS9kYXRhYmFzZS9lbmRwb2ludGAsXG4gICAgICBzdHJpbmdWYWx1ZTogZGF0YWJhc2UuaW5zdGFuY2VFbmRwb2ludC5ob3N0bmFtZSxcbiAgICB9KTtcblxuICAgIG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHRoaXMsIGAke3NlcnZpY2VOYW1lfS1kYi1wb3J0YCwge1xuICAgICAgcGFyYW1ldGVyTmFtZTogYC9lY29tbWVyY2UvJHt0aGlzLnByb3ZpZGVyLmVudmlyb25tZW50fS8ke3NlcnZpY2VOYW1lfS9kYXRhYmFzZS9wb3J0YCxcbiAgICAgIHN0cmluZ1ZhbHVlOiBkYXRhYmFzZS5pbnN0YW5jZUVuZHBvaW50LnBvcnQudG9TdHJpbmcoKSxcbiAgICB9KTtcblxuICAgIG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHRoaXMsIGAke3NlcnZpY2VOYW1lfS1kYi1uYW1lYCwge1xuICAgICAgcGFyYW1ldGVyTmFtZTogYC9lY29tbWVyY2UvJHt0aGlzLnByb3ZpZGVyLmVudmlyb25tZW50fS8ke3NlcnZpY2VOYW1lfS9kYXRhYmFzZS9uYW1lYCxcbiAgICAgIHN0cmluZ1ZhbHVlOiBzZXJ2aWNlTmFtZS5yZXBsYWNlKCctJywgJ18nKSxcbiAgICB9KTtcbiAgfVxufSJdfQ==