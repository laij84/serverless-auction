import { createAuction } from '@functions/createAuction'
import { AuctionsTable } from '@resources/AuctionsTable'

import type { AWS } from '@serverless/typescript'

const serverlessConfiguration: AWS = {
  service: 'auction-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-iam-roles-per-function'],
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
      STAGE: '${sls:stage}',
      AUCTIONS_TABLE_NAME: {
        Ref: 'AuctionsTable',
      },
    },
    lambdaHashingVersion: '20201221',
  },
  resources: {
    Resources: {
      AuctionsTable,
    },
  },
  // import the function via paths
  functions: {
    createAuction,
  },
}

module.exports = serverlessConfiguration
