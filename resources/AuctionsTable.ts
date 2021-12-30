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
      {
        AttributeName: 'status',
        AttributeType: 'S',
      },
      {
        AttributeName: 'endDate',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH', // Partition Key
      },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'statusAndEndDate',
        KeySchema: [
          {
            AttributeName: 'status',
            KeyType: 'HASH', // Partition Key
          },
          {
            AttributeName: 'endDate',
            KeyType: 'RANGE', // Sort Key
          },
        ],
        // With global secondary indexes, dynamo db creates virtual copy of table for querying.
        // ProjectionType ALL tells it which attributes to keep in that table.
        Projection: {
          ProjectionType: 'ALL',
        },
      },
    ],
  },
}
