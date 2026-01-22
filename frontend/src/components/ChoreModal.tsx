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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all ring-1 ring-black/5 dark:ring-white/10">
                <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-between items-center">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                        {existingChore ? 'Edit Chore' : 'New Chore'}
                    </h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">Chore Title</label>
                        <input
                            className="w-full border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 dark:text-white rounded-lg shadow-sm focus:border-zinc-500 focus:ring-zinc-500 text-sm active:bg-white dark:active:bg-zinc-800 transition-colors"
                            placeholder="e.g. Empty Dishwasher"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">Assign To</label>
                            <select
                                className="w-full border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 dark:text-white rounded-lg shadow-sm focus:border-zinc-500 focus:ring-zinc-500 text-sm"
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
                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">Due Date</label>
                            <input
                                type="date"
                                className="w-full border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 dark:text-white rounded-lg shadow-sm focus:border-zinc-500 focus:ring-zinc-500 text-sm"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center space-x-2.5">
                            <input
                                type="checkbox"
                                id="recurring"
                                className="rounded border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 focus:ring-zinc-500 w-4 h-4"
                                checked={isRecurring}
                                onChange={e => setIsRecurring(e.target.checked)}
                            />
                            <label htmlFor="recurring" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Repeat this chore?</label>
                        </div>

                        {isRecurring && (
                            <div className="mt-3 pl-6">
                                <select
                                    className="w-full border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 dark:text-white rounded-lg shadow-sm focus:border-zinc-500 focus:ring-zinc-500 text-sm py-1.5"
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

                    <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 mt-2">
                        {existingChore && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="px-4 py-2 text-xs font-bold text-red-600 hover:text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors mr-auto"
                            >
                                DELETE
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-lg transition-colors shadow-sm"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 text-xs font-bold text-white dark:text-zinc-900 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-lg shadow-lg shadow-zinc-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                        >
                            {isLoading ? 'SAVING...' : 'SAVE CHORE'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
