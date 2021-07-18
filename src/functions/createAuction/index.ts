import { handlerPath } from '@libs/handlerResolver'
import { schema } from './schema'

export const createAuction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'POST',
        path: 'auction',
        request: {
          schema: {
            'application/json': schema,
          },
        },
      },
    },
  ],
}
