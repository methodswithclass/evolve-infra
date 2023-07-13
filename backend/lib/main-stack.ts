import { Construct } from 'constructs';
import { MStack, MStackProps } from './patterns';
import {
  aws_lambda as lambda,
  aws_dynamodb as dynamodb,
  aws_iam as iam,
  aws_cloudfront as cloudfront,
  aws_s3 as s3,
  Duration,
} from 'aws-cdk-lib';
import { WebSocketApi, WebSocketStage } from '@aws-cdk/aws-apigatewayv2-alpha';
import { WebSocketLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as path from 'path';

export class EvolveStack extends MStack {
  constructor(scope: Construct, id: string, props?: MStackProps) {
    super(scope, id, props);

    const tableName = this.getName('table');

    const executePolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [`arn:aws:execute-api:*:*:*`],
      actions: ['execute-api:Invoke', 'execute-api:ManageConnections'],
    });

    const dbPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [`arn:aws:dynamodb:us-east-1:654627066109:table/${tableName}`],
      actions: [
        'dynamodb:UpdateItem',
        'dynamodb:Query',
        'dynamodb:BatchWriteItem',
        'dynamodb:DeleteItem',
      ],
    });

    const connectLambdaFn = this.createLambda('connect', {
      policies: [executePolicy, dbPolicy],
      timeout: 30,
    });
    const disconnectLambdaFn = this.createLambda('disconnect', {
      policies: [executePolicy, dbPolicy],
      timeout: 30,
    });
    const runLambdaFn = this.createLambda('run', {
      policies: [executePolicy, dbPolicy],
      timeout: 900,
    });

    const stopLambdaFn = this.createLambda('stop', {
      policies: [executePolicy, dbPolicy],
      timeout: 30,
    });

    this.createApi('ws-api', {
      standard: { connect: connectLambdaFn, disconnect: disconnectLambdaFn },
      additional: { run: runLambdaFn, stop: stopLambdaFn },
    });

    this.createTable('table');
  }

  getName(name: string) {
    const { ENV, NAME } = this.mEnvironment;
    return `${ENV}-${NAME}-${name}`;
  }

  createTable(name: string) {
    const tableName = this.getName(name);

    const table = new dynamodb.Table(this, `${tableName}-id`, {
      tableName,
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
    });

    return table;
  }

  createLambda(name: string, options: any) {
    const { ENV, NAME } = this.mEnvironment;

    const { policies, timeout } = options;

    const lambdaFnName = this.getName(name);

    const lambdaFn = new lambda.Function(this, `${lambdaFnName}-id`, {
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName: lambdaFnName,
      handler: `${name}.handler`,
      code: lambda.Code.fromAsset(path.resolve(__dirname, `../build/${name}`)),
      timeout: Duration.seconds(timeout),
      environment: {
        ENV,
        NAME,
      },
    });

    policies.forEach((policy: iam.PolicyStatement) => {
      lambdaFn.addToRolePolicy(policy);
    });

    return lambdaFn;
  }

  createApi(name: string, options: any) {
    const apiName = this.getName(name);

    const { standard, additional } = options;

    const { connect, disconnect } = standard;

    const webSocketApi = new WebSocketApi(this, `${apiName}-id`, {
      apiName,
      connectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          'connect-integration',
          connect
        ),
      },
      disconnectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          'disconnect-integration',
          disconnect
        ),
      },
    });
    new WebSocketStage(this, `${apiName}-stage`, {
      webSocketApi,
      stageName: 'prod',
      autoDeploy: true,
    });

    Object.entries(additional).forEach(([name, lambda]: any) => {
      webSocketApi.addRoute(name, {
        integration: new WebSocketLambdaIntegration(
          `${name}-integration`,
          lambda
        ),
      });
    });

    return webSocketApi;
  }
}
