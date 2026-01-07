'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { apiRequest } from '@/lib/api'
import { getAccessToken } from '@/lib/auth'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'

export default function DashboardPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      router.push('/login')
      return
    }

    apiRequest<{ user: { email: string } }>('/user', { token })
      .then((data) => setEmail(data.user.email))
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [router])

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-white">Dashboard</div>
        <div className="mt-1 text-sm text-slate-400">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Spinner className="h-4 w-4" /> Loading
            </span>
          ) : (
            <>Signed in as {email}</>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-sm font-semibold">Profiles</div>
          <div className="mt-2 text-sm text-slate-300">Create isolated browser identities.</div>
          <div className="mt-4">
            <Badge>Foundation</Badge>
          </div>
        </Card>
        <Card>
          <div className="text-sm font-semibold">Automations</div>
          <div className="mt-2 text-sm text-slate-300">Record & run scripts safely.</div>
          <div className="mt-4">
            <Badge variant="success">Ready</Badge>
          </div>
        </Card>
        <Card>
          <div className="text-sm font-semibold">Subscriptions</div>
          <div className="mt-2 text-sm text-slate-300">Tiering model in schema.</div>
          <div className="mt-4">
            <Badge variant="warning">Next phase</Badge>
          </div>
        </Card>
      </div>
    </div>
  )
}
