import { Link, useLocation } from 'react-router-dom'
import useThemeStore from '../../stores/themeStore'
import { Button } from '@radix-ui/themes'

export function Sidebar({ isOpen, onClose }) {
  const isDark = useThemeStore((state) => state.isDark)
  const location = useLocation()

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: 'M3 13.5C3 12.7044 3.31607 11.9413 3.87868 11.3787C4.44129 10.8161 5.20435 10.5 6 10.5H9C9.79565 10.5 10.5587 10.8161 11.1213 11.3787C11.6839 11.9413 12 12.7044 12 13.5V15H3V13.5Z M6.75 3.75C8.2688 3.75 9.5 4.98122 9.5 6.5C9.5 8.01878 8.2688 9.25 6.75 9.25C5.23122 9.25 4 8.01878 4 6.5C4 4.98122 5.23122 3.75 6.75 3.75Z' },
    { path: '/clock', label: 'Clock In/Out', icon: 'M7.5 1.5C4.05 1.5 1.5 4.05 1.5 7.5C1.5 10.95 4.05 13.5 7.5 13.5C10.95 13.5 13.5 10.95 13.5 7.5C13.5 4.05 10.95 1.5 7.5 1.5ZM7.5 12C4.875 12 3 10.125 3 7.5C3 4.875 4.875 3 7.5 3C10.125 3 12 4.875 12 7.5C12 10.125 10.125 12 7.5 12ZM7.875 4.5H6.75V8.25L9.975 10.2L10.5 9.33L7.875 7.755V4.5Z' },
    { path: '/shifts', label: 'Shift Management', icon: 'M3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5V11.5C12 11.7761 11.7761 12 11.5 12H3.5C3.22386 12 3 11.7761 3 11.5V3.5ZM4 4V11H11V4H4Z' },
    { path: '/records', label: 'My Records', icon: 'M2.5 2C2.22386 2 2 2.22386 2 2.5V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V2.5C13 2.22386 12.7761 2 12.5 2H2.5ZM3 3H12V12H3V3Z' },
    { path: '/calendar', label: 'My Calendar', icon: 'M4.5 1C4.22386 1 4 1.22386 4 1.5V2H3.5C2.67157 2 2 2.67157 2 3.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V3.5C13 2.67157 12.3284 2 11.5 2H11V1.5C11 1.22386 10.7761 1 10.5 1C10.2239 1 10 1.22386 10 1.5V2H5V1.5C5 1.22386 4.77614 1 4.5 1ZM11 3V3.5C11 3.77614 10.7761 4 10.5 4C10.2239 4 10 3.77614 10 3.5V3H5V3.5C5 3.77614 4.77614 4 4.5 4C4.22386 4 4 3.77614 4 3.5V3H3.5C3.22386 3 3 3.22386 3 3.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V3.5C12 3.22386 11.7761 3 11.5 3H11Z' },
    { path: '/settings', label: 'Settings', icon: 'M7.5 1.5C4.05 1.5 1.5 4.05 1.5 7.5C1.5 10.95 4.05 13.5 7.5 13.5C10.95 13.5 13.5 10.95 13.5 7.5C13.5 4.05 10.95 1.5 7.5 1.5ZM7.5 12C4.875 12 3 10.125 3 7.5C3 4.875 4.875 3 7.5 3C10.125 3 12 4.875 12 7.5C12 10.125 10.125 12 7.5 12Z' }
  ]

  const sidebarClasses = `
    fixed top-0 left-0 z-30 h-full w-64 transform transition-transform duration-200 ease-in-out
    ${isDark ? 'bg-black/90 backdrop-blur-xl' : 'bg-white/90 backdrop-blur-xl'}
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={sidebarClasses}>
        <div className="h-14 flex items-center px-4 border-b border-r border-r-white/10 border-b-white/10">
          <span className={`text-lg font-medium ${isDark ? 'text-white' : 'text-black'}`}>
            Time Clock
          </span>
        </div>

        <div className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                ${location.pathname === item.path 
                  ? isDark 
                    ? 'bg-white/10 text-white' 
                    : 'bg-black/5 text-black'
                  : isDark
                    ? 'text-white/60 hover:text-white hover:bg-white/5'
                    : 'text-black/60 hover:text-black hover:bg-black/5'
                }
              `}
              onClick={() => onClose()}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d={item.icon} fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
              </svg>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
