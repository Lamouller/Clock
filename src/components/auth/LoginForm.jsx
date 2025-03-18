import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Button, TextField } from '@radix-ui/themes'
import useThemeStore from '../../stores/themeStore'

export function LoginForm({ onRegister, onForgotPassword }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const isDark = useThemeStore((state) => state.isDark)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold mb-2">Welcome Back</h1>
        <p className={`text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>
          Sign in to access your account
        </p>
      </div>

      <div className={`rounded-2xl p-6 ${isDark ? 'bg-white/10' : 'bg-white'}`}>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <TextField.Root>
            <TextField.Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={`h-12 ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}
              required
            />
          </TextField.Root>
          
          <TextField.Root>
            <TextField.Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`h-12 ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}
              required
            />
          </TextField.Root>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 space-y-2">
          <button 
            onClick={onForgotPassword}
            className={`text-sm w-full text-center ${isDark ? 'text-white/60 hover:text-white/80' : 'text-black/60 hover:text-black/80'}`}
          >
            Forgot your password?
          </button>
          <button 
            onClick={onRegister}
            className={`text-sm w-full text-center ${isDark ? 'text-white/60 hover:text-white/80' : 'text-black/60 hover:text-black/80'}`}
          >
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  )
}
