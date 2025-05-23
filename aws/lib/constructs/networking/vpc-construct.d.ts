import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EnvironmentProvider } from '../../providers/environment-provider';
export interface VpcConstructProps {
    provider: EnvironmentProvider;
}
/**
 * VPC Construct - Handles all networking concerns
 * Single Responsibility: Network infrastructure only
 */
export declare class VpcConstruct extends Construct {
    readonly vpc: ec2.Vpc;
    readonly securityGroups: Map<string, ec2.SecurityGroup>;
    constructor(scope: Construct, id: string, props: VpcConstructProps);
    private getSubnetConfiguration;
    private createSecurityGroups;
}
