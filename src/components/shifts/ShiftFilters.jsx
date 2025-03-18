import { Select, TextField } from '@radix-ui/themes'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export function ShiftFilters({ filters, onFiltersChange }) {
  const [teams, setTeams] = useState([])
  const [employees, setEmployees] = useState([])
  const [locations, setLocations] = useState([])

  useEffect(() => {
    fetchFilterOptions()
  }, [])

  const fetchFilterOptions = async () => {
    // Fetch unique teams
    const { data: teamData } = await supabase
      .from('profiles')
      .select('team')
      .not('team', 'is', null)
    
    // Fetch employees
    const { data: employeeData } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .order('first_name')
    
    // Fetch locations
    const { data: locationData } = await supabase
      .from('profiles')
      .select('location')
      .not('location', 'is', null)

    setTeams([...new Set(teamData?.map(t => t.team) || [])])
    setEmployees(employeeData || [])
    setLocations([...new Set(locationData?.map(l => l.location) || [])])
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select.Root
          value={filters.teams}
          onValueChange={(value) => 
            onFiltersChange({ ...filters, teams: value ? [value] : [] })
          }
        >
          <Select.Trigger placeholder="Filter by team" />
          <Select.Content>
            <Select.Group>
              <Select.Label>Teams</Select.Label>
              {teams.map(team => (
                <Select.Item key={team} value={team}>
                  {team}
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>

        <Select.Root
          value={filters.employees}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, employees: value ? [value] : [] })
          }
        >
          <Select.Trigger placeholder="Filter by employee" />
          <Select.Content>
            <Select.Group>
              <Select.Label>Employees</Select.Label>
              {employees.map(employee => (
                <Select.Item 
                  key={employee.id} 
                  value={employee.id}
                >
                  {`${employee.first_name} ${employee.last_name}`}
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>

        <Select.Root
          value={filters.locations}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, locations: value ? [value] : [] })
          }
        >
          <Select.Trigger placeholder="Filter by location" />
          <Select.Content>
            <Select.Group>
              <Select.Label>Locations</Select.Label>
              {locations.map(location => (
                <Select.Item key={location} value={location}>
                  {location}
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
    </div>
  )
}
