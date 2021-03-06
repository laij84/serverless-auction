import 'source-map-support/register'

import { DynamoDB } from 'aws-sdk'
import createError from 'http-errors'
import { v4 as uuid4 } from 'uuid'

import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'

import { schema } from './schema'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'

const dynamodb = new DynamoDB.DocumentClient()

type HighestBid = {
  amount: number
}

export type Auction = {
  id: string
  title: string
  status: 'OPEN' | 'CLOSED'
  createdAt: string
  endDate: string
  highestBid: HighestBid
}

const createAuction: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
) => {
  const { title } = event.body

  const now = new Date()
  const endDate = new Date()
  endDate.setHours(now.getHours() + 1)

  const auction: Auction = {
    id: uuid4(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    endDate: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
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
