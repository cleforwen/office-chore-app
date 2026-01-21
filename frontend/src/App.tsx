import { useState } from 'react'
import CalendarView from './components/CalendarView'
import TeamManager from './components/TeamManager'

export default function App() {
  const [view, setView] = useState('calendar')

  interface NavButtonProps {
    id: string;
    label: string;
  }

  const NavButton = ({ id, label }: NavButtonProps) => (
    <button
      onClick={() => setView(id)}
      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${view === id
        ? 'bg-zinc-800 text-white shadow-lg shadow-zinc-200 ring-1 ring-black/5 transform scale-105'
        : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
        }`}
    >
      {label}
    </button>
  )

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-zinc-200/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="bg-zinc-900 p-1.5 rounded-lg shadow-md">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-zinc-800 tracking-tight">
                ChoreMaster
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <NavButton id="calendar" label="Calendar" />
              <NavButton id="team" label="Team" />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-fade-in">
          {view === 'calendar' ? <CalendarView /> : <TeamManager />}
        </div>
      </main>
    </div>
  )
}
