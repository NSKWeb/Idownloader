import React from 'react'

export function WindowControls() {
  return (
    <div
      className="flex items-center gap-1"
      style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
    >
      <WindowButton onClick={() => window.nika.window.minimize()} ariaLabel="Minimize">
        ─
      </WindowButton>
      <WindowButton onClick={() => window.nika.window.maximize()} ariaLabel="Maximize">
        ☐
      </WindowButton>
      <WindowButton
        onClick={() => window.nika.window.close()}
        ariaLabel="Close"
        variant="danger"
      >
        ✕
      </WindowButton>
    </div>
  )
}

function WindowButton({
  onClick,
  children,
  ariaLabel,
  variant = 'default',
}: {
  onClick: () => void
  children: React.ReactNode
  ariaLabel: string
  variant?: 'default' | 'danger'
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={
        'h-8 w-10 rounded-md border text-sm transition ' +
        (variant === 'danger'
          ? 'border-red-500/30 bg-red-500/10 hover:bg-red-500/20'
          : 'border-slate-700/60 bg-slate-900/30 hover:bg-slate-800/50')
      }
    >
      {children}
    </button>
  )
}
