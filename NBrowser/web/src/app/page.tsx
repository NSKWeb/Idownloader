import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10">
          <div className="inline-flex items-center rounded-full border border-slate-700/60 bg-slate-900/40 px-3 py-1 text-xs text-slate-200">
            Phase 1 — Foundation & Infrastructure
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Nika Browser
              <span className="block bg-nika-gradient bg-clip-text text-transparent">
                profiles, automations, scale
              </span>
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              A premium foundation for desktop + web, built with dark aesthetics,
              smooth UI, and production-ready architecture.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register">
                <Button>Get started</Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary">Sign in</Button>
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { k: 'Electron', v: 'Desktop app' },
                { k: 'Next.js 15', v: 'SaaS web' },
                { k: 'Prisma', v: 'Postgres schema' },
              ].map((x) => (
                <div key={x.k} className="rounded-xl border border-slate-800/60 bg-slate-950/30 p-4">
                  <div className="text-sm font-semibold text-white">{x.k}</div>
                  <div className="text-xs text-slate-400">{x.v}</div>
                </div>
              ))}
            </div>
          </div>

          <Card className="p-8">
            <div className="text-sm font-semibold text-white">What’s included</div>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>• JWT auth (access + refresh) with Redis-backed sessions</li>
              <li>• Profiles + Automations API skeleton (protected routes)</li>
              <li>• Tailwind 4 design system components</li>
              <li>• Docker Compose for Postgres + Redis</li>
            </ul>
            <div className="mt-6 rounded-xl border border-slate-700/60 bg-slate-950/40 p-4 text-xs text-slate-300">
              Accent palette: indigo → blue gradient with cyan highlights.
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
