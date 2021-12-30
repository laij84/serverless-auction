import { handlerPath } from '@libs/handlerResolver'

export const processAuctions = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  // iamRoleStatements: [
  //   {
  //     Effect: 'Allow',
  //     Action: ['dynamodb:UpdateItem', 'dynamodb:GetItem'],
  //     Resource: [
  //       {
  //         'Fn::GetAtt': ['AuctionsTable', 'Arn'],
  //       },
  //     ],
  //   },
  // ],
  // events: [
  //   {
  //     schedule: 'rate(1 minute)',
  //   },
  // ],
}
