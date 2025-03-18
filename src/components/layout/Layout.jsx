import { Container } from '@radix-ui/themes'
import { TopNav } from './TopNav'
import { Sidebar } from './Sidebar'
import useThemeStore from '../../stores/themeStore'
import useAuthStore from '../../stores/authStore'
import { useState } from 'react'

export function Layout({ children }) {
  const isDark = useThemeStore((state) => state.isDark)
  const user = useAuthStore((state) => state.user)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  if (!user) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-[#f5f5f7]'}`}>
        <Container size="2" className="py-8">
          <div className="flex flex-col items-center justify-center min-h-screen">
            {children}
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-[#f5f5f7]'}`}>
      <TopNav onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="pt-14 lg:pl-64">
        <Container size="3" className="p-4">
          {children}
        </Container>
      </div>
    </div>
  )
}
