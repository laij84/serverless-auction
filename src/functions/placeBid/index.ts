import { handlerPath } from '@libs/handlerResolver'

import { schema } from './schema'

export const placeBid = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['dynamodb:UpdateItem', 'dynamodb:GetItem'],
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
        method: 'PATCH',
        path: 'auction/{id}/bid',
        request: {
          schema: {
            'application/json': schema,
          },
        },
      },
    },
  ],
}
