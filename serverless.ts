import type { AWS } from '@serverless/typescript'

import { createAuction } from '@functions/createAuction'

const serverlessConfiguration: AWS = {
  service: 'auction-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-pseudo-parameters'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    memorySize: 256,
    stage: "${opt:stage, 'dev'}",
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  resources: {
    Resources: {
      AuctionsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'AuctionsTable',
          BillingMode: 'PAY_PER_REQUEST',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH', // Partition Key
            },
          ],
        },
      },
    },
  },
  // import the function via paths
  functions: {
    createAuction,
  },
}

module.exports = serverlessConfiguration
