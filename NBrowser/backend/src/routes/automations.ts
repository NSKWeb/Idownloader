import { Router } from 'express'
import { z } from 'zod'

import { prisma } from '../lib/prisma.js'
import { authRequired } from '../middleware/auth.js'
import { ApiError } from '../middleware/errorHandler.js'
import { validateBody } from '../middleware/validate.js'

const router = Router()

const automationCreateSchema = z.object({
  profileId: z.string().min(1),
  name: z.string().min(1),
  script: z.string().min(1),
  recordedActions: z.unknown().default([]),
})

router.use(authRequired)

router.get('/', async (req, res) => {
  const userId = req.auth!.userId

  const automations = await prisma.automation.findMany({
    where: { profile: { userId } },
    orderBy: { createdAt: 'desc' },
  })

  res.json({ data: { automations } })
})

router.post('/', validateBody(automationCreateSchema), async (req, res) => {
  const userId = req.auth!.userId
  const data = req.body as z.infer<typeof automationCreateSchema>

  const profile = await prisma.profile.findFirst({
    where: { id: data.profileId, userId },
    select: { id: true },
  })

  if (!profile) {
    throw new ApiError('Profile not found', { status: 404, code: 'NOT_FOUND' })
  }

  const automation = await prisma.automation.create({
    data: {
      profileId: data.profileId,
      name: data.name,
      script: data.script,
      recordedActions: data.recordedActions,
    },
  })

  res.status(201).json({ data: { automation } })
})

router.delete('/:id', async (req, res) => {
  const userId = req.auth!.userId
  const id = req.params.id

  const automation = await prisma.automation.findFirst({
    where: { id, profile: { userId } },
    select: { id: true },
  })

  if (!automation) {
    throw new ApiError('Automation not found', { status: 404, code: 'NOT_FOUND' })
  }

  await prisma.automation.delete({ where: { id } })
  res.json({ data: { ok: true } })
})

export default router
