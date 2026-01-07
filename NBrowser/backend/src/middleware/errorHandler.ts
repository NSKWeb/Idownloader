import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { logger } from '../lib/logger.js'

export class ApiError extends Error {
  status: number
  code: string
  details?: unknown

  constructor(
    message: string,
    {
      status = 500,
      code = 'INTERNAL_ERROR',
      details,
    }: { status?: number; code?: string; details?: unknown } = {}
  ) {
    super(message)
    this.status = status
    this.code = code
    this.details = details
  }
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: {
      message: `Route not found: ${req.method} ${req.path}`,
      code: 'NOT_FOUND',
      details: null,
    },
  })
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: {
        message: err.message,
        code: err.code,
        details: err.details ?? null,
      },
    })
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: err.flatten(),
      },
    })
  }

  logger.error('Unhandled error', { err })
  return res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
      details: null,
    },
  })
}
