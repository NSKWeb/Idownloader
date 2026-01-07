import dotenv from 'dotenv'
import { createApp } from './app.js'
import { logger } from './lib/logger.js'
import { connectRedis } from './lib/redis.js'

dotenv.config()

async function main() {
  await connectRedis()

  const app = createApp()
  const port = Number(process.env.PORT ?? 4000)

  app.listen(port, () => {
    logger.info(`API listening on http://localhost:${port}`)
  })
}

main().catch((err) => {
  logger.error('Fatal startup error', { err })
  process.exit(1)
})
