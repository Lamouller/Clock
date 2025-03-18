import { useState, useEffect } from 'react'
import { Dialog, Button, TextField, Select } from '@radix-ui/themes'
import { supabase } from '../../lib/supabase'
import useThemeStore from '../../stores/themeStore'

export function ShiftModal({ shift, onClose, onSave }) {
  const [employees, setEmployees] = useState([])
  const [formData, setFormData] = useState({
    employee: shift?.employee || '',
    start: shift?.start || '',
    end: shift?.end || '',
  })
  const isDark = useThemeStore((state) => state.isDark)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, team')
      .order('first_name')
    
    setEmployees(data || [])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      id: shift?.id,
      ...formData
    })
  }

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>
          {shift?.id ? 'Edit Shift' : 'Add New Shift'}
        </Dialog.Title>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Select.Root
            value={formData.employee}
            onValueChange={(value) => 
              setFormData({ ...formData, employee: value })
            }
            required
          >
            <Select.Trigger placeholder="Select employee" />
            <Select.Content>
              <Select.Group>
                <Select.Label>Employees</Select.Label>
                {employees.map(employee => (
                  <Select.Item 
                    key={employee.id} 
                    value={employee.id}
                  >
                    {`${employee.first_name} ${employee.last_name} (${employee.team})`}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>

          <div className="grid grid-cols-2 gap-4">
            <TextField.Root>
              <TextField.Input
                type="datetime-local"
                value={formData.start}
                onChange={(e) => 
                  setFormData({ ...formData, start: e.target.value })
                }
                required
              />
            </TextField.Root>

            <TextField.Root>
              <TextField.Input
                type="datetime-local"
                value={formData.end}
                onChange={(e) => 
                  setFormData({ ...formData, end: e.target.value })
                }
                required
              />
            </TextField.Root>
          </div>

          <div className="flex justify-end gap-3">
            <Button 
              variant="soft" 
              color="gray" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              {shift?.id ? 'Update' : 'Create'} Shift
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
