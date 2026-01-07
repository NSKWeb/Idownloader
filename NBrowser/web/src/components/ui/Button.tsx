import * as React from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-nika-gradient text-white shadow-glow hover:opacity-90 focus-visible:ring-2 focus-visible:ring-nika-cyan',
  secondary:
    'bg-nika-panel text-slate-100 border border-slate-700/60 hover:border-slate-600 focus-visible:ring-2 focus-visible:ring-nika-indigo',
  ghost:
    'bg-transparent text-slate-100 hover:bg-slate-800/60 focus-visible:ring-2 focus-visible:ring-nika-indigo',
  danger:
    'bg-red-600 text-white hover:bg-red-500 focus-visible:ring-2 focus-visible:ring-red-400',
}

export function Button({ className, variant = 'primary', ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:pointer-events-none',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}
