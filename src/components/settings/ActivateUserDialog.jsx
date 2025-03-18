import { useState } from 'react'
import { Dialog, TextField, Button } from '@radix-ui/themes'
import useThemeStore from '../../stores/themeStore'

export function ActivateUserDialog({ open, user, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState(null)
  const isDark = useThemeStore((state) => state.isDark)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    onSubmit(formData)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Title>Activate Employee Account</Dialog.Title>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <TextField.Root>
              <TextField.Input
                value={formData.email}
                disabled
              />
            </TextField.Root>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <TextField.Root>
                <TextField.Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="First name"
                  required
                />
              </TextField.Root>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <TextField.Root>
                <TextField.Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Last name"
                  required
                />
              </TextField.Root>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <TextField.Root>
              <TextField.Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Set password"
                required
                minLength={6}
              />
            </TextField.Root>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <TextField.Root>
              <TextField.Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm password"
                required
                minLength={6}
              />
            </TextField.Root>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="soft" 
              color="gray" 
              onClick={onClose}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Activating...' : 'Activate Account'}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
