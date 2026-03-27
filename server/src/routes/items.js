const router = require('express').Router()
const Item = require('../models/Item')

// GET /api/items/pair — two random items for voting
// Biases toward items with fewer votes for better ELO coverage
router.get('/pair', async (req, res) => {
  try {
    const items = await Item.aggregate([
      { $addFields: { weight: { $divide: [1, { $add: ['$count', 1] }] } } },
      { $sample: { size: 3 } },
    ])
    if (items.length < 2) return res.status(404).json({ error: 'Not enough items' })
    const itemA = items[0]
    const itemB = items[0]._id === items[1]._id ? items[2] : items[1]
    res.json({ itemA, itemB })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/items/rankings — ranked list with optional filters
router.get('/rankings', async (req, res) => {
  try {
    const { itemType, quality, dlc } = req.query
    const filter = {}

    if (itemType) {
      const types = itemType.split(',')
      const conditions = []
      if (types.includes('Gun'))     conditions.push({ itemType: { $nin: ['Active', 'Passive'] } })
      if (types.includes('Active'))  conditions.push({ itemType: 'Active' })
      if (types.includes('Passive')) conditions.push({ itemType: 'Passive' })
      if (conditions.length) filter.$or = conditions
    }
    if (quality)  filter.quality  = { $in: quality.split(',') }
    if (dlc)      filter.dlc      = { $in: dlc.split(',') }

    const limit = Math.min(parseInt(req.query.limit) || 100, 200)
    const skip  = parseInt(req.query.skip) || 0

    const [items, total] = await Promise.all([
      Item.find(filter).sort({ elo: -1 }).skip(skip).limit(limit).lean(),
      Item.countDocuments(filter),
    ])
    res.json({ items, total, skip, limit })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/items/filters — distinct values for each filterable field
router.get('/filters', async (req, res) => {
  try {
    const [itemTypes, qualities, dlcs] = await Promise.all([
      Item.distinct('itemType'),
      Item.distinct('quality'),
      Item.distinct('dlc'),
    ])
    res.json({ itemTypes, qualities, dlcs })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
