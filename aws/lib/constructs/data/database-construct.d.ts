import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { EnvironmentProvider } from '../../providers/environment-provider';
export interface DatabaseConstructProps {
    provider: EnvironmentProvider;
    vpc: ec2.Vpc;
    securityGroup: ec2.SecurityGroup;
}
/**
 * Database Construct - Handles all RDS database instances
 * Single Responsibility: Database infrastructure only
 */
export declare class DatabaseConstruct extends Construct {
    readonly databases: Map<string, rds.DatabaseInstance>;
    private readonly provider;
    private readonly vpc;
    private readonly securityGroup;
    constructor(scope: Construct, id: string, props: DatabaseConstructProps);
    private createSubnetGroup;
    private createMicroserviceDatabases;
    private createDatabaseParameters;
}
