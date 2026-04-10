import { useState } from 'react'
import VotePage from './pages/VotePage'
import RankingsPage from './pages/RankingsPage'

export default function App() {
  const [page, setPage] = useState('vote')

  return (
    <div className="min-h-screen text-g-text">
      <header className="px-24 pt-8 pb-0 flex items-center justify-between">
        <img src="/logo.png" alt="Rank the Gungeon" className="h-[68px] object-contain" style={{ filter: 'drop-shadow(0 0 10px rgba(5,255,255,0.28))' }} />
        <nav className="flex gap-2">
          <button
            onClick={() => setPage('vote')}
            className={`px-6 py-2 rounded text-sm font-medium transition-colors cursor-pointer ${
              page === 'vote'
                ? 'bg-g-orange text-g-bg border border-transparent'
                : 'text-g-muted hover:text-g-text border border-[#695a88] hover:border-g-muted'
            }`}
          >
            Vote
          </button>
          <button
            onClick={() => setPage('rankings')}
            className={`px-6 py-2 rounded text-sm font-medium transition-colors cursor-pointer ${
              page === 'rankings'
                ? 'bg-g-orange text-g-bg border border-transparent'
                : 'text-g-muted hover:text-g-text border border-[#695a88] hover:border-g-muted'
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
