const router = require('express').Router()
const mongoose = require('mongoose')
const Item = require('../models/Item')
const VoteMatch = require('../models/VoteMatch')
const { computeElo } = require('../lib/elo')

// POST /api/vote
// Body: { winnerId, loserId }
router.post('/', async (req, res) => {
  const { winnerId, loserId } = req.body
  if (!winnerId || !loserId) {
    return res.status(400).json({ error: 'winnerId and loserId are required' })
  }
  if (!mongoose.Types.ObjectId.isValid(winnerId) || !mongoose.Types.ObjectId.isValid(loserId)) {
    return res.status(400).json({ error: 'Invalid item ID' })
  }

  try {
    const [winner, loser] = await Promise.all([
      Item.findById(winnerId),
      Item.findById(loserId),
    ])

    if (!winner || !loser) {
      return res.status(404).json({ error: 'Item not found' })
    }

    const { newWinnerElo, newLoserElo } = computeElo(
      winner.elo ?? 1000,
      loser.elo  ?? 1000,
      winner.count,
      loser.count,
    )

    await Promise.all([
      Item.findByIdAndUpdate(winnerId, {
        $inc: { votes: 1, count: 1 },
        $set: { elo: newWinnerElo },
      }),
      Item.findByIdAndUpdate(loserId, {
        $inc: { count: 1 },
        $set: { elo: newLoserElo },
      }),
      VoteMatch.create({
        winnerId,
        loserId,
        winnerEloBefore: winner.elo ?? 1000,
        loserEloBefore:  loser.elo  ?? 1000,
        winnerEloAfter:  newWinnerElo,
        loserEloAfter:   newLoserElo,
      }),
    ])

    // Return a fresh pair — sample 3 to guarantee two distinct items
    let nextItems = await Item.aggregate([{ $sample: { size: 3 } }])
    if (nextItems[0]._id === nextItems[1]._id) nextItems = [nextItems[0], nextItems[2]]

    res.json({
      winner: { id: winnerId, newElo: newWinnerElo },
      loser:  { id: loserId,  newElo: newLoserElo },
      nextPair: { itemA: nextItems[0], itemB: nextItems[1] },
    })
  } catch (err) {
    console.error('Vote error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
