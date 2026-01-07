import * as React from 'react'
import { cn } from '@/lib/cn'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export function Input({ className, label, error, ...props }: Props) {
  return (
    <label className="block">
      {label ? (
        <div className="mb-1 text-xs font-medium text-slate-300">{label}</div>
      ) : null}
      <input
        className={cn(
          'w-full rounded-lg bg-slate-900/60 border border-slate-700/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-nika-cyan/80 focus:ring-2 focus:ring-nika-cyan/20',
          error ? 'border-red-500/60 focus:border-red-400 focus:ring-red-400/20' : '',
          className
        )}
        {...props}
      />
      {error ? <div className="mt-1 text-xs text-red-400">{error}</div> : null}
    </label>
  )
}
