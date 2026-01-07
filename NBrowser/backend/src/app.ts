import express from 'express'
import cors from 'cors'

import { logger } from './lib/logger.js'
import authRouter from './routes/auth.js'
import profilesRouter from './routes/profiles.js'
import automationsRouter from './routes/automations.js'
import userRouter from './routes/user.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
      credentials: true,
    })
  )

  app.use(express.json({ limit: '1mb' }))

  app.use((req, res, next) => {
    const start = Date.now()
    res.on('finish', () => {
      logger.info('request', {
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        ms: Date.now() - start,
      })
    })
    next()
  })

  app.get('/api/health', (_req, res) => res.json({ data: { ok: true } }))

  app.use('/api/auth', authRouter)
  app.use('/api/profiles', profilesRouter)
  app.use('/api/automations', automationsRouter)
  app.use('/api/user', userRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}

