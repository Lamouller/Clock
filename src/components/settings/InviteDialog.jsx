import { useState } from 'react'
import { Dialog, TextField, Select, Button } from '@radix-ui/themes'
import useThemeStore from '../../stores/themeStore'

const ROLES = {
  employee: 'Employee',
  manager: 'Manager',
  admin: 'Admin'
}

const TEAMS = ['Kitchen', 'Service', 'Bar', 'Management']

export function InviteDialog({ open, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    email: '',
    role: 'employee',
    team: 'Kitchen'
  })
  const isDark = useThemeStore((state) => state.isDark)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit(formData)
    setFormData({ email: '', role: 'employee', team: 'Kitchen' }) // Reset form
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Title>Invite New Employee</Dialog.Title>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <TextField.Root>
              <TextField.Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="employee@example.com"
                required
              />
            </TextField.Root>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Role
            </label>
            <Select.Root
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <Select.Trigger className="w-full" />
              <Select.Content>
                {Object.entries(ROLES).map(([key, label]) => (
                  <Select.Item key={key} value={key}>
                    {label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Team
            </label>
            <Select.Root
              value={formData.team}
              onValueChange={(value) => setFormData({ ...formData, team: value })}
            >
              <Select.Trigger className="w-full" />
              <Select.Content>
                {TEAMS.map((team) => (
                  <Select.Item key={team} value={team}>
                    {team}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

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
              {loading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
