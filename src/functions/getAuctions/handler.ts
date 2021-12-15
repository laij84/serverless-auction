import 'source-map-support/register'

import { DynamoDB } from 'aws-sdk'
import createError from 'http-errors'

import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'

const dynamodb = new DynamoDB.DocumentClient()

const getAuctions: ValidatedEventAPIGatewayProxyEvent<{}> = async () => {
  let auctions

  try {
    const result = await dynamodb
      .scan({ TableName: process.env.AUCTIONS_TABLE_NAME })
      .promise()
    auctions = result.Items
  } catch (error) {
    throw new createError.InternalServerError(error)
  }

  return formatJSONResponse({
    statusCode: 200,
    auctions,
  })
}

export const main = middyfy(getAuctions)
