export const schema = {
  type: 'object',
  properties: {
    amount: { type: 'integer' },
  },
  required: ['amount'],
} as const
