import { handlerPath } from '@libs/handlerResolver'

export const getAuction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['dynamodb:GetItem'],
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
        method: 'GET',
        path: 'auction/{id}',
      },
    },
  ],
}
