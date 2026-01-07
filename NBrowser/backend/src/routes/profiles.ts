import { Router } from 'express'
import { z } from 'zod'

import { prisma } from '../lib/prisma.js'
import { authRequired } from '../middleware/auth.js'
import { ApiError } from '../middleware/errorHandler.js'
import { validateBody } from '../middleware/validate.js'

const router = Router()

const profileCreateSchema = z.object({
  name: z.string().min(1),
  fingerprint: z.unknown().default({}),
  proxy: z.string().min(1).optional().nullable(),
  cookies: z.unknown().default([]),
  localStorage: z.unknown().default({}),
})

const profileUpdateSchema = profileCreateSchema.partial().extend({
  name: z.string().min(1).optional(),
})

router.use(authRequired)

router.get('/', async (req, res) => {
  const userId = req.auth!.userId
  const profiles = await prisma.profile.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
  res.json({ data: { profiles } })
})

router.post('/', validateBody(profileCreateSchema), async (req, res) => {
  const userId = req.auth!.userId
  const data = req.body as z.infer<typeof profileCreateSchema>

  const profile = await prisma.profile.create({
    data: {
      userId,
      name: data.name,
      fingerprint: data.fingerprint,
      proxy: data.proxy ?? null,
      cookies: data.cookies,
      localStorage: data.localStorage,
    },
  })

  res.status(201).json({ data: { profile } })
})

router.get('/:id', async (req, res) => {
  const userId = req.auth!.userId
  const id = req.params.id

  const profile = await prisma.profile.findFirst({ where: { id, userId } })
  if (!profile) throw new ApiError('Profile not found', { status: 404, code: 'NOT_FOUND' })

  res.json({ data: { profile } })
})

router.put('/:id', validateBody(profileUpdateSchema), async (req, res) => {
  const userId = req.auth!.userId
  const id = req.params.id
  const update = req.body as z.infer<typeof profileUpdateSchema>

  const profile = await prisma.profile.findFirst({ where: { id, userId } })
  if (!profile) throw new ApiError('Profile not found', { status: 404, code: 'NOT_FOUND' })

  const updated = await prisma.profile.update({
    where: { id },
    data: {
      ...(update.name ? { name: update.name } : {}),
      ...(update.fingerprint !== undefined ? { fingerprint: update.fingerprint } : {}),
      ...(update.proxy !== undefined ? { proxy: update.proxy ?? null } : {}),
      ...(update.cookies !== undefined ? { cookies: update.cookies } : {}),
      ...(update.localStorage !== undefined
        ? { localStorage: update.localStorage }
        : {}),
    },
  })

  res.json({ data: { profile: updated } })
})

router.delete('/:id', async (req, res) => {
  const userId = req.auth!.userId
  const id = req.params.id

  const profile = await prisma.profile.findFirst({ where: { id, userId } })
  if (!profile) throw new ApiError('Profile not found', { status: 404, code: 'NOT_FOUND' })

  await prisma.profile.delete({ where: { id } })
  res.json({ data: { ok: true } })
})

export default router
