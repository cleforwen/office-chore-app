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
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Team Members</h2>
                    <p className="text-slate-500 mt-1">Manage who can be assigned to chores.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                <form onSubmit={addMember} className="flex gap-4">
                    <input
                        className="flex-1 border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Enter team member name..."
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm shadow-indigo-200">
                        Add Member
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map(m => (
                    <div key={m.id} className="group bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                {getInitials(m.name)}
                            </div>
                            <span className="font-medium text-slate-700">{m.name}</span>
                        </div>
                        <button
                            onClick={() => removeMember(m.id)}
                            className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove Member"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                ))}
                {members.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                        No team members yet. Add someone above!
                    </div>
                )}
            </div>
        </div>
    )
}
