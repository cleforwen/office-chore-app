import { useState, useEffect } from 'react'
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import ChoreModal from './ChoreModal'
import { Chore } from '../types'

const locales = {
    'en-US': enUS,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

interface ChoreEvent extends Event {
    resource: Chore;
}

export default function CalendarView() {
    const [events, setEvents] = useState<ChoreEvent[]>([])
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedSlot, setSelectedSlot] = useState<{ start: Date } | undefined>(undefined)
    const [selectedEvent, setSelectedEvent] = useState<Chore | null | undefined>(undefined)

    const fetchChores = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/chores')
            if (res.ok) {
                const data: Chore[] = await res.json()
                const mappedEvents: ChoreEvent[] = data.map(chore => ({
                    title: `${chore.title} (${chore.assignedTo?.name || 'Unassigned'})`,
                    start: new Date(chore.dueDate),
                    end: new Date(chore.dueDate),
                    allDay: true,
                    resource: chore
                }))
                setEvents(mappedEvents)
            }
        } catch (e) {
            console.error("Failed to fetch chores", e)
        }
    }

    useEffect(() => {
        fetchChores()
    }, [])

    const handleSelectSlot = (slotInfo: { start: Date }) => {
        setSelectedSlot(slotInfo)
        setSelectedEvent(null)
        setModalOpen(true)
    }

    const handleSelectEvent = (event: ChoreEvent) => {
        setSelectedEvent(event.resource)
        setSelectedSlot(undefined)
        setModalOpen(true)
    }

    return (
        <div>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
            />
            {modalOpen && (
                <ChoreModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    refresh={fetchChores}
                    initialDate={selectedSlot?.start}
                    existingChore={selectedEvent}
                />
            )}
        </div>
    )
}
