import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
  // eslint-disable-next-line import/no-unresolved
} from 'aws-lambda'
import type { FromSchema } from 'json-schema-to-ts'

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>
}

export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>

type ValidatedParamsAPIGatewayProxyEvent<S> = Omit<
  APIGatewayProxyEvent,
  'queryStringParameters'
> & {
  queryStringParameters: FromSchema<S>
}

export type ValidatedParamsEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedParamsAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>

type Response = {
  statusCode?: number
  [key: string]: unknown
}

export const formatJSONResponse = (response: Response) => {
  const { statusCode, ...rest } = response
  return {
    statusCode: statusCode ?? 200,
    body: JSON.stringify(rest),
  }
}
