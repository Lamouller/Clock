import { useState, useEffect } from 'react'
import { Text } from '@radix-ui/themes'
import useThemeStore from '../../stores/themeStore'
import { formatDuration } from '../../utils/timeUtils'

export function Timer({ startTime, expectedDuration }) {
  const [elapsed, setElapsed] = useState(0)
  const isDark = useThemeStore((state) => state.isDark)

  useEffect(() => {
    // Load from localStorage on mount
    const storedElapsed = localStorage.getItem('timerElapsed')
    if (storedElapsed) {
      setElapsed(parseInt(storedElapsed, 10))
    } else {
      setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000))
    }

    const interval = setInterval(() => {
      const newElapsed = Math.floor((Date.now() - startTime.getTime()) / 1000)
      setElapsed(newElapsed)
      localStorage.setItem('timerElapsed', newElapsed.toString())
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  const getTimerColor = () => {
    const percentage = (elapsed / expectedDuration) * 100
    if (percentage < 75) return 'green'
    if (percentage < 90) return 'yellow'
    return 'red'
  }

  return (
    <div className="text-center space-y-2">
      <div className={`text-4xl font-mono font-bold text-${getTimerColor()}-500`}>
        {formatDuration(elapsed)}
      </div>
      <Text size="2" className={isDark ? 'text-white/60' : 'text-black/60'}>
        Expected duration: {formatDuration(expectedDuration)}
      </Text>
    </div>
  )
}
