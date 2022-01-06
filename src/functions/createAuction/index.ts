import { handlerPath } from '@libs/handlerResolver'

import { schema } from './schema'

export const createAuction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['dynamodb:PutItem'],
      Resource: [
        {
          'Fn::GetAtt': ['AuctionsTable', 'Arn'],
        },
      ],
    },
  ],
  events: [
    {
      http: {
        method: 'POST',
        path: 'auction',
        authorizer: '${self:custom.authorizer}',
        request: {
          schema: {
            'application/json': schema,
          },
        },
      },
    },
  ],
}
