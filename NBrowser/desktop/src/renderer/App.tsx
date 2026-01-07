import React from 'react'
import { WindowControls } from './components/WindowControls'
import { Home } from './pages/Home'

export default function App() {
  return (
    <div className="h-screen">
      <header
        className="flex h-12 items-center justify-between border-b border-slate-800/60 bg-slate-950/40 px-4"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-nika-cyan shadow-glow" />
          <div className="text-sm font-semibold">
            <span className="bg-nika-gradient bg-clip-text text-transparent">Nika</span>{' '}
            Browser
          </div>
        </div>
        <WindowControls />
      </header>

      <div className="flex h-[calc(100vh-3rem)]">
        <aside className="w-64 border-r border-slate-800/60 bg-slate-950/30 p-4">
          <div className="text-xs font-semibold text-slate-300">Navigation</div>
          <div className="mt-3 space-y-1 text-sm text-slate-300">
            <div className="rounded-lg border border-slate-700/60 bg-slate-800/40 px-3 py-2">
              Home
            </div>
            <div className="rounded-lg px-3 py-2 opacity-70">Profiles (next)</div>
            <div className="rounded-lg px-3 py-2 opacity-70">Automations (next)</div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto p-6">
          <Home />
        </main>
      </div>
    </div>
  )
}
