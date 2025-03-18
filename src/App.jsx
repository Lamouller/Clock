import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Theme } from '@radix-ui/themes'
import { AuthTabs } from './components/auth/AuthTabs'
import { ClockInOut } from './components/timeclock/ClockInOut'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './components/dashboard/Dashboard'
import { ShiftManagement } from './components/shifts/ShiftManagement'
import { useEffect } from 'react'
import { supabase } from './lib/supabase'
import useAuthStore from './stores/authStore'
import useThemeStore from './stores/themeStore'

export function App() {
  const setUser = useAuthStore((state) => state.setUser)
  const setSession = useAuthStore((state) => state.setSession)
  const user = useAuthStore((state) => state.user)
  const isDark = useThemeStore((state) => state.isDark)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setSession, setUser])

  return (
    <Theme appearance={isDark ? 'dark' : 'light'} accentColor="blue">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <AuthTabs />} />
            <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/clock" element={user ? <ClockInOut /> : <Navigate to="/login" />} />
            <Route path="/shifts" element={user ? <ShiftManagement /> : <Navigate to="/login" />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </Theme>
  )
}
