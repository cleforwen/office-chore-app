import { useState, useEffect } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import ChoreModal from './ChoreModal'

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

export default function CalendarView() {
    const [events, setEvents] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [selectedEvent, setSelectedEvent] = useState(null)

    const fetchChores = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/chores')
            if (res.ok) {
                const data = await res.json()
                const mappedEvents = data.map(chore => ({
                    id: chore.id,
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

    const handleSelectSlot = (slotInfo) => {
        setSelectedSlot(slotInfo)
        setSelectedEvent(null)
        setModalOpen(true)
    }

    const handleSelectEvent = (event) => {
        setSelectedEvent(event.resource)
        setSelectedSlot(null)
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
