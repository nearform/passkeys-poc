import fp from 'fastify-plugin'

async function logout(fastify) {
  fastify.get('/logout', async (request, reply) => {
    if (request.session.user) {
      const message = `${request.session.user.userName} successfully logged out`
      request.session.destroy(() => {
        reply.send({
          message
        })
      })
    } else {
      reply.send({})
    }
  })
}

export default fp(logout)
