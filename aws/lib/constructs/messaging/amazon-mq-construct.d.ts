import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as mq from 'aws-cdk-lib/aws-amazonmq';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { EnvironmentProvider } from '../../providers/environment-provider';
export interface AmazonMQConstructProps {
    provider: EnvironmentProvider;
    vpc: ec2.Vpc;
    securityGroup: ec2.SecurityGroup;
}
/**
 * Amazon MQ Construct - Handles message broker infrastructure
 * Supports both RabbitMQ and ActiveMQ engines
 */
export declare class AmazonMQConstruct extends Construct {
    readonly broker: mq.CfnBroker;
    readonly credentials: secretsmanager.Secret;
    private readonly provider;
    constructor(scope: Construct, id: string, props: AmazonMQConstructProps);
    private createBrokerCredentials;
    private createBroker;
    private getBrokerSubnetIds;
    private createBrokerConfiguration;
    private getRabbitMQConfiguration;
    private exportBrokerEndpoints;
}
