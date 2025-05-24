# 🏗️ Ecommerce Infrastructure

Modern, scalable infrastructure for ecommerce platform development and deployment.

## 🎯 Overview

This repository provides comprehensive infrastructure-as-code for the ecommerce platform with **two deployment approaches**:

1. **🚀 AWS-Native** (Recommended): Uses RDS + Amazon MQ + ElastiCache via LocalStack
2. **🔧 Traditional**: Uses Docker containers for PostgreSQL + RabbitMQ + Redis

## 🏛️ Architecture

### AWS-Native Approach (Recommended)
- **Local Development**: CDK + LocalStack (full AWS service emulation)
- **Cloud Deployment**: AWS CDK + Real AWS Services
- **Database**: RDS PostgreSQL
- **Messaging**: Amazon MQ (RabbitMQ engine)
- **Cache**: ElastiCache Redis
- **Auth**: Cognito
- **Storage**: S3
- **Observability**: CloudWatch, X-Ray

### Traditional Approach
- **Local Development**: Docker Compose + Tilt
- **Database**: PostgreSQL container
- **Messaging**: RabbitMQ container
- **Cache**: Redis container

## 🚀 Quick Start

### AWS-Native Approach (Recommended)

```bash
# Start AWS services via LocalStack + CDK
./start-aws-native.sh
```

This will:
- Start LocalStack with all AWS services
- Deploy CDK infrastructure (RDS, Amazon MQ, ElastiCache)
- Provide real AWS endpoints for development

### Traditional Approach

```bash
# Start Docker containers
./start-simple.sh
```

This provides basic PostgreSQL + Redis containers.

## 📁 Structure

```
ecommerce-infrastructure/
├── aws/                           # AWS CDK infrastructure
│   ├── lib/constructs/
│   │   ├── data/                 # DatabaseConstruct, CacheConstruct
│   │   ├── messaging/            # AmazonMQConstruct
│   │   └── networking/           # VpcConstruct
│   └── config/                   # Environment configurations
├── local/                        # Local development setup
│   ├── docker-compose.yml       # Traditional approach
│   ├── docker-compose.aws-native.yml # AWS-native approach
│   └── localstack/              # LocalStack initialization
└── scripts/                     # Utility scripts
```