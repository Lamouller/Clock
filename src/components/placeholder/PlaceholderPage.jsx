import { Heading } from '@radix-ui/themes'
import useThemeStore from '../../stores/themeStore'

export function PlaceholderPage({ title, description }) {
  const isDark = useThemeStore((state) => state.isDark)

  return (
    <div className="space-y-6">
      <div>
        <Heading size="6">{title}</Heading>
        <p className={`mt-1 text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>
          {description}
        </p>
      </div>

      <div className={`rounded-lg border-2 border-dashed ${isDark ? 'border-white/10' : 'border-black/10'} p-8 text-center`}>
        <p className={isDark ? 'text-white/40' : 'text-black/40'}>
          This feature is coming soon
        </p>
      </div>
    </div>
  )
}
