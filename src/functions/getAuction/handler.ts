import 'source-map-support/register'

import { DynamoDB } from 'aws-sdk'
import createError from 'http-errors'

import { getAuctions } from '@functions/getAuctions'
import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'

import type { Auction } from '@functions/createAuction/handler'
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'

const dynamodb = new DynamoDB.DocumentClient()

export const getAuctionById = async (id: string): Auction => {
  let auction
  try {
    const result = await dynamodb
      .get({ TableName: process.env.AUCTIONS_TABLE_NAME, Key: { id } })
      .promise()
    auction = result.Item
  } catch (error) {
    throw new createError.InternalServerError(error)
  }

  if (!auction) {
    throw new createError.NotFound(`Auction with ${id} not found!`)
  }
  return auction as Auction
}
const getAuction: ValidatedEventAPIGatewayProxyEvent<{}> = async (event) => {
  const { id } = event.pathParameters
  const auction = await getAuctionById(id)

  return formatJSONResponse({
    statusCode: 200,
    auction,
  })
}

export const main = middyfy(getAuction)
