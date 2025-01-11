import 'dotenv/config'
import cors from '@fastify/cors'
import {
  type CreateFastifyContextOptions,
  type FastifyTRPCPluginOptions,
  fastifyTRPCPlugin,
} from '@trpc/server/adapters/fastify'
import Fastify from 'fastify'
import { type AppRouter, appRouter } from './routes/trpcRouter'

export function createContext({ req, res }: CreateFastifyContextOptions) {
  const user = { name: req.headers.username ?? 'anonymous' }
  return { req, res, user }
}
export type Context = Awaited<ReturnType<typeof createContext>>

const fastify = Fastify({
  logger: true,
  maxParamLength: 5000,
})

export class Server {
  public async listen() {
    await fastify.register(cors, {
      origin: (origin, cb) => {
        if (!origin) {
          cb(null, true)
          return
        }
        const hostname = new URL(origin ?? '').hostname
        if (hostname === 'localhost') {
          //  Request from localhost will pass
          cb(null, true)
          return
        }
        // Generate an error on other origins, disabling access
        cb(new Error('Not allowed'), false)
      },
    })

    fastify.register(fastifyTRPCPlugin, {
      prefix: '/trpc',
      trpcOptions: {
        router: appRouter,
        createContext,
        onError({ path, error }) {
          console.error(`Error in tRPC handler on path '${path}':`, error)
        },
      } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
    })

    fastify.listen({ host: '0.0.0.0', port: 3010 }, async (err) => {
      if (err) {
        fastify.log.error(err)
        process.exit(1)
      }
      console.log('Server listening on port 3010')
    })
  }
}

new Server().listen()
