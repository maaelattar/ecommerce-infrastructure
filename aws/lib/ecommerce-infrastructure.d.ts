import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EnvironmentConfig } from '../config/environments';
import { VpcConstruct } from './constructs/networking/vpc-construct';
import { DatabaseConstruct } from './constructs/data/database-construct';
import { CacheConstruct } from './constructs/data/cache-construct';
export interface EcommerceInfrastructureProps extends StackProps {
    config: EnvironmentConfig;
}
/**
 * Refactored EcommerceInfrastructure - Now follows SOLID principles
 *
 * Single Responsibility: Orchestrates infrastructure components
 * Open/Closed: Easy to extend with new constructs
 * Composition over Inheritance: Uses construct composition
 * Strategy Pattern: Environment differences handled by providers
 */
export declare class EcommerceInfrastructure extends Stack {
    readonly vpc: VpcConstruct;
    readonly database: DatabaseConstruct;
    readonly cache: CacheConstruct;
    constructor(scope: Construct, id: string, props: EcommerceInfrastructureProps);
}
