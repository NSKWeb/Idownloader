'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { apiRequest } from '@/lib/api'
import { getAccessToken } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'

type Automation = {
  id: string
  name: string
  profileId: string
  createdAt: string
}

export default function AutomationsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [items, setItems] = React.useState<Automation[]>([])
  const [loading, setLoading] = React.useState(true)
  const [open, setOpen] = React.useState(false)

  const [profileId, setProfileId] = React.useState('')
  const [name, setName] = React.useState('')

  const load = React.useCallback(async () => {
    const token = getAccessToken()
    if (!token) {
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      const data = await apiRequest<{ automations: Automation[] }>('/automations', { token })
      setItems(data.automations)
    } catch (err) {
      toast({
        title: 'Failed to load automations',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'danger',
      })
    } finally {
      setLoading(false)
    }
  }, [router, toast])

  React.useEffect(() => {
    void load()
  }, [load])

  async function createAutomation() {
    const token = getAccessToken()
    if (!token) {
      router.push('/login')
      return
    }

    try {
      await apiRequest('/automations', {
        method: 'POST',
        token,
        body: {
          profileId,
          name,
          script: '/* TODO: record automation */',
          recordedActions: [],
        },
      })
      toast({ title: 'Automation created', variant: 'success' })
      setOpen(false)
      setProfileId('')
      setName('')
      await load()
    } catch (err) {
      toast({
        title: 'Failed to create automation',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'danger',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold text-white">Automations</div>
          <div className="mt-1 text-sm text-slate-400">Scripts & recorded actions per profile.</div>
        </div>
        <Button onClick={() => setOpen(true)}>New automation</Button>
      </div>

      {loading ? (
        <div className="inline-flex items-center gap-2 text-sm text-slate-300">
          <Spinner /> Loading automations
        </div>
      ) : items.length === 0 ? (
        <Card>
          <div className="text-sm text-slate-300">No automations yet.</div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((a) => (
            <Card key={a.id}>
              <div className="text-sm font-semibold text-white">{a.name}</div>
              <div className="mt-1 text-xs text-slate-400">Profile: {a.profileId}</div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Create automation">
        <div className="space-y-3">
          <Input label="Profile ID" value={profileId} onChange={(e) => setProfileId(e.target.value)} />
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createAutomation} disabled={!profileId.trim() || !name.trim()}>
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
