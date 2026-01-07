import * as React from 'react'
import { cn } from '@/lib/cn'

type Variant = 'default' | 'success' | 'warning' | 'danger'

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant
}

const variants: Record<Variant, string> = {
  default: 'bg-slate-800 text-slate-200 border-slate-700/60',
  success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-200 border-amber-500/20',
  danger: 'bg-red-500/10 text-red-300 border-red-500/20',
}

export function Badge({ className, variant = 'default', ...props }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
