const mongoose = require('mongoose')

const voteMatchSchema = new mongoose.Schema({
  winnerId: { type: Number, ref: 'Item', required: true },
  loserId:  { type: Number, ref: 'Item', required: true },
  winnerEloBefore: Number,
  loserEloBefore:  Number,
  winnerEloAfter:  Number,
  loserEloAfter:   Number,
  votedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('VoteMatch', voteMatchSchema)
