import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

import { prisma } from '../lib/prisma.js'
import { redis } from '../lib/redis.js'
import { ApiError } from '../middleware/errorHandler.js'
import { validateBody } from '../middleware/validate.js'
import {
  createAccessToken,
  createRefreshToken,
  newRefreshTokenId,
  verifyRefreshToken,
} from '../utils/tokens.js'

const router = Router()

const credentialsSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase().trim()),
  password: z.string().min(8).max(72),
})

function ttlToSeconds(ttl: string | undefined): number | undefined {
  if (!ttl) return undefined
  const m = ttl.match(/^(\d+)([smhd])$/)
  if (!m) return undefined
  const value = Number(m[1])
  const unit = m[2]
  const mult = unit === 's' ? 1 : unit === 'm' ? 60 : unit === 'h' ? 3600 : 86400
  return value * mult
}

async function persistRefreshToken(tokenId: string, userId: string) {
  const key = `refresh:${tokenId}`
  const ex = ttlToSeconds(process.env.JWT_REFRESH_TTL)

  if (ex) {
    await redis.set(key, userId, { EX: ex })
  } else {
    await redis.set(key, userId)
  }
}

router.post('/register', validateBody(credentialsSchema), async (req, res) => {
  const { email, password } = req.body as z.infer<typeof credentialsSchema>

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new ApiError('Email already in use', { status: 409, code: 'EMAIL_TAKEN' })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: {
      email,
      password: passwordHash,
    },
    select: { id: true, email: true },
  })

  const refreshId = newRefreshTokenId()
  const tokens = {
    accessToken: createAccessToken(user.id),
    refreshToken: createRefreshToken(user.id, refreshId),
  }

  await persistRefreshToken(refreshId, user.id)

  res.status(201).json({ data: { user, tokens } })
})

router.post('/login', validateBody(credentialsSchema), async (req, res) => {
  const { email, password } = req.body as z.infer<typeof credentialsSchema>

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new ApiError('Invalid email or password', {
      status: 401,
      code: 'INVALID_CREDENTIALS',
    })
  }

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) {
    throw new ApiError('Invalid email or password', {
      status: 401,
      code: 'INVALID_CREDENTIALS',
    })
  }

  const refreshId = newRefreshTokenId()
  const tokens = {
    accessToken: createAccessToken(user.id),
    refreshToken: createRefreshToken(user.id, refreshId),
  }

  await persistRefreshToken(refreshId, user.id)

  res.json({
    data: { user: { id: user.id, email: user.email }, tokens },
  })
})

router.post(
  '/refresh',
  validateBody(z.object({ refreshToken: z.string().min(1) })),
  async (req, res) => {
    const { refreshToken } = req.body as { refreshToken: string }

    let parsed: { userId: string; tokenId: string }
    try {
      parsed = verifyRefreshToken(refreshToken)
    } catch {
      throw new ApiError('Invalid refresh token', {
        status: 401,
        code: 'UNAUTHORIZED',
      })
    }

    const key = `refresh:${parsed.tokenId}`
    const storedUserId = await redis.get(key)

    if (!storedUserId || storedUserId !== parsed.userId) {
      throw new ApiError('Refresh token revoked', {
        status: 401,
        code: 'UNAUTHORIZED',
      })
    }

    // rotate
    await redis.del(key)
    const nextId = newRefreshTokenId()
    await persistRefreshToken(nextId, parsed.userId)

    res.json({
      data: {
        tokens: {
          accessToken: createAccessToken(parsed.userId),
          refreshToken: createRefreshToken(parsed.userId, nextId),
        },
      },
    })
  }
)

router.post(
  '/logout',
  validateBody(z.object({ refreshToken: z.string().min(1) })),
  async (req, res) => {
    const { refreshToken } = req.body as { refreshToken: string }

    try {
      const parsed = verifyRefreshToken(refreshToken)
      await redis.del(`refresh:${parsed.tokenId}`)
    } catch {
      // noop
    }

    res.json({ data: { ok: true } })
  }
)

export default router
