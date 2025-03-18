import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Button, TextField } from '@radix-ui/themes'
import useThemeStore from '../../stores/themeStore'

export function RegisterForm({ onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const isDark = useThemeStore((state) => state.isDark)

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // 1. Sign up the user
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      })
      
      if (signUpError) throw signUpError

      // 2. Create profile only if we have a user
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              first_name: firstName,
              last_name: lastName,
              role: 'employee'
            }
          ])
        
        if (profileError) {
          // If profile creation fails, we should handle it but still show success
          // since the user was created
          console.error('Profile creation error:', profileError)
        }
      }

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
            We've sent you a confirmation email. Please verify your account to continue.
          </p>
          <Button onClick={onBack}>Return to Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold mb-2">Create Account</h1>
        <p className={`text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>
          Sign up to get started
        </p>
      </div>

      <div className={`rounded-2xl p-6 ${isDark ? 'bg-white/10' : 'bg-white'}`}>
        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <TextField.Root>
              <TextField.Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className={`h-12 ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}
                required
              />
            </TextField.Root>

            <TextField.Root>
              <TextField.Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className={`h-12 ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}
                required
              />
            </TextField.Root>
          </div>
          
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
              placeholder="Password (min 6 characters)"
              className={`h-12 ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}
              required
              minLength={6}
            />
          </TextField.Root>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6">
          <button 
            onClick={onBack}
            className={`text-sm w-full text-center ${isDark ? 'text-white/60 hover:text-white/80' : 'text-black/60 hover:text-black/80'}`}
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  )
}
