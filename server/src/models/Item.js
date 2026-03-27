const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  _id: Number,
  img: String,
  name: { type: String, required: true },
  itemType: String,   // "Passive", "Active", "Gun"
  quote: String,      // flavor text
  quality: String,    // S, A, B, C, D, N/A
  effect: String,     // description
  dlc: String,        // "base", etc.
  type: String,       // "item", "gun"
  votes: { type: Number, default: 0 },
  count: { type: Number, default: 0 },
  elo: { type: Number, default: 1000 },
})

module.exports = mongoose.model('Item', itemSchema)
