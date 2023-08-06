import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb, RemovalPolicy } from 'aws-cdk-lib';
import { MStack, MStackProps } from './patterns';
import { ApiStack } from './api-stack';
import { CloudfrontStack } from './cloudfront-stack';

export class EvolveStack extends MStack {
  constructor(scope: Construct, id: string, props?: MStackProps) {
    super(scope, id, props);

    const tableShortName = 'table';

    new ApiStack(this, this.getName('api-stack'), {
      mEnvironment: {
        ...this.mEnvironment,
        tableShortName,
      },
    });

    new CloudfrontStack(this, this.getName('cloudfront-stack'), {
      mEnvironment: {
        ...this.mEnvironment,
      },
    });

    this.createTable(tableShortName);
  }

  createTable(name: string) {
    const tableName = this.getName(name);

    const table = new dynamodb.Table(this, `${tableName}-id`, {
      tableName,
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    return table;
  }
}
