'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { apiRequest } from '@/lib/api'
import { setTokens } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await apiRequest<{
        user: { id: string; email: string }
        tokens: { accessToken: string; refreshToken: string }
      }>('/auth/register', {
        method: 'POST',
        body: { email, password },
      })

      setTokens(data.tokens)
      toast({ title: 'Account created', description: data.user.email, variant: 'success' })
      router.push('/dashboard')
    } catch (err) {
      toast({
        title: 'Registration failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'danger',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-6">
        <Card className="w-full">
          <h1 className="text-xl font-semibold text-white">Create account</h1>
          <p className="mt-1 text-sm text-slate-400">
            Get started with profiles, automations, and a premium workflow.
          </p>

          <form className="mt-6 space-y-3" onSubmit={onSubmit}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              minLength={8}
              required
            />

            <Button className="w-full" disabled={loading}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner className="h-4 w-4" /> Creating
                </span>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-nika-cyan hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </main>
  )
}
