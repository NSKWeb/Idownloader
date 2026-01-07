import React from 'react'

export function Home() {
  const [pong, setPong] = React.useState<string | null>(null)

  React.useEffect(() => {
    window.nika.app
      .ping()
      .then((v) => setPong(v))
      .catch(() => setPong('error'))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-white">Desktop app</div>
        <div className="mt-1 text-sm text-slate-400">
          Secure preload + IPC channel is active: <span className="text-slate-200">{pong ?? '...'}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="Profiles" desc="Fingerprint + proxy + storage as a durable identity." />
        <Panel title="Automations" desc="Recorded actions & scripts tied to profiles." />
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-950/40 p-6 shadow-glow">
        <div className="text-sm font-semibold">Next steps</div>
        <div className="mt-2 text-sm text-slate-300">
          Phase 1 provides the foundation — routing, IPC, security defaults, and an aesthetic dark UI.
        </div>
      </div>
    </div>
  )
}

function Panel({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-950/40 p-6 shadow-glow">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-2 text-sm text-slate-300">{desc}</div>
    </div>
  )
}
