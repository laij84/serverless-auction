export const paramsSchema = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['OPEN', 'CLOSED'],
      default: 'OPEN',
    },
  },
} as const

export const eventSchema = {
  type: 'object',
  properties: {
    queryStringParameters: paramsSchema,
  },
  required: ['queryStringParameters'],
} as const
