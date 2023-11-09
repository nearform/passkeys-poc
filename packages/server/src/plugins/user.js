import fp from 'fastify-plugin'
import Errors from 'http-errors'

async function user(fastify) {
  fastify.get('/user', async (request, reply) => {
    const { user } = request.session

    if (!user) {
      throw Errors.Unauthorized()
    }

    reply.send(user)
  })
}

export default fp(user)
