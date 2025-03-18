import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Button, Card, Select, Text } from '@radix-ui/themes'
import useAuthStore from '../../stores/authStore'
import useThemeStore from '../../stores/themeStore'
import { Timer } from './Timer'
import { formatDuration } from '../../utils/timeUtils'

const SHIFTS = {
  lunch: {
    name: 'Lunch Service',
    expectedDuration: 4 * 60 * 60, // 4 hours in seconds
    color: 'amber'
  },
  dinner: {
    name: 'Dinner Service',
    expectedDuration: 5 * 60 * 60, // 5 hours in seconds
    color: 'indigo'
  }
}

export function ClockInOut() {
  const [selectedShift, setSelectedShift] = useState(null)
  const [activeClockIn, setActiveClockIn] = useState(null)
  const [loading, setLoading] = useState(false)
  const user = useAuthStore((state) => state.user)
  const isDark = useThemeStore((state) => state.isDark)

  // Load active clock-in on mount
  useEffect(() => {
    const loadActiveClockIn = async () => {
      const { data: activeLog } = await supabase
        .from('time_logs')
        .select('*')
        .eq('user_id', user?.id)
        .is('clock_out', null)
        .single()

      if (activeLog) {
        setActiveClockIn({
          id: activeLog.id,
          startTime: new Date(activeLog.clock_in),
          shift: activeLog.shift_type
        })
      }
    }

    if (user) {
      loadActiveClockIn()
    }
  }, [user])

  const handleClockIn = async () => {
    if (!selectedShift) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('time_logs')
        .insert([
          {
            user_id: user.id,
            clock_in: new Date().toISOString(),
            shift_type: selectedShift,
            expected_end: new Date(Date.now() + SHIFTS[selectedShift].expectedDuration * 1000).toISOString()
          }
        ])
        .select()
        .single()

      if (error) throw error

      setActiveClockIn({
        id: data.id,
        startTime: new Date(data.clock_in),
        shift: data.shift_type
      })

      // Store in localStorage for persistence
      localStorage.setItem('activeClockIn', JSON.stringify({
        id: data.id,
        startTime: data.clock_in,
        shift: data.shift_type
      }))

    } catch (error) {
      console.error('Error clocking in:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClockOut = async () => {
    if (!activeClockIn) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('time_logs')
        .update({
          clock_out: new Date().toISOString()
        })
        .eq('id', activeClockIn.id)

      if (error) throw error

      setActiveClockIn(null)
      localStorage.removeItem('activeClockIn')
      setSelectedShift(null)

    } catch (error) {
      console.error('Error clocking out:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`w-full max-w-md ${isDark ? 'text-white' : 'text-black'}`}>
      <Card className={`rounded-2xl p-8 ${isDark ? 'bg-white/10' : 'bg-white'}`}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">Time Clock</h2>
          <p className={`text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>
            {activeClockIn 
              ? `Currently working ${SHIFTS[activeClockIn.shift].name}`
              : 'Select your shift and clock in'
            }
          </p>
        </div>

        {activeClockIn ? (
          <div className="space-y-6">
            <Timer 
              startTime={activeClockIn.startTime}
              expectedDuration={SHIFTS[activeClockIn.shift].expectedDuration}
            />
            
            <Button 
              size="3"
              color="red"
              onClick={handleClockOut}
              disabled={loading}
              className="w-full h-16 text-lg"
            >
              Clock Out
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <Select.Root
              value={selectedShift}
              onValueChange={setSelectedShift}
            >
              <Select.Trigger 
                className="w-full h-12"
                placeholder="Select your shift"
              />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Available Shifts</Select.Label>
                  <Select.Item value="lunch">
                    Lunch Service (11:00 - 15:00)
                  </Select.Item>
                  <Select.Item value="dinner">
                    Dinner Service (18:00 - 23:00)
                  </Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>

            <Button 
              size="3"
              color="blue"
              onClick={handleClockIn}
              disabled={loading || !selectedShift}
              className="w-full h-16 text-lg"
            >
              Clock In
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
