import { useState, useEffect } from 'react'
import { Text } from '@radix-ui/themes'
import useThemeStore from '../../stores/themeStore'

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return [hours, minutes, secs]
    .map(v => v.toString().padStart(2, '0'))
    .join(':')
}

export function Timer({ startTime, expectedDuration }) {
  const [elapsed, setElapsed] = useState(0)
  const isDark = useThemeStore((state) => state.isDark)

  useEffect(() => {
    const calculateElapsed = () => {
      return Math.floor((Date.now() - startTime.getTime()) / 1000)
    }

    // Initial calculation
    setElapsed(calculateElapsed())

    // Update every second
    const interval = setInterval(() => {
      setElapsed(calculateElapsed())
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
