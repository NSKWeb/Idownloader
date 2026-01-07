'use client'

import * as React from 'react'
import { cn } from '@/lib/cn'

type ToastVariant = 'default' | 'success' | 'danger'

type ToastItem = {
  id: string
  title: string
  description?: string
  variant: ToastVariant
}

type ToastContextValue = {
  toast: (t: Omit<ToastItem, 'id'>) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

function randomId() {
  return Math.random().toString(36).slice(2)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([])

  const toast = React.useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = randomId()
    const item: ToastItem = { id, ...t }
    setItems((prev) => [item, ...prev].slice(0, 3))

    window.setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id))
    }, 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed right-4 top-4 z-50 space-y-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              'w-[340px] rounded-xl border bg-slate-950/70 p-4 backdrop-blur shadow-glow',
              t.variant === 'success'
                ? 'border-emerald-500/30'
                : t.variant === 'danger'
                  ? 'border-red-500/30'
                  : 'border-slate-700/60'
            )}
          >
            <div className="text-sm font-semibold">{t.title}</div>
            {t.description ? (
              <div className="mt-1 text-sm text-slate-300">{t.description}</div>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
