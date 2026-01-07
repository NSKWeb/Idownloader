import { createClient } from 'redis'
import { logger } from './logger.js'

export const redis = createClient({
  url: process.env.REDIS_URL,
})

redis.on('error', (err) => {
  logger.error('Redis error', { err })
})

export async function connectRedis() {
  if (redis.isOpen) return
  await redis.connect()
  logger.info('Redis connected')
}
