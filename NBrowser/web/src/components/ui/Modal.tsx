'use client'

import * as React from 'react'
import { cn } from '@/lib/cn'

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}) {
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }

    if (!open) return
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className={cn(
          'relative w-full max-w-lg rounded-2xl border border-slate-700/60 bg-nika-panel p-6 shadow-glow',
          className
        )}
      >
        {title ? <div className="mb-4 text-lg font-semibold">{title}</div> : null}
        {children}
      </div>
    </div>
  )
}
