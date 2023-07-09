import { Construct } from 'constructs';
import { Stack } from 'aws-cdk-lib';
import { StackProps } from 'aws-cdk-lib';

export interface MStackProps extends StackProps {
  readonly mEnvironment: {
    [key: string]: any;
  };
}

export class MStack extends Stack {
  readonly mEnvironment: any;

  constructor(scope: Construct, id: string, props?: MStackProps) {
    super(scope, id, props);

    this.mEnvironment = props?.mEnvironment;
  }
}
