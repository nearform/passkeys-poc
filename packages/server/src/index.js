import Fastify from 'fastify'

const buildServer = async config => {
  const opts = {
    ...config,
    logger: {
      level: config.LOG_LEVEL,
      transport: {
        target: process.env.NODE_ENV !== 'production' ? 'pino-pretty' : 'pino'
      }
    }
  }
  const fastify = Fastify(opts)

  await fastify.register(import('@fastify/cors'), {
    origin: 'http://localhost:3000',
    credentials: true
  })

  await fastify.register(import('@fastify/mongodb'), {
    // force to close the mongodb connection when app stopped
    // the default value is false
    forceClose: true,
    url: 'mongodb://root:examplepass@localhost:27017/admin'
  })

  fastify.register(import('@fastify/cookie'))
  fastify.register(import('@fastify/session'), {
    secret: 'a secret with minimum length of 32 characters',
    cookie: {
      secure: false
    }
  })

  fastify.register(import('./plugins/fastify-passkeys-auth.js'))
  return fastify
}

export default buildServer
