import type { AWSResource } from './resources.types'

export const AuctionsTable: AWSResource = {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    TableName: 'AuctionsTable-${sls:stage}',
    BillingMode: 'PAY_PER_REQUEST',
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S', // S stands for String
      },
    ],
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH', // Partition Key
      },
    ],
  },
}
