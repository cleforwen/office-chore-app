import { useState, useEffect, FormEvent } from 'react'
import { TeamMember } from '../types'

export default function TeamManager() {
    const [members, setMembers] = useState<TeamMember[]>([])
    const [name, setName] = useState('')

    const fetchMembers = () => {
        fetch('http://localhost:8080/api/members')
            .then(res => res.json())
            .then(setMembers)
            .catch(console.error)
    }

    useEffect(() => {
        fetchMembers()
    }, [])

    const addMember = async (e: FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return
        await fetch('http://localhost:8080/api/members', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        })
        setName('')
        fetchMembers()
    }

    const removeMember = async (id: number) => {
        if (!confirm("Remove this member? This cannot be undone.")) return
        await fetch(`http://localhost:8080/api/members/${id}`, { method: 'DELETE' })
        fetchMembers()
    }

    const getInitials = (n: string) => n.split(' ').map(i => i[0]).join('').substring(0, 2).toUpperCase()

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-zinc-800 tracking-tight">Team Members</h2>
                    <p className="text-zinc-500 mt-1 text-sm">Manage who can be assigned to chores.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg shadow-zinc-200/50 border border-zinc-100 p-5 mb-8">
                <form onSubmit={addMember} className="flex gap-3">
                    <input
                        className="flex-1 border-zinc-200 bg-zinc-50 rounded-lg shadow-sm focus:border-zinc-500 focus:ring-zinc-500 text-sm transition-all"
                        placeholder="Enter team member name..."
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <button type="submit" className="bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg shadow-zinc-200 active:scale-95">
                        Add Member
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map(m => (
                    <div key={m.id} className="group bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-zinc-100 transition-all duration-300 flex items-center justify-between hover:-translate-y-0.5">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-700 flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                                {getInitials(m.name)}
                            </div>
                            <span className="font-medium text-zinc-700 text-sm">{m.name}</span>
                        </div>
                        <button
                            onClick={() => removeMember(m.id)}
                            className="text-zinc-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 scale-90 hover:scale-100"
                            title="Remove Member"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                ))}
                {members.length === 0 && (
                    <div className="col-span-full py-10 text-center text-zinc-400 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 text-sm">
                        No team members yet. Add someone above!
                    </div>
                )}
            </div>
        </div>
    )
}
