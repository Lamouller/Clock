import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { ResetPassword } from './ResetPassword'
import useThemeStore from '../../stores/themeStore'

export function AuthTabs() {
  const [activeView, setActiveView] = useState('login')
  const isDark = useThemeStore((state) => state.isDark)

  return (
    <div className={`w-full max-w-md ${isDark ? 'text-white' : 'text-black'}`}>
      {activeView === 'login' && (
        <LoginForm 
          onRegister={() => setActiveView('register')}
          onForgotPassword={() => setActiveView('reset')}
        />
      )}
      {activeView === 'register' && (
        <RegisterForm onBack={() => setActiveView('login')} />
      )}
      {activeView === 'reset' && (
        <ResetPassword onBack={() => setActiveView('login')} />
      )}
    </div>
  )
}
