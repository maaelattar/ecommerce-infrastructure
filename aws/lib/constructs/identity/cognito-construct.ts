import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { IEnvironmentProvider } from '../../providers/environment-provider';

export interface CognitoConstructProps {
  provider: IEnvironmentProvider;
}

/**
 * Amazon Cognito construct implementing TDAC identity provider decision
 */
export class CognitoConstruct extends Construct {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;
  
  constructor(scope: Construct, id: string, props: CognitoConstructProps) {
    super(scope, id);
    
    const { provider } = props;
    
    // Create User Pool with TDAC-compliant configuration
    this.userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: `ecommerce-users-${provider.getEnvironmentName()}`,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      standardAttributes: {
        email: { required: true, mutable: true },
      },
      removalPolicy: provider.isProduction() 
        ? RemovalPolicy.RETAIN 
        : RemovalPolicy.DESTROY,
    });
    
    // Create User Pool Client
    this.userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool: this.userPool,
      userPoolClientName: `ecommerce-app-${provider.getEnvironmentName()}`,
      authFlows: {
        adminUserPassword: true,
        userPassword: true,        userSrp: true,
      },
      generateSecret: true,
      preventUserExistenceErrors: true,
    });
    
    // Store configuration in Parameter Store for services
    new ssm.StringParameter(this, 'UserPoolIdParameter', {
      parameterName: `/ecommerce/${provider.getEnvironmentName()}/cognito/user-pool-id`,
      stringValue: this.userPool.userPoolId,
      description: 'Cognito User Pool ID for ecommerce platform',
    });
    
    new ssm.StringParameter(this, 'UserPoolClientIdParameter', {
      parameterName: `/ecommerce/${provider.getEnvironmentName()}/cognito/client-id`,
      stringValue: this.userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID for ecommerce platform',
    });
    
    // Outputs
    new CfnOutput(this, 'UserPoolId', {
      value: this.userPool.userPoolId,
      description: 'Cognito User Pool ID',
      exportName: `ecommerce-${provider.getEnvironmentName()}-user-pool-id`,
    });
    
    new CfnOutput(this, 'UserPoolClientId', {
      value: this.userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID',
      exportName: `ecommerce-${provider.getEnvironmentName()}-client-id`,
    });
  }
}