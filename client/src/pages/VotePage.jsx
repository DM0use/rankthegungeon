import { useState, useEffect, useCallback } from 'react'
import ItemCard from '../components/ItemCard'

export default function VotePage() {
  const [pair, setPair] = useState(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [error, setError] = useState(null)
  const [lastResult, setLastResult] = useState(null)

  const fetchPair = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/items/pair')
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

  async function handleVote(winnerId, loserId) {
    setVoting(true)
    try {
      const res = await fetch('/api/vote', {
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
        <div className="text-gray-400 animate-pulse">Loading matchup...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 h-64 justify-center">
        <p className="text-red-400">{error}</p>
        <button onClick={fetchPair} className="px-4 py-2 bg-yellow-400 text-gray-950 rounded font-medium">
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-100">Which is better?</h2>
        <p className="text-gray-400 text-sm mt-1">Click an item to vote for it</p>
      </div>

      {lastResult && (
        <p className="text-sm text-green-400">
          Vote recorded! ELO updated.
        </p>
      )}

      <div className="flex flex-col md:flex-row items-stretch gap-4 w-full max-w-3xl">
        {pair && (
          <>
            <div className="flex-1">
              <ItemCard
                item={pair.itemA}
                onVote={() => handleVote(pair.itemA._id, pair.itemB._id)}
                disabled={voting}
              />
            </div>
            <div className="flex items-center justify-center text-gray-600 text-3xl font-bold py-2 md:py-0">
              VS
            </div>
            <div className="flex-1">
              <ItemCard
                item={pair.itemB}
                onVote={() => handleVote(pair.itemB._id, pair.itemA._id)}
                disabled={voting}
              />
            </div>
          </>
        )}
      </div>

      <button
        onClick={() => { setLastResult(null); fetchPair() }}
        disabled={voting}
        className="text-sm text-gray-500 hover:text-gray-300 transition-colors underline"
      >
        Skip this matchup
      </button>
    </div>
  )
}
