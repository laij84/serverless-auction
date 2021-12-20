import 'source-map-support/register'

import { DynamoDB } from 'aws-sdk'
import createError from 'http-errors'

import { getAuctionById } from '@functions/getAuction/handler'
import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'

import { schema } from './schema'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'

const dynamodb = new DynamoDB.DocumentClient()

const placeBid: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
) => {
  const { id } = event.pathParameters
  const { amount } = event.body
  const auction = await getAuctionById(id)

  if (amount <= auction.highestBid.amount) {
    throw new createError.Forbidden(
      `Your bid must be higher than ${auction.highestBid.amount}`,
    )
  }

  const params: DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set highestBid.amount = :amount',
    ExpressionAttributeValues: {
      ':amount': amount,
    },
    ReturnValues: 'ALL_NEW',
  }

  let updatedAuction

  try {
    const result = await dynamodb.update(params).promise()
    updatedAuction = result.Attributes
  } catch (error) {
    throw new createError.InternalServerError(error)
  }

  if (!updatedAuction) {
    throw new createError.NotFound(`Auction with ${id} not found!`)
  }

  return formatJSONResponse({
    statusCode: 200,
    updatedAuction,
  })
}

export const main = middyfy(placeBid)
