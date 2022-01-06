import { handlerPath } from '@libs/handlerResolver'

import type { AWS } from '@serverless/typescript'

type Blah = AWS['functions'][''] & {
  iamRoleStatements: AWS['provider']['iamRoleStatements']
}

export const getAuctions: Blah = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['dynamodb:Query'],
      Resource: [
        {
          'Fn::GetAtt': ['AuctionsTable', 'Arn'],
        },
        // Resource for the 'virtual table' dynamoDB uses for the global secondary indexes.
        {
          'Fn::Join': [
            '/',
            [
              {
                'Fn::GetAtt': ['AuctionsTable', 'Arn'],
              },
              'index',
              'statusAndEndDate',
            ],
          ],
        },
      ],
    },
  ],
  events: [
    {
      http: {
        method: 'GET',
        path: 'auctions',
        authorizer: '${self:custom.authorizer}',
        // request: {
        //   parameters: {
        //     querystrings: {
        //       status: true,
        //     },
        //   },
        // },
      },
    },
  ],
}
