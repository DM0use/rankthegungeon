import { useState } from 'react'
import VotePage from './pages/VotePage'
import RankingsPage from './pages/RankingsPage'

export default function App() {
  const [page, setPage] = useState('vote')

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-yellow-400">
          Rank the Gungeon
        </h1>
        <nav className="flex gap-2">
          <button
            onClick={() => setPage('vote')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              page === 'vote'
                ? 'bg-yellow-400 text-gray-950'
                : 'text-gray-400 hover:text-gray-100'
            }`}
          >
            Vote
          </button>
          <button
            onClick={() => setPage('rankings')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              page === 'rankings'
                ? 'bg-yellow-400 text-gray-950'
                : 'text-gray-400 hover:text-gray-100'
            }`}
          >
            Rankings
          </button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {page === 'vote'     && <VotePage />}
        {page === 'rankings' && <RankingsPage />}
      </main>
    </div>
  )
}
