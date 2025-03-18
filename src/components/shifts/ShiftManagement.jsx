import { useState, useEffect } from 'react'
import { Card, Button, TextField, Select } from '@radix-ui/themes'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { ShiftFilters } from './ShiftFilters'
import { ShiftModal } from './ShiftModal'
import { supabase } from '../../lib/supabase'
import useThemeStore from '../../stores/themeStore'

export function ShiftManagement() {
  const [shifts, setShifts] = useState([])
  const [selectedShift, setSelectedShift] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    teams: [],
    employees: [],
    locations: []
  })
  const isDark = useThemeStore((state) => state.isDark)

  useEffect(() => {
    fetchShifts()
  }, [filters])

  const fetchShifts = async () => {
    let query = supabase
      .from('shifts')
      .select(`
        *,
        profiles:user_id (
          first_name,
          last_name,
          team,
          location
        )
      `)

    if (filters.teams.length > 0) {
      query = query.in('profiles.team', filters.teams)
    }
    if (filters.employees.length > 0) {
      query = query.in('user_id', filters.employees)
    }
    if (filters.locations.length > 0) {
      query = query.in('profiles.location', filters.locations)
    }

    const { data, error } = await query

    if (!error && data) {
      setShifts(data.map(shift => ({
        id: shift.id,
        title: `${shift.profiles.first_name} ${shift.profiles.last_name}`,
        start: shift.start_time,
        end: shift.end_time,
        backgroundColor: getTeamColor(shift.profiles.team),
        extendedProps: {
          team: shift.profiles.team,
          location: shift.profiles.location,
          employee: shift.user_id
        }
      })))
    }
  }

  const getTeamColor = (team) => {
    const colors = {
      'Kitchen': '#2563eb',
      'Service': '#16a34a',
      'Bar': '#dc2626',
      'Management': '#7c3aed'
    }
    return colors[team] || '#6b7280'
  }

  const handleDateSelect = (selectInfo) => {
    setSelectedShift({
      start: selectInfo.startStr,
      end: selectInfo.endStr
    })
    setIsModalOpen(true)
  }

  const handleEventClick = (clickInfo) => {
    setSelectedShift({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      ...clickInfo.event.extendedProps
    })
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Shift Management</h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>
            Manage team schedules and shifts
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          Add Shift
        </Button>
      </div>

      <Card className="p-4">
        <ShiftFilters 
          filters={filters}
          onFiltersChange={setFilters}
        />
      </Card>

      <Card className={`p-4 ${isDark ? 'fc-theme-dark' : ''}`}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={shifts}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="auto"
          allDaySlot={false}
          slotMinTime="06:00:00"
          slotMaxTime="24:00:00"
        />
      </Card>

      {isModalOpen && (
        <ShiftModal
          shift={selectedShift}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedShift(null)
          }}
          onSave={async (shiftData) => {
            if (shiftData.id) {
              // Update existing shift
              await supabase
                .from('shifts')
                .update({
                  user_id: shiftData.employee,
                  start_time: shiftData.start,
                  end_time: shiftData.end,
                })
                .eq('id', shiftData.id)
            } else {
              // Create new shift
              await supabase
                .from('shifts')
                .insert([{
                  user_id: shiftData.employee,
                  start_time: shiftData.start,
                  end_time: shiftData.end,
                }])
            }
            fetchShifts()
            setIsModalOpen(false)
            setSelectedShift(null)
          }}
        />
      )}
    </div>
  )
}
