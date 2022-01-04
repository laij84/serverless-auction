import 'source-map-support/register'
import { DynamoDB } from 'aws-sdk'
import createError from 'http-errors'

import { Auction } from '@functions/createAuction/handler'

const dynamoDB = new DynamoDB.DocumentClient()

const getEndedAuctions = async () => {
  const now = new Date()
  const params: DynamoDB.DocumentClient.QueryInput = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status AND endDate <= :now',
    ExpressionAttributeValues: {
      ':status': 'OPEN',
      ':now': now.toISOString(),
    },
    // required to handle reserved keywords in DynamoDB
    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  }

  const result = await dynamoDB.query(params).promise()
  return result.Items
}

const closeAuction = async (auction: Auction) => {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id: auction.id },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeValues: {
      ':status': 'CLOSED',
    },
    // required to handle reserved keywords in DynamoDB
    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  }
  return dynamoDB.update(params).promise()
}

const processAuctions = async () => {
  try {
    const auctionsToClose = await getEndedAuctions()
    const closePromises = auctionsToClose.map((auction) =>
      closeAuction(auction as Auction),
    )
    await Promise.all(closePromises)
    return { closed: closePromises.length }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    throw new createError.InternalServerError(error)
  }
}

export const main = processAuctions
