# Ecommerce Infrastructure CDK

Infrastructure as Code for the ecommerce platform using AWS CDK. This infrastructure supports deployment to both **LocalStack** (for local development) and **AWS** (for dev/staging/prod environments).

## 🏗️ Architecture

This CDK application creates the complete infrastructure for the ecommerce microservices platform:

- **PostgreSQL databases** (one per microservice)
- **Redis caching** (ElastiCache)
- **RabbitMQ messaging** (Amazon MQ)
- **OpenSearch** for search functionality
- **S3 buckets** for file storage
- **VPC networking** with proper security groups
- **Parameter Store** for service configuration
- **Secrets Manager** for credentials

## 🚀 Quick Start

### Prerequisites

1. **Install required tools:**
   ```bash
   # AWS CDK
   npm install -g aws-cdk

   # LocalStack CDK (for local development)
   npm install -g aws-cdk-local

   # AWS CLI Local (for LocalStack)
   pip install awscli-local
   ```

2. **For LocalStack development:**
   ```bash
   # Install LocalStack
   pip install localstack

   # Start LocalStack
   localstack start -d
   ```

3. **For AWS deployment:**
   ```bash
   # Configure AWS credentials
   aws configure
   ```

### Local Development with LocalStack

```bash
# Install dependencies
pnpm install

# Deploy to LocalStack
pnpm run deploy:local

# Check deployment
npm run check-local
npm run check-params

# Destroy when done
npm run destroy:local
```

### AWS Deployment

```bash
# Install dependencies
pnpm install

# Deploy to development
pnpm run deploy:dev

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:prod
```

## 🎯 Environment Configurations

### Local (LocalStack)
- **Purpose**: Fast local development
- **Resources**: Minimal instances, no encryption, no backups
- **Cost**: Free (runs locally)

### Dev
- **Purpose**: Development environment testing
- **Resources**: Small instances, basic encryption, 7-day backups
- **Features**: Basic monitoring, single AZ

### Staging
- **Purpose**: Pre-production testing
- **Resources**: Production-like instances, full encryption, 14-day backups
- **Features**: Full monitoring, Multi-AZ, clustering

### Prod
- **Purpose**: Production workloads
- **Resources**: Large instances, full security, 30-day backups
- **Features**: High availability, compliance logging, deletion protection

## 📁 Project Structure

```
infrastructure/aws/
├── bin/
│   └── ecommerce-app.ts          # CDK app entry point
├── lib/
│   └── ecommerce-infrastructure.ts  # Main infrastructure stack
├── config/
│   └── environments.ts          # Environment-specific configurations
├── scripts/
│   ├── deploy-local.sh          # LocalStack deployment
│   ├── deploy-aws.sh            # AWS deployment
│   └── destroy-local.sh         # LocalStack cleanup
├── package.json                 # NPM dependencies and scripts
└── README.md                    # This file
```

## 🔧 Available Commands

### Deployment Commands
```bash
pnpm run deploy:local     # Deploy to LocalStack
pnpm run deploy:dev       # Deploy to AWS dev
pnpm run deploy:staging   # Deploy to AWS staging
pnpm run deploy:prod      # Deploy to AWS prod
```

### Destroy Commands
```bash
pnpm run destroy:local    # Destroy LocalStack resources
pnpm run destroy:dev      # Destroy AWS dev resources
pnpm run destroy:staging  # Destroy AWS staging resources
pnpm run destroy:prod     # Destroy AWS prod resources
```

### Utility Commands
```bash
pnpm run synth:local      # Generate CloudFormation for LocalStack
pnpm run synth:dev        # Generate CloudFormation for dev
pnpm run check-local      # Check if LocalStack is running
pnpm run check-params     # View Parameter Store values
```

## 🔗 Service Integration

After deployment, services can connect to infrastructure using Parameter Store values:

```typescript
// Example: Getting database connection from Parameter Store
const dbEndpoint = await ssm.getParameter({
  Name: '/ecommerce/local/user-service/database/endpoint'
}).promise();

const dbPort = await ssm.getParameter({
  Name: '/ecommerce/local/user-service/database/port'
}).promise();
```

### Available Parameters

**Database connections:**
- `/ecommerce/{env}/{service}/database/endpoint`
- `/ecommerce/{env}/{service}/database/port`
- `/ecommerce/{env}/{service}/database/name`

**Cache connection:**
- `/ecommerce/{env}/cache/redis/endpoint`

**Message broker:**
- `/ecommerce/{env}/messaging/rabbitmq/endpoint`

**Search engine:**
- `/ecommerce/{env}/search/opensearch/endpoint`

**Storage:**
- `/ecommerce/{env}/storage/s3/{bucket-name}/bucket-name`

## 🔒 Security

### LocalStack (Development)
- No encryption (for speed)
- Open security groups within VPC
- No deletion protection
- Minimal logging

### AWS Environments
- **Dev**: Basic encryption, standard monitoring
- **Staging**: Full encryption, comprehensive monitoring
- **Prod**: Maximum security, compliance logging, deletion protection

## 🐛 Troubleshooting

### LocalStack Issues

1. **LocalStack not starting:**
   ```bash
   localstack logs
   docker ps | grep localstack
   ```

2. **CDK deployment fails:**
   ```bash
   # Check LocalStack health
   curl http://localhost:4566/_localstack/health
   
   # Reset LocalStack
   localstack stop
   localstack start -d
   ```

3. **Services can't connect:**
   ```bash
   # Check Parameter Store values
   awslocal ssm get-parameters-by-path --path /ecommerce/local --recursive
   ```

### AWS Issues

1. **CDK bootstrap issues:**
   ```bash
   cdk bootstrap --force
   ```

2. **Permission errors:**
   ```bash
   aws sts get-caller-identity
   aws iam get-user
   ```

3. **Stack update conflicts:**
   ```bash
   # Check CloudFormation console for drift detection
   # Consider destroying and recreating for dev environment
   ```

## 🔄 Development Workflow

### Recommended Pattern

1. **Local Development:**
   ```bash
   # Start LocalStack
   localstack start -d
   
   # Deploy infrastructure
   pnpm run deploy:local
   
   # Start your services (they connect to LocalStack resources)
   ```

2. **Testing Changes:**
   ```bash
   # Make infrastructure changes
   # Test locally first
   pnpm run deploy:local
   
   # Then deploy to dev
   pnpm run deploy:dev
   ```

3. **Production Deployment:**
   ```bash
   # Deploy to staging first
   pnpm run deploy:staging
   
   # Test thoroughly
   # Then deploy to production
   pnpm run deploy:prod
   ```

## 📊 Cost Estimation

### LocalStack: $0
- Runs entirely on your local machine

### AWS Dev: ~$200-400/month
- Small RDS instances
- Basic ElastiCache
- Single AZ deployment

### AWS Staging: ~$800-1200/month
- Medium instances
- Multi-AZ deployment
- Full monitoring

### AWS Prod: ~$2000-4000/month
- Large instances
- High availability
- Enhanced security and monitoring

*Note: Costs vary based on usage patterns and data transfer*