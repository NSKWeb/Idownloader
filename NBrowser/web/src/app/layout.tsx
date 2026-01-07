import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ToastProvider } from '@/components/ui/Toast'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Nika Browser',
  description: 'Premium browser profiles & automations — foundation (Phase 1)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
