#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EcommerceInfrastructure } from '../lib/ecommerce-infrastructure';
import { ENVIRONMENT_CONFIGS } from '../config/environments';

const app = new cdk.App();

// Get environment from context or default to 'local'
const environmentName = app.node.tryGetContext('environment') || 'local';
const config = ENVIRONMENT_CONFIGS[environmentName];

if (!config) {
  throw new Error(`Unknown environment: ${environmentName}. Available environments: ${Object.keys(ENVIRONMENT_CONFIGS).join(', ')}`);
}

// Create stack with environment-specific configuration
new EcommerceInfrastructure(app, `EcommerceInfrastructure-${config.environment}`, {
  config,
  env: config.isLocalStack ? undefined : {
    account: config.account || process.env.CDK_DEFAULT_ACCOUNT,
    region: config.region,
  },
  description: `Ecommerce platform infrastructure for ${config.environment} environment${config.isLocalStack ? ' (LocalStack)' : ' (AWS)'}`,
});

app.synth();