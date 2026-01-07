import type { Config } from 'tailwindcss'

export default {
  content: ['./src/renderer/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        nika: {
          bg: '#0f172a',
          panel: '#1e293b',
          cyan: '#06b6d4',
          indigo: '#6366f1',
          blue: '#3b82f6',
        },
      },
      backgroundImage: {
        'nika-gradient': 'linear-gradient(90deg, #6366f1 0%, #3b82f6 50%, #06b6d4 100%)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(99,102,241,0.25), 0 0 24px rgba(6,182,212,0.15)',
      },
    },
  },
  plugins: [],
} satisfies Config
