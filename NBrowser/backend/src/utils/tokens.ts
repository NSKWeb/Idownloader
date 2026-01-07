import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'

function requireEnv(name: 'JWT_ACCESS_SECRET' | 'JWT_REFRESH_SECRET') {
  const v = process.env[name]
  if (!v) throw new Error(`Missing ${name}`)
  return v
}

export function newRefreshTokenId() {
  return crypto.randomUUID()
}

export function createAccessToken(userId: string) {
  return jwt.sign({ sub: userId, typ: 'access' }, requireEnv('JWT_ACCESS_SECRET'), {
    expiresIn: process.env.JWT_ACCESS_TTL ?? '15m',
  })
}

export function createRefreshToken(userId: string, tokenId: string) {
  return jwt.sign(
    { sub: userId, jti: tokenId, typ: 'refresh' },
    requireEnv('JWT_REFRESH_SECRET'),
    {
      expiresIn: process.env.JWT_REFRESH_TTL ?? '7d',
    }
  )
}

export function verifyAccessToken(token: string): { userId: string } {
  const payload = jwt.verify(token, requireEnv('JWT_ACCESS_SECRET')) as {
    sub?: string
    typ?: string
  }
  if (!payload.sub || payload.typ !== 'access') throw new Error('Invalid access token')
  return { userId: payload.sub }
}

export function verifyRefreshToken(
  token: string
): { userId: string; tokenId: string } {
  const payload = jwt.verify(token, requireEnv('JWT_REFRESH_SECRET')) as {
    sub?: string
    jti?: string
    typ?: string
  }
  if (!payload.sub || !payload.jti || payload.typ !== 'refresh') {
    throw new Error('Invalid refresh token')
  }
  return { userId: payload.sub, tokenId: payload.jti }
}
