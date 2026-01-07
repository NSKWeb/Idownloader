'use client'

import { useTheme } from 'next-themes'
import { Button } from './Button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => setTheme(next)}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? 'Dark' : 'Light'}
    </Button>
  )
}
