import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  initialize: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error

      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        set({ 
          user: profile,
          session,
          loading: false 
        })
      } else {
        set({ 
          user: null,
          session: null,
          loading: false 
        })
      }
    } catch (error) {
      set({ 
        error: error.message,
        loading: false 
      })
    }
  },

  signOut: async (navigate) => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Clear all auth state
      set({ 
        user: null,
        session: null,
        error: null
      })

      // Handle redirect
      if (navigate) {
        navigate('/login')
      } else {
        window.location.href = '/login'
      }
      
      return { error: null }
    } catch (error) {
      console.error('Signout error:', error)
      set({ error: error.message })
      return { error }
    }
  }
}))

export default useAuthStore
