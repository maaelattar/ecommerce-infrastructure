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
exports.AmazonMQConstruct = void 0;
const constructs_1 = require("constructs");
const ec2 = __importStar(require("aws-cdk-lib/aws-ec2"));
const mq = __importStar(require("aws-cdk-lib/aws-amazonmq"));
const secretsmanager = __importStar(require("aws-cdk-lib/aws-secretsmanager"));
const ssm = __importStar(require("aws-cdk-lib/aws-ssm"));
/**
 * Amazon MQ Construct - Handles message broker infrastructure
 * Supports both RabbitMQ and ActiveMQ engines
 */
class AmazonMQConstruct extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.provider = props.provider;
        // Create broker credentials
        this.credentials = this.createBrokerCredentials();
        // Create Amazon MQ broker
        this.broker = this.createBroker(props.vpc, props.securityGroup);
        // Export broker endpoints
        this.exportBrokerEndpoints();
    }
    createBrokerCredentials() {
        return new secretsmanager.Secret(this, 'BrokerCredentials', {
            secretName: `ecommerce/amazonmq/credentials/${this.provider.environment}`,
            description: 'Amazon MQ broker credentials',
            generateSecretString: {
                secretStringTemplate: JSON.stringify({ username: 'ecommerce' }),
                generateStringKey: 'password',
                excludeCharacters: '"@/\\\'',
                passwordLength: 16,
            },
        });
    }
    createBroker(vpc, securityGroup) {
        const brokerName = `ecommerce-mq-${this.provider.environment}`;
        // Get subnet IDs for broker deployment
        const subnetIds = this.getBrokerSubnetIds(vpc);
        const broker = new mq.CfnBroker(this, 'Broker', {
            brokerName,
            engineType: 'RabbitMQ',
            engineVersion: '3.11.20',
            hostInstanceType: this.provider.getAmazonMQInstanceType(),
            deploymentMode: this.provider.isProduction() ? 'CLUSTER_MULTI_AZ' : 'SINGLE_INSTANCE',
            // Network configuration
            subnetIds: this.provider.isProduction() ? subnetIds : [subnetIds[0]],
            securityGroups: [securityGroup.securityGroupId],
            publiclyAccessible: this.provider.shouldExposePublicly(),
            // Storage and maintenance
            storageType: this.provider.isProduction() ? 'EFS' : 'EBS',
            autoMinorVersionUpgrade: true,
            maintenanceWindowStartTime: {
                dayOfWeek: 'Sunday',
                timeOfDay: '03:00',
                timeZone: 'UTC',
            },
            // Authentication
            authenticationStrategy: 'SIMPLE',
            users: [{
                    username: 'ecommerce',
                    password: this.credentials.secretValueFromJson('password').unsafeUnwrap(),
                    consoleAccess: true,
                    groups: ['admin'],
                }],
            // Configuration for RabbitMQ
            configuration: this.createBrokerConfiguration(),
            // Logs
            logs: {
                general: true,
                audit: this.provider.isProduction(),
            },
            // Encryption
            encryptionOptions: this.provider.isProduction() ? {
                useAwsOwnedKey: false,
                kmsKeyId: 'alias/aws/mq',
            } : undefined,
            // Tags
            tags: [
                { key: 'Environment', value: this.provider.environment },
                { key: 'Service', value: 'ecommerce' },
                { key: 'Component', value: 'messaging' },
            ],
        });
        return broker;
    }
    getBrokerSubnetIds(vpc) {
        const subnetType = this.provider.shouldUseIsolatedSubnets()
            ? ec2.SubnetType.PRIVATE_ISOLATED
            : ec2.SubnetType.PRIVATE_WITH_EGRESS;
        return vpc.selectSubnets({ subnetType }).subnetIds;
    }
    createBrokerConfiguration() {
        const configuration = new mq.CfnConfiguration(this, 'Configuration', {
            name: `ecommerce-mq-config-${this.provider.environment}`,
            description: 'RabbitMQ configuration for ecommerce platform',
            engineType: 'RabbitMQ',
            engineVersion: '3.11.20',
            // RabbitMQ configuration
            data: this.getRabbitMQConfiguration(),
        });
        return {
            id: configuration.attrId,
            revision: 1,
        };
    }
    getRabbitMQConfiguration() {
        // RabbitMQ configuration optimized for ecommerce workloads
        const config = {
            // Connection limits
            'connection_max': this.provider.isProduction() ? 1000 : 100,
            'channel_max': this.provider.isProduction() ? 2000 : 200,
            // Memory and disk limits
            'vm_memory_high_watermark': 0.8,
            'disk_free_limit': '1GB',
            // Queue settings
            'default_vhost': 'ecommerce',
            'default_user': 'ecommerce',
            'default_permissions': {
                'configure': '.*',
                'write': '.*',
                'read': '.*',
            },
            // Logging
            'log.console': 'true',
            'log.console.level': this.provider.isProduction() ? 'info' : 'debug',
            'log.file': 'false',
            // Management plugin
            'management.tcp.port': 15672,
            'management.load_definitions': '/tmp/definitions.json',
            // Clustering (for production)
            ...(this.provider.isProduction() && {
                'cluster_formation.peer_discovery_backend': 'aws',
                'cluster_formation.aws.region': this.provider.region,
                'cluster_formation.aws.use_autoscaling_group': 'true',
            }),
        };
        return Buffer.from(JSON.stringify(config, null, 2)).toString('base64');
    }
    exportBrokerEndpoints() {
        // Export broker endpoints for other services to use
        new ssm.StringParameter(this, 'BrokerEndpoint', {
            parameterName: `/ecommerce/${this.provider.environment}/amazonmq/endpoint`,
            stringValue: this.broker.attrAmqpEndpoints[0],
            description: 'Amazon MQ AMQP endpoint',
        });
        new ssm.StringParameter(this, 'BrokerConsoleUrl', {
            parameterName: `/ecommerce/${this.provider.environment}/amazonmq/console-url`,
            stringValue: `https://${this.broker.ref}.mq.${this.provider.region}.amazonaws.com`,
            description: 'Amazon MQ management console URL',
        });
        new ssm.StringParameter(this, 'BrokerCredentialsArn', {
            parameterName: `/ecommerce/${this.provider.environment}/amazonmq/credentials-arn`,
            stringValue: this.credentials.secretArn,
            description: 'Amazon MQ credentials secret ARN',
        });
    }
}
exports.AmazonMQConstruct = AmazonMQConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1hem9uLW1xLWNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFtYXpvbi1tcS1jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBdUM7QUFFdkMseURBQTJDO0FBQzNDLDZEQUErQztBQUMvQywrRUFBaUU7QUFDakUseURBQTJDO0FBUzNDOzs7R0FHRztBQUNILE1BQWEsaUJBQWtCLFNBQVEsc0JBQVM7SUFLOUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE2QjtRQUNyRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUUvQiw0QkFBNEI7UUFDNUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUVsRCwwQkFBMEI7UUFDMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRWhFLDBCQUEwQjtRQUMxQixJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBRU8sdUJBQXVCO1FBQzdCLE9BQU8sSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUMxRCxVQUFVLEVBQUUsa0NBQWtDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFO1lBQ3pFLFdBQVcsRUFBRSw4QkFBOEI7WUFDM0Msb0JBQW9CLEVBQUU7Z0JBQ3BCLG9CQUFvQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLENBQUM7Z0JBQy9ELGlCQUFpQixFQUFFLFVBQVU7Z0JBQzdCLGlCQUFpQixFQUFFLFNBQVM7Z0JBQzVCLGNBQWMsRUFB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LEVBQUUsa0NBQWtDO1NBQ2hELENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLEVBQUU7WUFDcEQsYUFBYSxFQUFFLGNBQWMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLDJCQUEyQjtZQUNqRixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTO1lBQ3ZDLFdBQVcsRUFBRSxrQ0FBa0M7U0FDaEQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBcExELDhDQW9MQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgRHVyYXRpb24gfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBtcSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYW1hem9ubXEnO1xuaW1wb3J0ICogYXMgc2VjcmV0c21hbmFnZXIgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNlY3JldHNtYW5hZ2VyJztcbmltcG9ydCAqIGFzIHNzbSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3NtJztcbmltcG9ydCB7IEVudmlyb25tZW50UHJvdmlkZXIgfSBmcm9tICcuLi8uLi9wcm92aWRlcnMvZW52aXJvbm1lbnQtcHJvdmlkZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFtYXpvbk1RQ29uc3RydWN0UHJvcHMge1xuICBwcm92aWRlcjogRW52aXJvbm1lbnRQcm92aWRlcjtcbiAgdnBjOiBlYzIuVnBjO1xuICBzZWN1cml0eUdyb3VwOiBlYzIuU2VjdXJpdHlHcm91cDtcbn1cblxuLyoqXG4gKiBBbWF6b24gTVEgQ29uc3RydWN0IC0gSGFuZGxlcyBtZXNzYWdlIGJyb2tlciBpbmZyYXN0cnVjdHVyZVxuICogU3VwcG9ydHMgYm90aCBSYWJiaXRNUSBhbmQgQWN0aXZlTVEgZW5naW5lc1xuICovXG5leHBvcnQgY2xhc3MgQW1hem9uTVFDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBwdWJsaWMgcmVhZG9ubHkgYnJva2VyOiBtcS5DZm5Ccm9rZXI7XG4gIHB1YmxpYyByZWFkb25seSBjcmVkZW50aWFsczogc2VjcmV0c21hbmFnZXIuU2VjcmV0O1xuICBwcml2YXRlIHJlYWRvbmx5IHByb3ZpZGVyOiBFbnZpcm9ubWVudFByb3ZpZGVyO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBBbWF6b25NUUNvbnN0cnVjdFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMucHJvdmlkZXIgPSBwcm9wcy5wcm92aWRlcjtcblxuICAgIC8vIENyZWF0ZSBicm9rZXIgY3JlZGVudGlhbHNcbiAgICB0aGlzLmNyZWRlbnRpYWxzID0gdGhpcy5jcmVhdGVCcm9rZXJDcmVkZW50aWFscygpO1xuXG4gICAgLy8gQ3JlYXRlIEFtYXpvbiBNUSBicm9rZXJcbiAgICB0aGlzLmJyb2tlciA9IHRoaXMuY3JlYXRlQnJva2VyKHByb3BzLnZwYywgcHJvcHMuc2VjdXJpdHlHcm91cCk7XG5cbiAgICAvLyBFeHBvcnQgYnJva2VyIGVuZHBvaW50c1xuICAgIHRoaXMuZXhwb3J0QnJva2VyRW5kcG9pbnRzKCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUJyb2tlckNyZWRlbnRpYWxzKCk6IHNlY3JldHNtYW5hZ2VyLlNlY3JldCB7XG4gICAgcmV0dXJuIG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQodGhpcywgJ0Jyb2tlckNyZWRlbnRpYWxzJywge1xuICAgICAgc2VjcmV0TmFtZTogYGVjb21tZXJjZS9hbWF6b25tcS9jcmVkZW50aWFscy8ke3RoaXMucHJvdmlkZXIuZW52aXJvbm1lbnR9YCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQW1hem9uIE1RIGJyb2tlciBjcmVkZW50aWFscycsXG4gICAgICBnZW5lcmF0ZVNlY3JldFN0cmluZzoge1xuICAgICAgICBzZWNyZXRTdHJpbmdUZW1wbGF0ZTogSlNPTi5zdHJpbmdpZnkoeyB1c2VybmFtZTogJ2Vjb21tZXJjZScgfSksXG4gICAgICAgIGdlbmVyYXRlU3RyaW5nS2V5OiAncGFzc3dvcmQnLFxuICAgICAgICBleGNsdWRlQ2hhcmFjdGVyczogJ1wiQC9cXFxcXFwnJyxcbiAgICAgICAgcGFzc3dvcmRMZW5ndGg6IDE2LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQnJva2VyKHZwYzogZWMyLlZwYywgc2VjdXJpdHlHcm91cDogZWMyLlNlY3VyaXR5R3JvdXApOiBtcS5DZm5Ccm9rZXIge1xuICAgIGNvbnN0IGJyb2tlck5hbWUgPSBgZWNvbW1lcmNlLW1xLSR7dGhpcy5wcm92aWRlci5lbnZpcm9ubWVudH1gO1xuICAgIFxuICAgIC8vIEdldCBzdWJuZXQgSURzIGZvciBicm9rZXIgZGVwbG95bWVudFxuICAgIGNvbnN0IHN1Ym5ldElkcyA9IHRoaXMuZ2V0QnJva2VyU3VibmV0SWRzKHZwYyk7XG5cbiAgICBjb25zdCBicm9rZXIgPSBuZXcgbXEuQ2ZuQnJva2VyKHRoaXMsICdCcm9rZXInLCB7XG4gICAgICBicm9rZXJOYW1lLFxuICAgICAgZW5naW5lVHlwZTogJ1JhYmJpdE1RJyxcbiAgICAgIGVuZ2luZVZlcnNpb246ICczLjExLjIwJywgLy8gTGF0ZXN0IHN1cHBvcnRlZCB2ZXJzaW9uXG4gICAgICBob3N0SW5zdGFuY2VUeXBlOiB0aGlzLnByb3ZpZGVyLmdldEFtYXpvbk1RSW5zdGFuY2VUeXBlKCksXG4gICAgICBkZXBsb3ltZW50TW9kZTogdGhpcy5wcm92aWRlci5pc1Byb2R1Y3Rpb24oKSA/ICdDTFVTVEVSX01VTFRJX0FaJyA6ICdTSU5HTEVfSU5TVEFOQ0UnLFxuICAgICAgXG4gICAgICAvLyBOZXR3b3JrIGNvbmZpZ3VyYXRpb25cbiAgICAgIHN1Ym5ldElkczogdGhpcy5wcm92aWRlci5pc1Byb2R1Y3Rpb24oKSA/IHN1Ym5ldElkcyA6IFtzdWJuZXRJZHNbMF1dLFxuICAgICAgc2VjdXJpdHlHcm91cHM6IFtzZWN1cml0eUdyb3VwLnNlY3VyaXR5R3JvdXBJZF0sXG4gICAgICBwdWJsaWNseUFjY2Vzc2libGU6IHRoaXMucHJvdmlkZXIuc2hvdWxkRXhwb3NlUHVibGljbHkoKSxcblxuICAgICAgLy8gU3RvcmFnZSBhbmQgbWFpbnRlbmFuY2VcbiAgICAgIHN0b3JhZ2VUeXBlOiB0aGlzLnByb3ZpZGVyLmlzUHJvZHVjdGlvbigpID8gJ0VGUycgOiAnRUJTJyxcbiAgICAgIGF1dG9NaW5vclZlcnNpb25VcGdyYWRlOiB0cnVlLFxuICAgICAgbWFpbnRlbmFuY2VXaW5kb3dTdGFydFRpbWU6IHtcbiAgICAgICAgZGF5T2ZXZWVrOiAnU3VuZGF5JyxcbiAgICAgICAgdGltZU9mRGF5OiAnMDM6MDAnLFxuICAgICAgICB0aW1lWm9uZTogJ1VUQycsXG4gICAgICB9LFxuXG4gICAgICAvLyBBdXRoZW50aWNhdGlvblxuICAgICAgYXV0aGVudGljYXRpb25TdHJhdGVneTogJ1NJTVBMRScsXG4gICAgICB1c2VyczogW3tcbiAgICAgICAgdXNlcm5hbWU6ICdlY29tbWVyY2UnLFxuICAgICAgICBwYXNzd29yZDogdGhpcy5jcmVkZW50aWFscy5zZWNyZXRWYWx1ZUZyb21Kc29uKCdwYXNzd29yZCcpLnVuc2FmZVVud3JhcCgpLFxuICAgICAgICBjb25zb2xlQWNjZXNzOiB0cnVlLFxuICAgICAgICBncm91cHM6IFsnYWRtaW4nXSxcbiAgICAgIH1dLFxuXG4gICAgICAvLyBDb25maWd1cmF0aW9uIGZvciBSYWJiaXRNUVxuICAgICAgY29uZmlndXJhdGlvbjogdGhpcy5jcmVhdGVCcm9rZXJDb25maWd1cmF0aW9uKCksXG5cbiAgICAgIC8vIExvZ3NcbiAgICAgIGxvZ3M6IHtcbiAgICAgICAgZ2VuZXJhbDogdHJ1ZSxcbiAgICAgICAgYXVkaXQ6IHRoaXMucHJvdmlkZXIuaXNQcm9kdWN0aW9uKCksXG4gICAgICB9LFxuXG4gICAgICAvLyBFbmNyeXB0aW9uXG4gICAgICBlbmNyeXB0aW9uT3B0aW9uczogdGhpcy5wcm92aWRlci5pc1Byb2R1Y3Rpb24oKSA/IHtcbiAgICAgICAgdXNlQXdzT3duZWRLZXk6IGZhbHNlLFxuICAgICAgICBrbXNLZXlJZDogJ2FsaWFzL2F3cy9tcScsXG4gICAgICB9IDogdW5kZWZpbmVkLFxuXG4gICAgICAvLyBUYWdzXG4gICAgICB0YWdzOiBbXG4gICAgICAgIHsga2V5OiAnRW52aXJvbm1lbnQnLCB2YWx1ZTogdGhpcy5wcm92aWRlci5lbnZpcm9ubWVudCB9LFxuICAgICAgICB7IGtleTogJ1NlcnZpY2UnLCB2YWx1ZTogJ2Vjb21tZXJjZScgfSxcbiAgICAgICAgeyBrZXk6ICdDb21wb25lbnQnLCB2YWx1ZTogJ21lc3NhZ2luZycgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gYnJva2VyO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRCcm9rZXJTdWJuZXRJZHModnBjOiBlYzIuVnBjKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IHN1Ym5ldFR5cGUgPSB0aGlzLnByb3ZpZGVyLnNob3VsZFVzZUlzb2xhdGVkU3VibmV0cygpXG4gICAgICA/IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURURcbiAgICAgIDogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUztcblxuICAgIHJldHVybiB2cGMuc2VsZWN0U3VibmV0cyh7IHN1Ym5ldFR5cGUgfSkuc3VibmV0SWRzO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVCcm9rZXJDb25maWd1cmF0aW9uKCk6IG1xLkNmbkJyb2tlci5Db25maWd1cmF0aW9uSWRQcm9wZXJ0eSB7XG4gICAgY29uc3QgY29uZmlndXJhdGlvbiA9IG5ldyBtcS5DZm5Db25maWd1cmF0aW9uKHRoaXMsICdDb25maWd1cmF0aW9uJywge1xuICAgICAgbmFtZTogYGVjb21tZXJjZS1tcS1jb25maWctJHt0aGlzLnByb3ZpZGVyLmVudmlyb25tZW50fWAsXG4gICAgICBkZXNjcmlwdGlvbjogJ1JhYmJpdE1RIGNvbmZpZ3VyYXRpb24gZm9yIGVjb21tZXJjZSBwbGF0Zm9ybScsXG4gICAgICBlbmdpbmVUeXBlOiAnUmFiYml0TVEnLFxuICAgICAgZW5naW5lVmVyc2lvbjogJzMuMTEuMjAnLFxuICAgICAgXG4gICAgICAvLyBSYWJiaXRNUSBjb25maWd1cmF0aW9uXG4gICAgICBkYXRhOiB0aGlzLmdldFJhYmJpdE1RQ29uZmlndXJhdGlvbigpLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBjb25maWd1cmF0aW9uLmF0dHJJZCxcbiAgICAgIHJldmlzaW9uOiAxLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGdldFJhYmJpdE1RQ29uZmlndXJhdGlvbigpOiBzdHJpbmcge1xuICAgIC8vIFJhYmJpdE1RIGNvbmZpZ3VyYXRpb24gb3B0aW1pemVkIGZvciBlY29tbWVyY2Ugd29ya2xvYWRzXG4gICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgLy8gQ29ubmVjdGlvbiBsaW1pdHNcbiAgICAgICdjb25uZWN0aW9uX21heCc6IHRoaXMucHJvdmlkZXIuaXNQcm9kdWN0aW9uKCkgPyAxMDAwIDogMTAwLFxuICAgICAgJ2NoYW5uZWxfbWF4JzogdGhpcy5wcm92aWRlci5pc1Byb2R1Y3Rpb24oKSA/IDIwMDAgOiAyMDAsXG4gICAgICBcbiAgICAgIC8vIE1lbW9yeSBhbmQgZGlzayBsaW1pdHNcbiAgICAgICd2bV9tZW1vcnlfaGlnaF93YXRlcm1hcmsnOiAwLjgsXG4gICAgICAnZGlza19mcmVlX2xpbWl0JzogJzFHQicsXG4gICAgICBcbiAgICAgIC8vIFF1ZXVlIHNldHRpbmdzXG4gICAgICAnZGVmYXVsdF92aG9zdCc6ICdlY29tbWVyY2UnLFxuICAgICAgJ2RlZmF1bHRfdXNlcic6ICdlY29tbWVyY2UnLFxuICAgICAgJ2RlZmF1bHRfcGVybWlzc2lvbnMnOiB7XG4gICAgICAgICdjb25maWd1cmUnOiAnLionLFxuICAgICAgICAnd3JpdGUnOiAnLionLFxuICAgICAgICAncmVhZCc6ICcuKicsXG4gICAgICB9LFxuXG4gICAgICAvLyBMb2dnaW5nXG4gICAgICAnbG9nLmNvbnNvbGUnOiAndHJ1ZScsXG4gICAgICAnbG9nLmNvbnNvbGUubGV2ZWwnOiB0aGlzLnByb3ZpZGVyLmlzUHJvZHVjdGlvbigpID8gJ2luZm8nIDogJ2RlYnVnJyxcbiAgICAgICdsb2cuZmlsZSc6ICdmYWxzZScsXG5cbiAgICAgIC8vIE1hbmFnZW1lbnQgcGx1Z2luXG4gICAgICAnbWFuYWdlbWVudC50Y3AucG9ydCc6IDE1NjcyLFxuICAgICAgJ21hbmFnZW1lbnQubG9hZF9kZWZpbml0aW9ucyc6ICcvdG1wL2RlZmluaXRpb25zLmpzb24nLFxuXG4gICAgICAvLyBDbHVzdGVyaW5nIChmb3IgcHJvZHVjdGlvbilcbiAgICAgIC4uLih0aGlzLnByb3ZpZGVyLmlzUHJvZHVjdGlvbigpICYmIHtcbiAgICAgICAgJ2NsdXN0ZXJfZm9ybWF0aW9uLnBlZXJfZGlzY292ZXJ5X2JhY2tlbmQnOiAnYXdzJyxcbiAgICAgICAgJ2NsdXN0ZXJfZm9ybWF0aW9uLmF3cy5yZWdpb24nOiB0aGlzLnByb3ZpZGVyLnJlZ2lvbixcbiAgICAgICAgJ2NsdXN0ZXJfZm9ybWF0aW9uLmF3cy51c2VfYXV0b3NjYWxpbmdfZ3JvdXAnOiAndHJ1ZScsXG4gICAgICB9KSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKEpTT04uc3RyaW5naWZ5KGNvbmZpZywgbnVsbCwgMikpLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgfVxuXG4gIHByaXZhdGUgZXhwb3J0QnJva2VyRW5kcG9pbnRzKCk6IHZvaWQge1xuICAgIC8vIEV4cG9ydCBicm9rZXIgZW5kcG9pbnRzIGZvciBvdGhlciBzZXJ2aWNlcyB0byB1c2VcbiAgICBuZXcgc3NtLlN0cmluZ1BhcmFtZXRlcih0aGlzLCAnQnJva2VyRW5kcG9pbnQnLCB7XG4gICAgICBwYXJhbWV0ZXJOYW1lOiBgL2Vjb21tZXJjZS8ke3RoaXMucHJvdmlkZXIuZW52aXJvbm1lbnR9L2FtYXpvbm1xL2VuZHBvaW50YCxcbiAgICAgIHN0cmluZ1ZhbHVlOiB0aGlzLmJyb2tlci5hdHRyQW1xcEVuZHBvaW50c1swXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQW1hem9uIE1RIEFNUVAgZW5kcG9pbnQnLFxuICAgIH0pO1xuXG4gICAgbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIodGhpcywgJ0Jyb2tlckNvbnNvbGVVcmwnLCB7XG4gICAgICBwYXJhbWV0ZXJOYW1lOiBgL2Vjb21tZXJjZS8ke3RoaXMucHJvdmlkZXIuZW52aXJvbm1lbnR9L2FtYXpvbm1xL2NvbnNvbGUtdXJsYCxcbiAgICAgIHN0cmluZ1ZhbHVlOiBgaHR0cHM6Ly8ke3RoaXMuYnJva2VyLnJlZn0ubXEuJHt0aGlzLnByb3ZpZGVyLnJlZ2lvbn0uYW1hem9uYXdzLmNvbWAsXG4gICAgICBkZXNjcmlwdGlvbjogJ0FtYXpvbiBNUSBtYW5hZ2VtZW50IGNvbnNvbGUgVVJMJyxcbiAgICB9KTtcblxuICAgIG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHRoaXMsICdCcm9rZXJDcmVkZW50aWFsc0FybicsIHtcbiAgICAgIHBhcmFtZXRlck5hbWU6IGAvZWNvbW1lcmNlLyR7dGhpcy5wcm92aWRlci5lbnZpcm9ubWVudH0vYW1hem9ubXEvY3JlZGVudGlhbHMtYXJuYCxcbiAgICAgIHN0cmluZ1ZhbHVlOiB0aGlzLmNyZWRlbnRpYWxzLnNlY3JldEFybixcbiAgICAgIGRlc2NyaXB0aW9uOiAnQW1hem9uIE1RIGNyZWRlbnRpYWxzIHNlY3JldCBBUk4nLFxuICAgIH0pO1xuICB9XG59Il19