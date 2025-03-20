import { useState, useEffect } from 'react'
import { 
  Table, 
  Button,
  Dialog,
  TextField,
  Select,
  Text,
  Card
} from '@radix-ui/themes'
import { supabase, isAdmin } from '../../lib/supabase'
import useThemeStore from '../../stores/themeStore'
import { InviteDialog } from './InviteDialog'
import { ActivateUserDialog } from './ActivateUserDialog'

const ROLES = {
  employee: {
    name: 'Employee',
    description: 'Can clock in/out and view own schedule'
  },
  manager: {
    name: 'Manager',
    description: 'Can manage shifts and view all records'
  },
  admin: {
    name: 'Admin',
    description: 'Full access to all features'
  }
}

// Change to named export to match existing imports
export function EmployeeManagement() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [activateUser, setActivateUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const isDark = useThemeStore((state) => state.isDark)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEmployees(data || [])
    } catch (error) {
      console.error('Error fetching employees:', error)
      showNotification('Error fetching employees', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async (formData) => {
    try {
      setLoading(true)
      
      // Check if email already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .single()

      if (existingProfile) {
        showNotification('Email already registered', 'error')
        return
      }

      // Create profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          email: formData.email,
          role: formData.role,
          team: formData.team,
          status: 'invited'
        }])
        .select()
        .single()

      if (profileError) throw profileError

      showNotification('Employee added successfully')
      setIsInviteOpen(false)
      await fetchEmployees()

    } catch (error) {
      console.error('Error adding employee:', error)
      showNotification(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRole = async (userId, newRole) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error
      
      showNotification('Role updated successfully')
      await fetchEmployees()
    } catch (error) {
      console.error('Error updating role:', error)
      showNotification('Error updating role', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleActivateUser = async (userData) => {
    try {
      setLoading(true)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          status: 'active',
          first_name: userData.firstName,
          last_name: userData.lastName,
        })
        .eq('id', userData.id)
        .eq('status', 'invited')

      if (updateError) throw updateError

      showNotification('User activated successfully')
      setActivateUser(null)
      await fetchEmployees()

    } catch (error) {
      console.error('Error activating user:', error)
      showNotification(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !employees.length) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6 relative">
      {notification && (
        <div 
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-opacity duration-300 ${
            notification.type === 'error' 
              ? 'bg-red-500 text-white' 
              : 'bg-green-500 text-white'
          }`}
        >
          {notification.message}
        </div>
      )}

      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <Text size="5" weight="bold">Team Members</Text>
            <Text size="2" color="gray">
              {employees.length} members
            </Text>
          </div>
          <Button onClick={() => setIsInviteOpen(true)}>
            Add Employee
          </Button>
        </div>
      </Card>

      <Card>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Team</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {employees.map((employee) => (
              <Table.Row key={employee.id}>
                <Table.Cell>{employee.email}</Table.Cell>
                <Table.Cell>
                  {employee.first_name} {employee.last_name}
                </Table.Cell>
                <Table.Cell>{employee.team}</Table.Cell>
                <Table.Cell>
                  <Select.Root
                    value={employee.role}
                    onValueChange={(value) => handleUpdateRole(employee.id, value)}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      {Object.entries(ROLES).map(([key, { name }]) => (
                        <Select.Item key={key} value={key}>
                          {name}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Table.Cell>
                <Table.Cell>
                  <Text 
                    size="2" 
                    color={employee.status === 'invited' ? 'yellow' : 'green'}
                  >
                    {employee.status === 'invited' ? 'Pending' : 'Active'}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  {employee.status === 'invited' && (
                    <Button 
                      variant="soft"
                      onClick={() => setActivateUser(employee)}
                    >
                      Activate
                    </Button>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>

      <InviteDialog 
        open={isInviteOpen} 
        onClose={() => setIsInviteOpen(false)}
        onSubmit={handleInvite}
        loading={loading}
      />

      {activateUser && (
        <ActivateUserDialog
          open={true}
          user={activateUser}
          onClose={() => setActivateUser(null)}
          onSubmit={handleActivateUser}
          loading={loading}
        />
      )}
    </div>
  )
}
