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

    const { ENV, NAME } = this.mEnvironment;

    const apiName = `${ENV}-${NAME}-ws-api`;
    const connectLambdaName = `${ENV}-${NAME}-connect`;
    const disconnectLambdaName = `${ENV}-${NAME}-disconnect`;
    const runLambdaName = `${ENV}-${NAME}-run`;
    const tableName = `${ENV}-${NAME}-table`;

    const lambdaPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [`arn:aws:execute-api:*:*:*`],
      actions: ['execute-api:Invoke', 'execute-api:ManageConnections'],
    });

    const connectLambdaFn = new lambda.Function(
      this,
      `${connectLambdaName}-id`,
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        functionName: connectLambdaName,
        handler: `connect.handler`,
        code: lambda.Code.fromAsset(
          path.resolve(__dirname, '../build/connect')
        ),
        timeout: Duration.seconds(30),
        environment: {
          ENV,
          NAME,
        },
      }
    );

    connectLambdaFn.addToRolePolicy(lambdaPolicy);

    const disconnectLambdaFn = new lambda.Function(
      this,
      `${disconnectLambdaName}-id`,
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        functionName: disconnectLambdaName,
        handler: `disconnect.handler`,
        code: lambda.Code.fromAsset(
          path.resolve(__dirname, '../build/disconnect')
        ),
        timeout: Duration.seconds(30),
        environment: {
          ENV,
          NAME,
        },
      }
    );

    disconnectLambdaFn.addToRolePolicy(lambdaPolicy);

    const runLambdaFn = new lambda.Function(this, `${runLambdaName}-id`, {
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName: runLambdaName,
      handler: `run.handler`,
      code: lambda.Code.fromAsset(path.resolve(__dirname, '../build/run')),
      timeout: Duration.seconds(30),
      environment: {
        ENV,
        NAME,
      },
    });

    runLambdaFn.addToRolePolicy(lambdaPolicy);

    const webSocketApi = new WebSocketApi(this, `${apiName}-id`, {
      apiName,
      connectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          'connect-integration',
          connectLambdaFn
        ),
      },
      disconnectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          'disconnect-integration',
          disconnectLambdaFn
        ),
      },
    });
    new WebSocketStage(this, `${apiName}-stage`, {
      webSocketApi,
      stageName: 'prod',
      autoDeploy: true,
    });

    webSocketApi.addRoute('run', {
      integration: new WebSocketLambdaIntegration(
        'run-integration',
        runLambdaFn
      ),
    });

    new dynamodb.Table(this, tableName, {
      tableName,
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
    });
  }
}
