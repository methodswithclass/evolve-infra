#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { EvolveStack } from '../lib/main-stack';
import { MStackProps } from '../lib/patterns';

const app = new App();

const ENV = app.node.tryGetContext('ENV');
const NAME = app.node.tryGetContext('NAME');

const mEnvironment = {
  ENV,
  NAME,
};

new EvolveStack(app, `${ENV}-${NAME}-stack`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  mEnvironment,
} as MStackProps);
