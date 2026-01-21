import { useState, useEffect, FormEvent } from 'react'
import { Chore, TeamMember } from '../types'

interface ChoreModalProps {
    isOpen: boolean;
    onClose: () => void;
    refresh: () => void;
    initialDate?: Date | undefined;
    existingChore?: Chore | null | undefined;
}

export default function ChoreModal({ isOpen, onClose, refresh, initialDate, existingChore }: ChoreModalProps) {
    const [title, setTitle] = useState('')
    const [memberId, setMemberId] = useState('')
    const [date, setDate] = useState('')
    const [members, setMembers] = useState<TeamMember[]>([])
    const [isRecurring, setIsRecurring] = useState(false)
    const [recurrence, setRecurrence] = useState('WEEKLY')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetch('http://localhost:8080/api/members')
            .then(res => res.json())
            .then(data => setMembers(data))
            .catch(e => console.error(e))

        if (existingChore) {
            setTitle(existingChore.title)
            // Handle null/undefined assignedTo safely
            setMemberId(existingChore.assignedTo ? existingChore.assignedTo.id.toString() : '')
            setDate(existingChore.dueDate)
            setIsRecurring(existingChore.isRecurring)
            setRecurrence(existingChore.recurrenceFrequency || 'WEEKLY')
        } else if (initialDate) {
            setDate(initialDate.toISOString().split('T')[0])
        }
    }, [existingChore, initialDate])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const payload = {
            title,
            dueDate: date,
            isRecurring,
            recurrenceFrequency: isRecurring ? recurrence : null,
            assignedTo: memberId ? { id: parseInt(memberId) } : null
        }

        const url = existingChore
            ? `http://localhost:8080/api/chores/${existingChore.id}`
            : 'http://localhost:8080/api/chores'

        const method = existingChore ? 'PUT' : 'POST'

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            if (!res.ok) throw new Error('Failed to save')
            refresh()
            onClose()
        } catch (e) {
            console.error(e)
            alert("Error saving chore. Please check backend logs.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!existingChore) return
        if (!confirm("Delete this chore?")) return
        setIsLoading(true)
        await fetch(`http://localhost:8080/api/chores/${existingChore.id}`, { method: 'DELETE' })
        setIsLoading(false)
        refresh()
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-900">
                        {existingChore ? 'Edit Chore' : 'New Chore'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-500">
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Chore Title</label>
                        <input
                            className="w-full border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="e.g. Empty Dishwasher"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Assign To</label>
                            <select
                                className="w-full border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={memberId}
                                onChange={e => setMemberId(e.target.value)}
                            >
                                <option value="">Unassigned</option>
                                {members.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                            <input
                                type="date"
                                className="w-full border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="recurring"
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                checked={isRecurring}
                                onChange={e => setIsRecurring(e.target.checked)}
                            />
                            <label htmlFor="recurring" className="text-sm font-medium text-slate-700">Repeat this chore?</label>
                        </div>

                        {isRecurring && (
                            <div className="mt-3 pl-6">
                                <select
                                    className="w-full border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                    value={recurrence}
                                    onChange={e => setRecurrence(e.target.value)}
                                >
                                    <option value="DAILY">Every Day</option>
                                    <option value="WEEKLY">Every Week</option>
                                    <option value="MONTHLY">Every Month</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        {existingChore && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors mr-auto"
                            >
                                Delete
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : 'Save Chore'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
