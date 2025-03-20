import { useState } from 'react'
import { Tabs, Button, AlertDialog } from '@radix-ui/themes'
import { useNavigate } from 'react-router-dom'
import { EmployeeManagement } from './EmployeeManagement'
import { ProfileSettings } from './ProfileSettings'
import useThemeStore from '../../stores/themeStore'
import useAuthStore from '../../stores/authStore'

export function Settings() {
  const isDark = useThemeStore((state) => state.isDark)
  const navigate = useNavigate()
  const signOut = useAuthStore((state) => state.signOut)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [error, setError] = useState(null)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      setError(null)
      
      const { error: signOutError } = await signOut(navigate)
      if (signOutError) throw signOutError
      
    } catch (error) {
      console.error('Logout failed:', error)
      setError('Failed to log out. Please try again.')
      setShowLogoutConfirm(false)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className={`mt-1 text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>
              Manage your account and team settings
            </p>
          </div>
          <Button 
            color="red" 
            variant="soft"
            disabled={isLoggingOut}
            onClick={() => setShowLogoutConfirm(true)}
          >
            {isLoggingOut ? 'Logging out...' : 'Log Out'}
          </Button>
        </div>
        
        {error && (
          <div className="mt-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
            {error}
          </div>
        )}
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

      <AlertDialog.Root 
        open={showLogoutConfirm} 
        onOpenChange={setShowLogoutConfirm}
      >
        <AlertDialog.Content>
          <AlertDialog.Title>Confirm Logout</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to log out? You'll need to sign in again to access your account.
          </AlertDialog.Description>

          <div className="flex justify-end gap-3 mt-4">
            <AlertDialog.Cancel>
              <Button 
                variant="soft" 
                color="gray"
                disabled={isLoggingOut}
              >
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button 
                color="red"
                disabled={isLoggingOut}
                onClick={handleLogout}
              >
                {isLoggingOut ? 'Logging out...' : 'Log Out'}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  )
}
