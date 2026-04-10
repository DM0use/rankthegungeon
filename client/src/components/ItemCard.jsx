const QUALITY_ICONS = {
  S:     'https://static.wikia.nocookie.net/enterthegungeon_gamepedia/images/8/8b/1S_Quality_Item.png/revision/latest?cb=20160421180854',
  A:     'https://static.wikia.nocookie.net/enterthegungeon_gamepedia/images/9/9c/A_Quality_Item.png/revision/latest?cb=20160421180848',
  B:     'https://static.wikia.nocookie.net/enterthegungeon_gamepedia/images/f/f3/B_Quality_Item.png/revision/latest?cb=20160421180842',
  C:     'https://static.wikia.nocookie.net/enterthegungeon_gamepedia/images/b/bd/C_Quality_Item.png/revision/latest?cb=20160421180835',
  D:     'https://static.wikia.nocookie.net/enterthegungeon_gamepedia/images/6/60/D_Quality_Item.png/revision/latest?cb=20160421180829',
  'N/A': 'https://static.wikia.nocookie.net/enterthegungeon_gamepedia/images/b/bf/N_Quality_Item.png/revision/latest?cb=20160423013136',
}

const TYPE_COLORS = {
  Gun:     'bg-[#2d1a52] text-[#c4a8ff]',
  Active:  'bg-[#052828] text-[#05ffff]',
  Passive: 'bg-[#1a2d1a] text-[#4dff9a]',
}

export default function ItemCard({ item, onVote, disabled, active, keyHint }) {
  const qualityIcon = QUALITY_ICONS[item.quality] ?? QUALITY_ICONS['N/A']
  const itemType = (item.itemType === 'Active' || item.itemType === 'Passive') ? item.itemType : 'Gun'

  return (
    <button
      onClick={onVote}
      disabled={disabled}
      className={`
        group relative w-full h-full flex flex-col items-center gap-4 p-6 rounded-2xl border-2
        ${active ? 'border-g-orange bg-g-surface-hover' : 'bg-g-surface border-g-border'}
        hover:border-g-orange hover:bg-g-surface-hover hover:shadow-[0_0_24px_rgba(245,166,35,0.15)]
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-150 cursor-pointer
      `}
    >
      {keyHint && (
        <span className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded border border-g-border bg-g-surface text-g-muted text-xs font-bold uppercase">
          {keyHint}
        </span>
      )}

      <div className="w-[85px] h-[85px] flex items-center justify-center">
        <img
          src={item.img}
          alt={item.name}
          className="w-full h-full object-contain"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      <div className="flex gap-2 flex-wrap justify-center items-center">
        <img
          src={qualityIcon}
          alt={item.quality ?? '-'}
          title={item.quality ?? '-'}
          className="w-6 h-6 object-contain"
          style={{ imageRendering: 'pixelated' }}
        />
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${TYPE_COLORS[itemType] ?? 'bg-g-surface text-g-muted'}`}>
          {itemType}
        </span>
        {item.dlc && item.dlc !== 'base' && (
          <span className="text-xs px-2 py-0.5 rounded bg-[#1a1040] text-[#a080ff]">
            DLC
          </span>
        )}
      </div>

      <div className="text-center">
        <p className={`text-lg font-semibold transition-colors ${active ? 'text-g-orange' : 'text-g-text group-hover:text-g-orange'}`}>
          {item.name}
        </p>
        {item.quote && (
          <p className="text-sm text-g-muted italic mt-1">"{item.quote}"</p>
        )}
        {item.effect && (
          <p className="text-sm text-g-muted mt-2 leading-snug line-clamp-2">{item.effect}</p>
        )}
      </div>
    </button>
  )
}
