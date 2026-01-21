import { useState } from 'react'
import CalendarView from './components/CalendarView'
import TeamManager from './components/TeamManager'

function App() {
  const [view, setView] = useState('calendar')

  const NavButton = ({ id, label }) => (
    <button
      onClick={() => setView(id)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${view === id
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
          : 'text-slate-600 hover:bg-slate-100'
        }`}
    >
      {label}
    </button>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {view === 'calendar' ? <CalendarView /> : <TeamManager />}
        </div>
      </main>
    </div>
  )
}

export default App
