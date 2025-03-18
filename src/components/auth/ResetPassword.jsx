import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Button, TextField } from '@radix-ui/themes'
import useThemeStore from '../../stores/themeStore'

export function ResetPassword({ onBack }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const isDark = useThemeStore((state) => state.isDark)

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-callback`
      })
      if (error) throw error
      setSuccess(true)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className={`rounded-2xl p-6 ${isDark ? 'bg-white/10' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-2">Check your email</h2>
          <p className={`text-sm ${isDark ? 'text-white/60' : 'text-black/60'} mb-4`}>
            We've sent you instructions to reset your password.
          </p>
          <Button onClick={onBack}>Return to Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold mb-2">Reset Password</h1>
        <p className={`text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>
          Enter your email to receive reset instructions
        </p>
      </div>

      <div className={`rounded-2xl p-6 ${isDark ? 'bg-white/10' : 'bg-white'}`}>
        <form onSubmit={handleReset} className="space-y-4">
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

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </Button>
        </form>

        <div className="mt-6">
          <button 
            onClick={onBack}
            className={`text-sm w-full text-center ${isDark ? 'text-white/60 hover:text-white/80' : 'text-black/60 hover:text-black/80'}`}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  )
}
