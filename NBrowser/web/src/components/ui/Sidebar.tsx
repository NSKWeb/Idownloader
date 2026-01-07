'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

const nav = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/profiles', label: 'Profiles' },
  { href: '/dashboard/automations', label: 'Automations' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:block w-64 shrink-0 border-r border-slate-800/60 bg-slate-950/40 p-4">
      <div className="mb-6">
        <div className="text-sm font-semibold">Nika Browser</div>
        <div className="text-xs text-slate-400">Phase 1 foundation</div>
      </div>
      <nav className="space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block rounded-lg px-3 py-2 text-sm transition',
                active
                  ? 'bg-slate-800/60 text-white border border-slate-700/60'
                  : 'text-slate-300 hover:bg-slate-900/60 hover:text-white'
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
