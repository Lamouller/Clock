import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

const useClockStore = create(
  persist(
    (set, get) => ({
      activeClockIn: null,
      loading: false,
      
      setActiveClockIn: (clockIn) => set({ activeClockIn: clockIn }),
      
      checkActiveClockIn: async (userId) => {
        if (!userId) return

        try {
          set({ loading: true })
          const { data, error } = await supabase
            .from('time_logs')
            .select('*')
            .eq('user_id', userId)
            .is('clock_out', null)
            .single()

          if (error && error.code !== 'PGRST116') {
            throw error
          }

          if (data) {
            set({
              activeClockIn: {
                id: data.id,
                startTime: data.clock_in,
                shift: data.shift_type,
                userId: data.user_id
              }
            })
          } else {
            set({ activeClockIn: null })
          }
        } catch (error) {
          console.error('Error checking clock-in status:', error)
        } finally {
          set({ loading: false })
        }
      },

      clockIn: async (userId, shiftType) => {
        try {
          set({ loading: true })
          const { data, error } = await supabase
            .from('time_logs')
            .insert([{
              user_id: userId,
              clock_in: new Date().toISOString(),
              shift_type: shiftType,
              expected_end: new Date(Date.now() + (shiftType === 'lunch' ? 4 : 5) * 60 * 60 * 1000).toISOString()
            }])
            .select()
            .single()

          if (error) throw error

          const clockIn = {
            id: data.id,
            startTime: data.clock_in,
            shift: data.shift_type,
            userId: data.user_id
          }
          
          set({ activeClockIn: clockIn })
          return clockIn
        } catch (error) {
          console.error('Error clocking in:', error)
          throw error
        } finally {
          set({ loading: false })
        }
      },

      clockOut: async () => {
        const state = get()
        if (!state.activeClockIn) return

        try {
          set({ loading: true })
          const { error } = await supabase
            .from('time_logs')
            .update({ clock_out: new Date().toISOString() })
            .eq('id', state.activeClockIn.id)
            .eq('user_id', state.activeClockIn.userId)

          if (error) throw error
          
          set({ activeClockIn: null })
        } catch (error) {
          console.error('Error clocking out:', error)
          throw error
        } finally {
          set({ loading: false })
        }
      }
    }),
    {
      name: 'clock-store',
      getStorage: () => localStorage
    }
  )
)

export default useClockStore
