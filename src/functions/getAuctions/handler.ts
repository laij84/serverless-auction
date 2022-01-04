import 'source-map-support/register'

import validator from '@middy/validator'
import { DynamoDB } from 'aws-sdk'
import createError from 'http-errors'

import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'

import { eventSchema, paramsSchema } from './schema'

import type { ValidatedParamsEventAPIGatewayProxyEvent } from '@libs/apiGateway'

const dynamodb = new DynamoDB.DocumentClient()

const getAuctions: ValidatedParamsEventAPIGatewayProxyEvent<
  typeof paramsSchema
> = async (event) => {
  let auctions
  const { status } = event.queryStringParameters
  // eslint-disable-next-line no-console
  console.log('STATUS:', status)

  const params: DynamoDB.DocumentClient.QueryInput = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': status,
    },
    // required to handle reserved keywords in DynamoDB
    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  }

  try {
    const result = await dynamodb.query(params).promise()
    auctions = result.Items
  } catch (error) {
    throw new createError.InternalServerError(error)
  }

  return formatJSONResponse({
    statusCode: 200,
    auctions,
  })
}

export const main = middyfy(getAuctions).use(
  // Validate request url query string
  validator({ inputSchema: eventSchema, ajvOptions: { useDefaults: true } }),
)
