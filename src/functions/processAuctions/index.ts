import { handlerPath } from '@libs/handlerResolver'

export const processAuctions = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['dynamodb:Query', 'dynamodb:UpdateItem'],
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
  // events: [
  //   {
  //     schedule: 'rate(1 minute)',
  //   },
  // ],
}
