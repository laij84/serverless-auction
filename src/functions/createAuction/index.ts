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
          'Fn::Sub':
            'arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/AuctionsTable-${sls:stage}',
        },
      ],
    },
  ],
  events: [
    {
      http: {
        method: 'POST',
        path: 'auction',
        request: {
          schema: {
            'application/json': schema,
          },
        },
      },
    },
  ],
}
