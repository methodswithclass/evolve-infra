import { Construct } from 'constructs';
import { NestedStack, Stack } from 'aws-cdk-lib';
import {
  aws_lambda as lambda,
  aws_cloudfront as cloudfront,
  aws_iam as iam,
  Duration,
  StackProps,
} from 'aws-cdk-lib';
import * as path from 'path';

export interface MStackProps extends StackProps {
  readonly mEnvironment: {
    [key: string]: any;
  };
}

export interface MStackAssetName {
  getName(name: string): string;
}

export class MStack extends Stack implements MStackAssetName {
  readonly mEnvironment: any;

  constructor(scope: Construct, id: string, props?: MStackProps) {
    super(scope, id, props);

    this.mEnvironment = props?.mEnvironment;
  }

  getName(name: string) {
    const { env, appName } = this.mEnvironment;
    return `${env}-${appName}-${name}`;
  }
}

export class MNested extends NestedStack implements MStackAssetName {
  readonly mEnvironment: any;

  constructor(scope: Construct, id: string, props?: MStackProps) {
    super(scope, id, props);

    this.mEnvironment = props?.mEnvironment;
  }

  getName(name: string) {
    const { env, appName } = this.mEnvironment;
    return `${env}-${appName}-${name}`;
  }
}

export class MFunction extends Construct implements MStackAssetName {
  private readonly mEnvironment: any;
  function: lambda.Function;

  constructor(scope: Construct, id: string, props: MStackProps) {
    super(scope, id);
    this.mEnvironment = props?.mEnvironment;
    this.createLambda();
  }

  getName(name: string) {
    const { env, appName } = this.mEnvironment;
    return `${env}-${appName}-${name}`;
  }

  createLambda() {
    const { env, appName, name, options = {} } = this.mEnvironment;

    const { policies = [], timeout = 30, memory = 128 } = options;

    const lambdaFnName = this.getName(name);

    const environment = {
      env,
      appName,
    };

    const lambdaFn = new lambda.Function(this, `${lambdaFnName}-id`, {
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName: lambdaFnName,
      handler: `${name}.handler`,
      code: lambda.Code.fromAsset(path.resolve(__dirname, `../build/${name}`)),
      timeout: Duration.seconds(timeout),
      memorySize: memory,
    });

    Object.entries(environment).forEach(([key, value]) => {
      lambdaFn.addEnvironment(key, value, { removeInEdge: true });
    });

    policies.forEach((policy: iam.PolicyStatement) => {
      lambdaFn.addToRolePolicy(policy);
    });

    this.function = lambdaFn;
  }
}
