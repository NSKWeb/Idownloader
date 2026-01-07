import * as React from 'react'
import { cn } from '@/lib/cn'

type Props = React.HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: Props) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-700/50 bg-slate-900/40 p-6 shadow-glow backdrop-blur',
        className
      )}
      {...props}
    />
  )
}
