import type { NextFunction, Request, Response } from 'express'
import { ApiError } from './errorHandler.js'
import { verifyAccessToken } from '../utils/tokens.js'

export function authRequired(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    throw new ApiError('Missing Authorization header', {
      status: 401,
      code: 'UNAUTHORIZED',
    })
  }

  const token = header.slice('Bearer '.length)

  try {
    const { userId } = verifyAccessToken(token)
    req.auth = { userId }
    next()
  } catch {
    throw new ApiError('Invalid or expired token', {
      status: 401,
      code: 'UNAUTHORIZED',
    })
  }
}
