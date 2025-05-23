#!/bin/bash

# Deploy to AWS using CDK
# This script deploys the same CDK infrastructure to AWS environments (dev/staging/prod)

set -e

# Default to dev environment if not specified
ENVIRONMENT=${1:-dev}

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
    echo "❌ Invalid environment: $ENVIRONMENT"
    echo "   Usage: $0 [dev|staging|prod]"
    echo "   Example: $0 dev"
    exit 1
fi

echo "🚀 Deploying Ecommerce Infrastructure to AWS ($ENVIRONMENT)..."

# Check AWS credentials
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS credentials configured"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies with pnpm..."
    pnpm install
fi

# Bootstrap AWS environment if needed
echo "🏗️  Bootstrapping AWS environment..."
cdk bootstrap

# Deploy with specified environment configuration
echo "🚀 Deploying infrastructure to $ENVIRONMENT..."
cdk deploy --context environment=$ENVIRONMENT --require-approval never

echo "✅ Deployment complete!"
echo ""
echo "🔗 Useful AWS CLI commands:"
echo "   - RDS instances: aws rds describe-db-instances --query 'DBInstances[?contains(DBInstanceIdentifier, \`ecommerce\`)].{Name:DBInstanceIdentifier,Status:DBInstanceStatus,Endpoint:Endpoint.Address}'"
echo "   - Parameter Store: aws ssm get-parameters-by-path --path /ecommerce/$ENVIRONMENT --recursive"
echo "   - S3 buckets: aws s3 ls | grep ecommerce-"
echo ""
echo "📊 View resources in AWS Console:"
echo "   - CloudFormation: https://console.aws.amazon.com/cloudformation/"
echo "   - RDS: https://console.aws.amazon.com/rds/"
echo "   - ElastiCache: https://console.aws.amazon.com/elasticache/"