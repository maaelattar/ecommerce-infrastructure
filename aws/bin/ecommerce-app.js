#!/usr/bin/env node
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
require("source-map-support/register");
const cdk = __importStar(require("aws-cdk-lib"));
const ecommerce_infrastructure_1 = require("../lib/ecommerce-infrastructure");
const environments_1 = require("../config/environments");
const app = new cdk.App();
// Get environment from context or default to 'local'
const environmentName = app.node.tryGetContext('environment') || 'local';
const config = environments_1.ENVIRONMENT_CONFIGS[environmentName];
if (!config) {
    throw new Error(`Unknown environment: ${environmentName}. Available environments: ${Object.keys(environments_1.ENVIRONMENT_CONFIGS).join(', ')}`);
}
// Create stack with environment-specific configuration
new ecommerce_infrastructure_1.EcommerceInfrastructure(app, `EcommerceInfrastructure-${config.environment}`, {
    config,
    env: config.isLocalStack ? undefined : {
        account: config.account || process.env.CDK_DEFAULT_ACCOUNT,
        region: config.region,
    },
    description: `Ecommerce platform infrastructure for ${config.environment} environment${config.isLocalStack ? ' (LocalStack)' : ' (AWS)'}`,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNvbW1lcmNlLWFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVjb21tZXJjZS1hcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSx1Q0FBcUM7QUFDckMsaURBQW1DO0FBQ25DLDhFQUEwRTtBQUMxRSx5REFBNkQ7QUFFN0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIscURBQXFEO0FBQ3JELE1BQU0sZUFBZSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLE9BQU8sQ0FBQztBQUN6RSxNQUFNLE1BQU0sR0FBRyxrQ0FBbUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUVwRCxJQUFJLENBQUMsTUFBTSxFQUFFO0lBQ1gsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsZUFBZSw2QkFBNkIsTUFBTSxDQUFDLElBQUksQ0FBQyxrQ0FBbUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Q0FDcEk7QUFFRCx1REFBdUQ7QUFDdkQsSUFBSSxrREFBdUIsQ0FBQyxHQUFHLEVBQUUsMkJBQTJCLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRTtJQUNoRixNQUFNO0lBQ04sR0FBRyxFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDckMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUI7UUFDMUQsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNO0tBQ3RCO0lBQ0QsV0FBVyxFQUFFLHlDQUF5QyxNQUFNLENBQUMsV0FBVyxlQUFlLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFO0NBQzFJLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCAnc291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBFY29tbWVyY2VJbmZyYXN0cnVjdHVyZSB9IGZyb20gJy4uL2xpYi9lY29tbWVyY2UtaW5mcmFzdHJ1Y3R1cmUnO1xuaW1wb3J0IHsgRU5WSVJPTk1FTlRfQ09ORklHUyB9IGZyb20gJy4uL2NvbmZpZy9lbnZpcm9ubWVudHMnO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG4vLyBHZXQgZW52aXJvbm1lbnQgZnJvbSBjb250ZXh0IG9yIGRlZmF1bHQgdG8gJ2xvY2FsJ1xuY29uc3QgZW52aXJvbm1lbnROYW1lID0gYXBwLm5vZGUudHJ5R2V0Q29udGV4dCgnZW52aXJvbm1lbnQnKSB8fCAnbG9jYWwnO1xuY29uc3QgY29uZmlnID0gRU5WSVJPTk1FTlRfQ09ORklHU1tlbnZpcm9ubWVudE5hbWVdO1xuXG5pZiAoIWNvbmZpZykge1xuICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gZW52aXJvbm1lbnQ6ICR7ZW52aXJvbm1lbnROYW1lfS4gQXZhaWxhYmxlIGVudmlyb25tZW50czogJHtPYmplY3Qua2V5cyhFTlZJUk9OTUVOVF9DT05GSUdTKS5qb2luKCcsICcpfWApO1xufVxuXG4vLyBDcmVhdGUgc3RhY2sgd2l0aCBlbnZpcm9ubWVudC1zcGVjaWZpYyBjb25maWd1cmF0aW9uXG5uZXcgRWNvbW1lcmNlSW5mcmFzdHJ1Y3R1cmUoYXBwLCBgRWNvbW1lcmNlSW5mcmFzdHJ1Y3R1cmUtJHtjb25maWcuZW52aXJvbm1lbnR9YCwge1xuICBjb25maWcsXG4gIGVudjogY29uZmlnLmlzTG9jYWxTdGFjayA/IHVuZGVmaW5lZCA6IHtcbiAgICBhY2NvdW50OiBjb25maWcuYWNjb3VudCB8fCBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9BQ0NPVU5ULFxuICAgIHJlZ2lvbjogY29uZmlnLnJlZ2lvbixcbiAgfSxcbiAgZGVzY3JpcHRpb246IGBFY29tbWVyY2UgcGxhdGZvcm0gaW5mcmFzdHJ1Y3R1cmUgZm9yICR7Y29uZmlnLmVudmlyb25tZW50fSBlbnZpcm9ubWVudCR7Y29uZmlnLmlzTG9jYWxTdGFjayA/ICcgKExvY2FsU3RhY2spJyA6ICcgKEFXUyknfWAsXG59KTtcblxuYXBwLnN5bnRoKCk7Il19