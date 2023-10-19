import buildServer from './index.js'
import config from './config.js'

const start = async () => {
  try {
    const server = await buildServer(config)
    await server.listen({ port: 8080 })
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

start()
