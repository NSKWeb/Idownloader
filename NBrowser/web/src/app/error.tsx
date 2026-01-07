'use client'

import * as React from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-xl items-center px-6">
        <Card className="w-full">
          <div className="text-lg font-semibold text-white">Something went wrong</div>
          <div className="mt-2 text-sm text-slate-300">{error.message}</div>
          <div className="mt-6 flex gap-2">
            <Button onClick={reset}>Try again</Button>
            <Link href="/">
              <Button variant="secondary">Home</Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  )
}
