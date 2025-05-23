#!/bin/bash

# Destroy LocalStack infrastructure
# This removes all resources deployed to LocalStack

set -e

echo "🗑️  Destroying Ecommerce Infrastructure in LocalStack..."

# Check if LocalStack is running
if ! curl -s http://localhost:4566/_localstack/health > /dev/null; then
    echo "❌ LocalStack is not running. Nothing to destroy."
    exit 0
fi

echo "✅ LocalStack is running"

# Destroy the stack
echo "🗑️  Destroying infrastructure..."
cdklocal destroy --context environment=local --force

echo "✅ Infrastructure destroyed!"
echo ""
echo "💡 To restart LocalStack with a clean state:"
echo "   localstack stop"
echo "   localstack start -d"