import { Button } from '@radix-ui/themes'
import useThemeStore from '../../stores/themeStore'
import { ThemeToggle } from './ThemeToggle'
import { Link, useLocation } from 'react-router-dom'

export function TopNav({ onMenuClick }) {
  const isDark = useThemeStore((state) => state.isDark)
  const location = useLocation()

  return (
    <nav className={`fixed top-0 left-0 right-0 h-14 ${isDark ? 'bg-black/50 backdrop-blur-xl' : 'bg-white/50 backdrop-blur-xl'} z-20 border-b ${isDark ? 'border-white/10' : 'border-black/10'}`}>
      <div className="h-full px-4 flex items-center justify-between lg:pl-64">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            onClick={onMenuClick}
            className="lg:hidden w-8 h-8 flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </Button>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/records"
              className={`text-sm font-medium ${isDark ? 'text-white/90 hover:text-white' : 'text-black/90 hover:text-black'} ${location.pathname === '/records' ? 'opacity-100' : 'opacity-60'}`}
            >
              My Records
            </Link>
            <Link 
              to="/calendar"
              className={`text-sm font-medium ${isDark ? 'text-white/90 hover:text-white' : 'text-black/90 hover:text-black'} ${location.pathname === '/calendar' ? 'opacity-100' : 'opacity-60'}`}
            >
              My Calendar
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
