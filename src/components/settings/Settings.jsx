import { Tabs } from '@radix-ui/themes'
import { EmployeeManagement } from './EmployeeManagement'
import { ProfileSettings } from './ProfileSettings'
import useThemeStore from '../../stores/themeStore'

export function Settings() {
  const isDark = useThemeStore((state) => state.isDark)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>
          Manage your account and team settings
        </p>
      </div>

      <Tabs.Root defaultValue="profile">
        <Tabs.List>
          <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
          <Tabs.Trigger value="employees">Employees</Tabs.Trigger>
        </Tabs.List>

        <div className="mt-4">
          <Tabs.Content value="profile">
            <ProfileSettings />
          </Tabs.Content>
          <Tabs.Content value="employees">
            <EmployeeManagement />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  )
}
