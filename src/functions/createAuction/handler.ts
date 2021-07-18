import 'source-map-support/register'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'

import { schema } from './schema'

type Auction = {
  title: string
  status: 'OPEN' | 'CLOSED'
  createdAt: string
}
const createAuction: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
) => {
  const { title } = event.body

  const auction: Auction = {
    title,
    status: 'OPEN',
    createdAt: new Date().toISOString(),
  }

  return formatJSONResponse({
    statusCode: 201,
    auction,
  })
}

export const main = middyfy(createAuction)
