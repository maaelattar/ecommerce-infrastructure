#!/bin/bash

# Script to retrieve service configuration from AWS Parameter Store
# Usage: ./get-service-config.sh <environment> <service-name>

set -e

ENVIRONMENT=${1:-dev}
SERVICE=${2:-user-service}

echo "🔍 Retrieving configuration for $SERVICE in $ENVIRONMENT environment..."

# Database configuration
echo "📊 Database Configuration:"
DB_ENDPOINT=$(aws ssm get-parameter --name "/ecommerce/$ENVIRONMENT/$SERVICE/database/endpoint" --query 'Parameter.Value' --output text 2>/dev/null || echo "Not found")
DB_PORT=$(aws ssm get-parameter --name "/ecommerce/$ENVIRONMENT/$SERVICE/database/port" --query 'Parameter.Value' --output text 2>/dev/null || echo "Not found")
echo "   Endpoint: $DB_ENDPOINT"
echo "   Port: $DB_PORT"

# Shared infrastructure
echo ""
echo "🔧 Shared Infrastructure:"

# Redis
REDIS_ENDPOINT=$(aws ssm get-parameter --name "/ecommerce/$ENVIRONMENT/redis/endpoint" --query 'Parameter.Value' --output text 2>/dev/null || echo "Not found")
echo "   Redis: $REDIS_ENDPOINT:6379"

# RabbitMQ
RABBITMQ_ENDPOINT=$(aws ssm get-parameter --name "/ecommerce/$ENVIRONMENT/rabbitmq/endpoint" --query 'Parameter.Value' --output text 2>/dev/null || echo "Not found")
echo "   RabbitMQ: $RABBITMQ_ENDPOINT"

# OpenSearch
OPENSEARCH_ENDPOINT=$(aws ssm get-parameter --name "/ecommerce/$ENVIRONMENT/opensearch/endpoint" --query 'Parameter.Value' --output text 2>/dev/null || echo "Not found")
echo "   OpenSearch: https://$OPENSEARCH_ENDPOINT"

# Cognito
COGNITO_USER_POOL=$(aws ssm get-parameter --name "/ecommerce/$ENVIRONMENT/cognito/user-pool-id" --query 'Parameter.Value' --output text 2>/dev/null || echo "Not found")
COGNITO_CLIENT_ID=$(aws ssm get-parameter --name "/ecommerce/$ENVIRONMENT/cognito/client-id" --query 'Parameter.Value' --output text 2>/dev/null || echo "Not found")
echo "   Cognito User Pool: $COGNITO_USER_POOL"
echo "   Cognito Client ID: $COGNITO_CLIENT_ID"

echo ""
echo "💡 Use these values in your service configuration files!"