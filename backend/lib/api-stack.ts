import { Construct } from "constructs";
import { MStackProps, MNested, MFunction } from "./patterns";
import { aws_iam as iam } from "aws-cdk-lib";
import { WebSocketApi, WebSocketStage } from "@aws-cdk/aws-apigatewayv2-alpha";
import { WebSocketLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

export class ApiStack extends MNested {
  readonly api: WebSocketApi;
  readonly stage: WebSocketStage;

  constructor(scope: Construct, id: string, props?: MStackProps) {
    super(scope, id, props);

    const { tableShortName } = this.mEnvironment;

    const tableName = this.getName(tableShortName);

    const executePolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [`arn:aws:execute-api:us-east-1:654627066109:*`],
      actions: ["execute-api:Invoke", "execute-api:ManageConnections"],
    });

    const dbPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [`arn:aws:dynamodb:us-east-1:654627066109:table/${tableName}`],
      actions: [
        "dynamodb:UpdateItem",
        "dynamodb:Query",
        "dynamodb:BatchWriteItem",
        "dynamodb:DeleteItem",
      ],
    });

    const connectLambda = new MFunction(this, `${this.getName("connect")}-fn`, {
      mEnvironment: {
        ...this.mEnvironment,
        name: "connect",
        options: {
          policies: [executePolicy, dbPolicy],
        },
      },
    });

    // this.createLambda('connect', );
    const disconnectLambda = new MFunction(
      this,
      `${this.getName("disconnect")}-fn`,
      {
        mEnvironment: {
          ...this.mEnvironment,
          name: "disconnect",
          options: {
            policies: [executePolicy, dbPolicy],
          },
        },
      }
    );

    const processLambda = new MFunction(this, `${this.getName("process")}-fn`, {
      mEnvironment: {
        ...this.mEnvironment,
        name: "process",
        options: {
          policies: [executePolicy, dbPolicy],
          timeout: 900,
          memory: 8192,
        },
      },
    });

    const { api, stage } = this.createWebSocket("ws-api", {
      standard: {
        connect: connectLambda.function,
        disconnect: disconnectLambda.function,
      },
      additional: { process: processLambda.function },
    });

    this.api = api;
    this.stage = stage;
  }

  createWebSocket(name: string, options: any) {
    const apiName = this.getName(name);

    const { standard, additional } = options;

    const { connect, disconnect } = standard;

    const webSocketApi = new WebSocketApi(this, `${apiName}-id`, {
      apiName,
      connectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "connect-integration",
          connect
        ),
      },
      disconnectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "disconnect-integration",
          disconnect
        ),
      },
    });
    const stage = new WebSocketStage(this, `${apiName}-stage`, {
      webSocketApi,
      stageName: "prod",
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

    return { api: webSocketApi, stage };
  }
}
