const QUALITY_ICONS = {
  S:     'https://static.wikia.nocookie.net/enterthegungeon_gamepedia/images/8/8b/1S_Quality_Item.png/revision/latest?cb=20160421180854',
  A:     'https://static.wikia.nocookie.net/enterthegungeon_gamepedia/images/9/9c/A_Quality_Item.png/revision/latest?cb=20160421180848',
  B:     'https://static.wikia.nocookie.net/enterthegungeon_gamepedia/images/f/f3/B_Quality_Item.png/revision/latest?cb=20160421180842',
  C:     'https://static.wikia.nocookie.net/enterthegungeon_gamepedia/images/b/bd/C_Quality_Item.png/revision/latest?cb=20160421180835',
  D:     'https://static.wikia.nocookie.net/enterthegungeon_gamepedia/images/6/60/D_Quality_Item.png/revision/latest?cb=20160421180829',
  'N/A': 'https://static.wikia.nocookie.net/enterthegungeon_gamepedia/images/b/bf/N_Quality_Item.png/revision/latest?cb=20160423013136',
}

const TYPE_COLORS = {
  Gun:     'bg-purple-700 text-purple-100',
  Active:  'bg-blue-700 text-blue-100',
  Passive: 'bg-teal-700 text-teal-100',
}

export default function ItemCard({ item, onVote, disabled }) {
  const qualityIcon = QUALITY_ICONS[item.quality] ?? QUALITY_ICONS['N/A']
  const itemType = (item.itemType === 'Active' || item.itemType === 'Passive') ? item.itemType : 'Gun'

  return (
    <button
      onClick={onVote}
      disabled={disabled}
      className={`
        group w-full flex flex-col items-center gap-4 p-6 rounded-2xl border-2
        bg-gray-900 border-gray-700
        hover:border-yellow-400 hover:bg-gray-800
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-150 cursor-pointer
      `}
    >
      <div className="w-32 h-32 flex items-center justify-center">
        <img
          src={item.img}
          alt={item.name}
          className="max-w-full max-h-full object-contain"
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
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${TYPE_COLORS[itemType] ?? 'bg-gray-700 text-gray-300'}`}>
          {itemType}
        </span>
        {item.dlc && item.dlc !== 'base' && (
          <span className="text-xs px-2 py-0.5 rounded bg-indigo-800 text-indigo-200">
            DLC
          </span>
        )}
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-gray-100 group-hover:text-yellow-400 transition-colors">
          {item.name}
        </p>
        {item.quote && (
          <p className="text-sm text-gray-400 italic mt-1">"{item.quote}"</p>
        )}
        {item.effect && (
          <p className="text-sm text-gray-300 mt-2 leading-snug">{item.effect}</p>
        )}
      </div>
    </button>
  )
}
