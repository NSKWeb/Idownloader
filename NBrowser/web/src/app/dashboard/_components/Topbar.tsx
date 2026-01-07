'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { apiRequest } from '@/lib/api'
import { clearTokens, getRefreshToken } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useToast } from '@/components/ui/Toast'

export function Topbar() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)

  async function logout() {
    const refreshToken = getRefreshToken()
    clearTokens()

    if (refreshToken) {
      setLoading(true)
      try {
        await apiRequest('/auth/logout', {
          method: 'POST',
          body: { refreshToken },
        })
      } catch {
        // best-effort
      } finally {
        setLoading(false)
      }
    }

    toast({ title: 'Signed out', variant: 'default' })
    router.push('/')
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-800/60 bg-slate-950/40 px-6 py-4">
      <div className="text-sm font-semibold">Workspace</div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="secondary" onClick={logout} disabled={loading}>
          Logout
        </Button>
      </div>
    </header>
  )
}
