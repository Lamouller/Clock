import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Add the missing isAdmin function
export const isAdmin = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return profile?.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

export const clearAuthData = () => {
  localStorage.removeItem('supabase.auth.token')
  localStorage.removeItem('theme-store')
  localStorage.removeItem('clock-store')
}

export const handleLogout = async (navigate) => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    clearAuthData()
    
    if (navigate) {
      navigate('/login')
    }
    
    return { error: null }
  } catch (error) {
    console.error('Logout error:', error)
    return { error }
  }
}
