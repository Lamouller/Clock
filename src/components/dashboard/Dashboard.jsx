import { Card, Heading } from '@radix-ui/themes'
import useThemeStore from '../../stores/themeStore'

export function Dashboard() {
  const isDark = useThemeStore((state) => state.isDark)

  return (
    <div className="space-y-6">
      <div>
        <Heading size="6">Dashboard</Heading>
        <p className={`mt-1 text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>
          Overview of your work hours and upcoming shifts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <Heading size="3">Today's Hours</Heading>
          <p className={`mt-1 text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>
            Not clocked in
          </p>
        </Card>

        <Card className="p-4">
          <Heading size="3">This Week</Heading>
          <p className={`mt-1 text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>
            0 hours worked
          </p>
        </Card>

        <Card className="p-4">
          <Heading size="3">Next Shift</Heading>
          <p className={`mt-1 text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>
            No upcoming shifts
          </p>
        </Card>
      </div>
    </div>
  )
}
