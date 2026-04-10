import { useState, useEffect, useCallback } from 'react'
import ItemCard from '../components/ItemCard'
import { apiUrl } from '../api'

export default function VotePage() {
  const [pair, setPair] = useState(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [error, setError] = useState(null)
  const [lastResult, setLastResult] = useState(null)
  const [activeCard, setActiveCard] = useState(null)

  const fetchPair = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(apiUrl('/api/items/pair'))
      if (!res.ok) throw new Error('Failed to fetch pair')
      const data = await res.json()
      setPair(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPair() }, [fetchPair])

  useEffect(() => {
    function handleKey(e) {
      if (voting || !pair) return
      if (e.key === 'j') {
        setActiveCard('left')
        setTimeout(() => { setActiveCard(null); handleVote(pair.itemA._id, pair.itemB._id) }, 150)
      }
      if (e.key === 'l') {
        setActiveCard('right')
        setTimeout(() => { setActiveCard(null); handleVote(pair.itemB._id, pair.itemA._id) }, 150)
      }
      if (e.key === ' ') { e.preventDefault(); setLastResult(null); fetchPair() }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [voting, pair, fetchPair])

  async function handleVote(winnerId, loserId) {
    setVoting(true)
    try {
      const res = await fetch(apiUrl('/api/vote'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winnerId, loserId }),
      })
      if (!res.ok) throw new Error('Vote failed')
      const data = await res.json()
      setLastResult(data)
      setPair(data.nextPair)
    } catch (err) {
      setError(err.message)
    } finally {
      setVoting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-g-muted animate-pulse">Loading matchup...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 h-64 justify-center">
        <p className="text-red-400">{error}</p>
        <button onClick={fetchPair} className="px-4 py-2 bg-g-orange text-g-bg rounded font-medium cursor-pointer">
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 md:gap-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-g-text">Which is better?</h2>
        <p className="hidden md:block text-g-muted text-sm mt-1">Click an item to vote for it</p>
      </div>

      <div className="flex flex-col md:flex-row items-stretch gap-2 md:gap-4 w-full max-w-3xl">
        {pair && (
          <>
            <div className="flex-1">
              <ItemCard
                item={pair.itemA}
                onVote={() => handleVote(pair.itemA._id, pair.itemB._id)}
                disabled={voting}
                active={activeCard === 'left'}
                keyHint="J"
              />
            </div>
            <div className="flex items-center justify-center text-g-cyan text-3xl font-bold py-2 md:py-0" style={{ textShadow: '0 0 18px rgba(5,255,255,0.4)' }}>
              VS
            </div>
            <div className="flex-1">
              <ItemCard
                item={pair.itemB}
                onVote={() => handleVote(pair.itemB._id, pair.itemA._id)}
                disabled={voting}
                active={activeCard === 'right'}
                keyHint="L"
              />
            </div>
          </>
        )}
      </div>

      <button
        onClick={() => { setLastResult(null); fetchPair() }}
        disabled={voting}
        className="relative w-full max-w-3xl py-3 rounded-2xl border-2 bg-g-surface border-g-border hover:border-g-orange hover:bg-g-surface-hover hover:shadow-[0_0_24px_rgba(245,166,35,0.15)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer text-sm font-medium text-g-muted hover:text-g-text"
      >
        <span className="absolute top-1/2 -translate-y-1/2 right-3 px-2 h-6 hidden md:flex items-center justify-center rounded border border-g-border bg-g-bg text-g-muted text-xs font-bold">
          ⎵
        </span>
        Skip this matchup
      </button>

      <p className="text-sm text-g-cyan h-5">
        {lastResult ? 'Vote recorded! ELO updated.' : ''}
      </p>
    </div>
  )
}
