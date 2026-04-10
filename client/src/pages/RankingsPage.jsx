import { useState, useEffect, useRef, useCallback } from 'react'
import { apiUrl } from '../api'

const QUALITY_ORDER = ['S', 'A', 'B', 'C', 'D', 'N/A']
const DLC_ORDER = ['base', 'sd', 'agng', 'fta']

const DLC_LABELS = {
  base: 'Original',
  fta: 'A Farewell To Arms',
  agng: 'Advanced Gungeons & Draguns',
  sd:   'Supply Drop',
}

const QUALITY_ICONS = {
  S:     '/quality/S.png',
  A:     '/quality/A.png',
  B:     '/quality/B.png',
  C:     '/quality/C.png',
  D:     '/quality/D.png',
  'N/A': '/quality/NA.png',
}

function QualityIcon({ quality, size = 6 }) {
  const src = QUALITY_ICONS[quality] ?? QUALITY_ICONS['N/A']
  return (
    <img
      src={src}
      alt={quality ?? '-'}
      title={quality ?? '-'}
      className={`w-${size} h-${size} object-contain`}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}

function FilterGroup({ label, options, selected, onChange, labelMap = {}, iconMap = {} }) {
  function toggle(value) {
    onChange(
      selected.includes(value)
        ? selected.filter(v => v !== value)
        : [...selected, value]
    )
  }

  function toggleAll() {
    onChange(selected.length === options.length ? [] : [...options])
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-g-muted uppercase tracking-wider">{label}</span>
        <button onClick={toggleAll} className="text-xs text-g-orange hover:underline cursor-pointer">
          {selected.length === options.length ? 'None' : 'All'}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.filter(Boolean).map(opt => (
          <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
              className="accent-[#F5A623]"
            />
            {iconMap[opt]
              ? <img src={iconMap[opt]} alt={opt} title={opt} className="w-5 h-5 object-contain" style={{ imageRendering: 'pixelated' }} />
              : <span className="text-sm text-g-text">{labelMap[opt] ?? opt}</span>
            }
          </label>
        ))}
      </div>
    </div>
  )
}

const PAGE_SIZE = 100

export default function RankingsPage() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState(null)
  const [selected, setSelected] = useState({
    itemType: [],
    quality: [],
    dlc: [],
  })
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const sentinelRef = useRef(null)
  const skipRef = useRef(0)

  function buildParams(skip = 0) {
    const params = new URLSearchParams()
    if (selected.itemType.length) params.set('itemType', selected.itemType.join(','))
    if (selected.quality.length)  params.set('quality',  selected.quality.join(','))
    if (selected.dlc.length)      params.set('dlc',      selected.dlc.join(','))
    params.set('limit', PAGE_SIZE)
    params.set('skip', skip)
    return params
  }

  useEffect(() => {
    fetch(apiUrl('/api/items/filters'))
      .then(r => r.json())
      .then(data => {
        setFilters(data)
        setSelected({
          itemType: ['Gun', 'Active', 'Passive'],
          quality:  [...(data.qualities ?? [])],
          dlc:      [...(data.dlcs ?? [])],
        })
      })
  }, [])

  // Reset and fetch first page when filters change
  useEffect(() => {
    if (!filters) return
    setLoading(true)
    setItems([])
    skipRef.current = 0

    fetch(apiUrl(`/api/items/rankings?${buildParams(0)}`))
      .then(r => r.json())
      .then(data => {
        setItems(data.items)
        setTotal(data.total)
        skipRef.current = data.items.length
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [selected, filters])

  // Load next page
  const loadMore = useCallback(() => {
    if (loadingMore || loading) return
    setLoadingMore(true)

    fetch(apiUrl(`/api/items/rankings?${buildParams(skipRef.current)}`))
      .then(r => r.json())
      .then(data => {
        setItems(prev => [...prev, ...data.items])
        skipRef.current += data.items.length
        setLoadingMore(false)
      })
      .catch(() => setLoadingMore(false))
  }, [loadingMore, loading, selected])

  // IntersectionObserver watches the sentinel element at the bottom of the list
  useEffect(() => {
    if (!sentinelRef.current) return
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore() },
      { rootMargin: '200px' }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [loadMore])

  return (
    <div className="flex flex-col gap-6">
{/* Filters */}
      {filters && (
        <div className="bg-g-surface border border-g-border rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <FilterGroup
            label="Type"
            options={['Gun', 'Active', 'Passive']}
            selected={selected.itemType}
            onChange={v => setSelected(s => ({ ...s, itemType: v }))}
          />
          <FilterGroup
            label="Quality"
            options={(filters.qualities ?? []).slice().sort((a, b) => QUALITY_ORDER.indexOf(a) - QUALITY_ORDER.indexOf(b))}
            selected={selected.quality}
            onChange={v => setSelected(s => ({ ...s, quality: v }))}
            iconMap={QUALITY_ICONS}
          />
          <FilterGroup
            label="DLC"
            options={(filters.dlcs ?? []).slice().sort((a, b) => DLC_ORDER.indexOf(a) - DLC_ORDER.indexOf(b))}
            selected={selected.dlc}
            onChange={v => setSelected(s => ({ ...s, dlc: v }))}
            labelMap={DLC_LABELS}
          />
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-g-muted animate-pulse">Loading rankings...</div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-g-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-g-surface text-g-muted text-left">
                <th className="px-4 py-3 w-12">#</th>
                <th className="px-4 py-3 w-12"></th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Quality</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">DLC</th>
                <th className="px-4 py-3 text-right">ELO</th>
                <th className="px-4 py-3 text-right">Votes</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr
                  key={item._id}
                  className="border-t border-g-border hover:bg-g-surface transition-colors"
                >
                  <td className="px-4 py-3 text-g-dim font-mono">{i + 1}</td>
                  <td className="px-4 py-3">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-8 h-8 object-contain"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-g-text">{item.name}</td>
                  <td className="px-4 py-3">
                    <QualityIcon quality={item.quality} size={6} />
                  </td>
                  <td className="px-4 py-3 text-g-muted">
                    {(item.itemType === 'Active' || item.itemType === 'Passive') ? item.itemType : 'Gun'}
                  </td>
                  <td className="px-4 py-3 text-g-muted">{DLC_LABELS[item.dlc] ?? item.dlc}</td>
                  <td className="px-4 py-3 text-right font-mono text-g-orange">
                    {item.elo != null ? Math.round(item.elo) : 1000}
                  </td>
                  <td className="px-4 py-3 text-right text-g-muted">{item.count ?? 0}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-g-muted">
                    No items match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Sentinel — triggers loadMore when scrolled into view */}
      {!loading && items.length < total && (
        <div ref={sentinelRef} className="py-4 text-center text-g-muted text-sm">
          {loadingMore ? 'Loading more...' : ''}
        </div>
      )}

      {!loading && items.length > 0 && items.length >= total && (
        <p className="text-center text-g-dim text-sm pb-4">
          Showing all {total} items
        </p>
      )}
    </div>
  )
}
