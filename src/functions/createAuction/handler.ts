import 'source-map-support/register'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'

import { v4 as uuid4 } from 'uuid'
import { DynamoDB } from 'aws-sdk'
import { schema } from './schema'

const dynamodb = new DynamoDB.DocumentClient()

type Auction = {
  id: string
  title: string
  status: 'OPEN' | 'CLOSED'
  createdAt: string
}

const createAuction: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
) => {
  const { title } = event.body

  const auction: Auction = {
    id: uuid4(),
    title,
    status: 'OPEN',
    createdAt: new Date().toISOString(),
  }

  await dynamodb
    .put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction,
    })
    .promise() // If using await you need to chain .promise()

  return formatJSONResponse({
    statusCode: 201,
    auction,
  })
}

export const main = middyfy(createAuction)
