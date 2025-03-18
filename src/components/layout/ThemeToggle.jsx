import { Button } from '@radix-ui/themes'
import useThemeStore from '../../stores/themeStore'

export function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeStore()
  
  return (
    <Button 
      variant="ghost" 
      onClick={toggleTheme}
      className="w-8 h-8 flex items-center justify-center rounded-full"
    >
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 12.5C10.4853 12.5 12.5 10.4853 12.5 8C12.5 5.51472 10.4853 3.5 8 3.5C5.51472 3.5 3.5 5.51472 3.5 8C3.5 10.4853 5.51472 12.5 8 12.5Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 1V2" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 14V15" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2.75 2.75L3.75 3.75" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12.25 12.25L13.25 13.25" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 8H2" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 8H15" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2.75 13.25L3.75 12.25" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12.25 3.75L13.25 2.75" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5 8.5C13.5 11.5376 11.0376 14 8 14C4.96243 14 2.5 11.5376 2.5 8.5C2.5 5.46243 4.96243 3 8 3C8.34663 3 8.68577 3.03374 9.01404 3.09816C8.37771 3.86354 8 4.84625 8 5.91549C8 8.45362 10.0614 10.5 12.6147 10.5C12.9045 10.5 13.1862 10.4716 13.4562 10.4178C13.4848 10.1262 13.5 9.82891 13.5 9.52606V8.5Z" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </Button>
  )
}
