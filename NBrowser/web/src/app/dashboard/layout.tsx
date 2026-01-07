import { Sidebar } from '@/components/ui/Sidebar'
import { Topbar } from './_components/Topbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
