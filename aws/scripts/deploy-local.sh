#!/bin/bash

# Deploy to LocalStack using CDK
# This script deploys the exact same CDK infrastructure to LocalStack for local development

set -e

echo "🚀 Deploying Ecommerce Infrastructure to LocalStack..."

# Check if LocalStack is running
if ! curl -s http://localhost:4566/_localstack/health > /dev/null; then
    echo "❌ LocalStack is not running. Please start LocalStack first:"
    echo "   localstack start -d"
    exit 1
fi

echo "✅ LocalStack is running"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies with pnpm..."
    pnpm install
fi

# Bootstrap LocalStack environment if needed
echo "🏗️  Bootstrapping LocalStack environment..."
cdklocal bootstrap

# Deploy with local environment configuration
echo "🚀 Deploying infrastructure..."
cdklocal deploy --context environment=local --require-approval never

echo "✅ Deployment complete!"
echo ""
echo "🔗 Useful LocalStack endpoints:"
echo "   - Health check: http://localhost:4566/_localstack/health"
echo "   - S3 buckets: awslocal s3 ls"
echo "   - RDS instances: awslocal rds describe-db-instances"
echo "   - Parameter Store: awslocal ssm get-parameters-by-path --path /ecommerce/local --recursive"
echo ""
echo "📚 View resources in LocalStack Web UI: https://app.localstack.cloud/inst/default/resources"