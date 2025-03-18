import { useState, useEffect } from 'react'
import { Card, TextField, Button, Select } from '@radix-ui/themes'
import { supabase } from '../../lib/supabase'
import useAuthStore from '../../stores/authStore'
import useThemeStore from '../../stores/themeStore'

export function ProfileSettings() {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    team: '',
    phone: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const user = useAuthStore((state) => state.user)
  const isDark = useThemeStore((state) => state.isDark)

  useEffect(() => {
    fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data || {})
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone
        })
        .eq('id', user.id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Card className="max-w-xl">
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <TextField.Root>
              <TextField.Input
                value={profile.first_name || ''}
                onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                placeholder="First name"
              />
            </TextField.Root>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <TextField.Root>
              <TextField.Input
                value={profile.last_name || ''}
                onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                placeholder="Last name"
              />
            </TextField.Root>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <TextField.Root>
            <TextField.Input
              value={profile.email || ''}
              disabled
              type="email"
            />
          </TextField.Root>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <TextField.Root>
            <TextField.Input
              value={profile.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="Phone number"
              type="tel"
            />
          </TextField.Root>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Team</label>
          <TextField.Root>
            <TextField.Input
              value={profile.team || ''}
              disabled
            />
          </TextField.Root>
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
