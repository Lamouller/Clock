import { Container } from '@radix-ui/themes'
import { TopNav } from './TopNav'
import { Sidebar } from './Sidebar'
import useThemeStore from '../../stores/themeStore'
import { useState } from 'react'

export function Layout({ children }) {
  const isDark = useThemeStore((state) => state.isDark)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
