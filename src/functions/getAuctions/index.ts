import { handlerPath } from '@libs/handlerResolver'

export const getAuctions = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['dynamodb:Scan'],
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
        path: 'auctions',
        request: {
          schema: {
            'application/json': {},
          },
        },
      },
    },
  ],
}
