import 'source-map-support/register'

import { DynamoDB } from 'aws-sdk'
import createError from 'http-errors'
import { v4 as uuid4 } from 'uuid'

import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'

import { schema } from './schema'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'

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
  try {
    await dynamodb
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise() // If using await you need to chain .promise()
  } catch (error) {
    throw new createError.InternalServerError(error)
  }

  return formatJSONResponse({
    statusCode: 201,
    auction,
  })
}

export const main = middyfy(createAuction)
