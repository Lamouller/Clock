import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Theme } from '@radix-ui/themes'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './components/dashboard/Dashboard'
import { ClockInOut } from './components/timeclock/ClockInOut'
import { ShiftManagement } from './components/shifts/ShiftManagement'
import { Records } from './components/records/Records'
import { Calendar } from './components/calendar/Calendar'
import { Settings } from './components/settings/Settings'
import { AuthTabs } from './components/auth/AuthTabs'
import useAuthStore from './stores/authStore'
import useThemeStore from './stores/themeStore'
import { useEffect } from 'react'

export function App() {
  const isDark = useThemeStore((state) => state.isDark)
  const { user, loading, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Theme appearance={isDark ? 'dark' : 'light'} accentColor="blue">
      <BrowserRouter>
        {user ? (
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clock" element={<ClockInOut />} />
              <Route path="/shifts" element={<ShiftManagement />} />
              <Route path="/records" element={<Records />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        ) : (
          <Routes>
            <Route path="/login" element={<AuthTabs />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </BrowserRouter>
    </Theme>
  )
}
