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

type Profile = {
  id: string
  name: string
  createdAt: string
}

export default function ProfilesPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [profiles, setProfiles] = React.useState<Profile[]>([])
  const [loading, setLoading] = React.useState(true)
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState('')

  const load = React.useCallback(async () => {
    const token = getAccessToken()
    if (!token) {
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      const data = await apiRequest<{ profiles: Profile[] }>('/profiles', { token })
      setProfiles(data.profiles)
    } catch (err) {
      toast({
        title: 'Failed to load profiles',
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

  async function createProfile() {
    const token = getAccessToken()
    if (!token) {
      router.push('/login')
      return
    }

    try {
      await apiRequest('/profiles', {
        method: 'POST',
        token,
        body: {
          name,
          fingerprint: {},
          cookies: [],
          localStorage: {},
        },
      })
      toast({ title: 'Profile created', variant: 'success' })
      setOpen(false)
      setName('')
      await load()
    } catch (err) {
      toast({
        title: 'Failed to create profile',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'danger',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold text-white">Profiles</div>
          <div className="mt-1 text-sm text-slate-400">
            Browser identities with fingerprint + storage + proxy.
          </div>
        </div>
        <Button onClick={() => setOpen(true)}>New profile</Button>
      </div>

      {loading ? (
        <div className="inline-flex items-center gap-2 text-sm text-slate-300">
          <Spinner /> Loading profiles
        </div>
      ) : profiles.length === 0 ? (
        <Card>
          <div className="text-sm text-slate-300">No profiles yet.</div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {profiles.map((p) => (
            <Card key={p.id}>
              <div className="text-sm font-semibold text-white">{p.name}</div>
              <div className="mt-1 text-xs text-slate-400">{p.id}</div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Create profile">
        <div className="space-y-3">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createProfile} disabled={!name.trim()}>
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
