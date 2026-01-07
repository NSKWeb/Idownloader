import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

import { prisma } from '../lib/prisma.js'
import { authRequired } from '../middleware/auth.js'
import { ApiError } from '../middleware/errorHandler.js'
import { validateBody } from '../middleware/validate.js'

const router = Router()

const updateSchema = z
  .object({
    email: z.string().email().transform((v) => v.toLowerCase().trim()).optional(),
    password: z.string().min(8).max(72).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields to update' })

router.use(authRequired)

router.get('/', async (req, res) => {
  const userId = req.auth!.userId
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, createdAt: true },
  })

  if (!user) throw new ApiError('User not found', { status: 404, code: 'NOT_FOUND' })

  res.json({ data: { user } })
})

router.put('/', validateBody(updateSchema), async (req, res) => {
  const userId = req.auth!.userId
  const data = req.body as z.infer<typeof updateSchema>

  const update: { email?: string; password?: string } = {}

  if (data.email) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing && existing.id !== userId) {
      throw new ApiError('Email already in use', { status: 409, code: 'EMAIL_TAKEN' })
    }
    update.email = data.email
  }

  if (data.password) {
    update.password = await bcrypt.hash(data.password, 12)
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: update,
    select: { id: true, email: true, createdAt: true },
  })

  res.json({ data: { user } })
})

export default router
