import { useState, useEffect } from 'react'
import { Button, Card, Select } from '@radix-ui/themes'
import useThemeStore from '../../stores/themeStore'
import { supabase } from '../../lib/supabase'
import { Timer } from './Timer'

const SHIFTS = {
  lunch: {
    name: 'Lunch Service',
    defaultStart: '11:00',
    defaultEnd: '15:00',
    expectedDuration: 4 * 60 * 60 // 4 hours in seconds
  },
  dinner: {
    name: 'Dinner Service',
    defaultStart: '18:00',
    defaultEnd: '23:00',
    expectedDuration: 5 * 60 * 60 // 5 hours in seconds
  }
}

export function ClockInOut() {
  const [selectedShift, setSelectedShift] = useState(null)
  const [activeClockIn, setActiveClockIn] = useState(null)
  const [loading, setLoading] = useState(false)
  const isDark = useThemeStore((state) => state.isDark)

  // Check for active clock-in on mount
  useEffect(() => {
    const storedClockIn = localStorage.getItem('activeClockIn')
    if (storedClockIn) {
      setActiveClockIn(JSON.parse(storedClockIn))
    }
  }, [])

  const handleClockIn = async () => {
    if (!selectedShift) return
    
    setLoading(true)
    try {
      const clockInData = {
        startTime: new Date().toISOString(),
        shift: selectedShift
      }

      setActiveClockIn(clockInData)
      localStorage.setItem('activeClockIn', JSON.stringify(clockInData))
      setSelectedShift(null)
    } catch (error) {
      console.error('Error clocking in:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClockOut = async () => {
    setLoading(true)
    try {
      localStorage.removeItem('activeClockIn')
      setActiveClockIn(null)
    } catch (error) {
      console.error('Error clocking out:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`w-full max-w-md mx-auto ${isDark ? 'text-white' : 'text-black'}`}>
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
              startTime={new Date(activeClockIn.startTime)}
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
                    Lunch Service ({SHIFTS.lunch.defaultStart} - {SHIFTS.lunch.defaultEnd})
                  </Select.Item>
                  <Select.Item value="dinner">
                    Dinner Service ({SHIFTS.dinner.defaultStart} - {SHIFTS.dinner.defaultEnd})
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
