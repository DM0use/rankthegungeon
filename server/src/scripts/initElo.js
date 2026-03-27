require('dotenv').config({ path: require('path').join(__dirname, '../../.env') })
const mongoose = require('mongoose')
const Item = require('../models/Item')

async function initElo() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  const result = await Item.updateMany(
    { elo: { $exists: false } },
    { $set: { elo: 1000 } }
  )

  console.log(`Updated ${result.modifiedCount} items with default ELO of 1000`)
  console.log(`${result.matchedCount - result.modifiedCount} items already had ELO set`)

  await mongoose.disconnect()
  console.log('Done.')
}

initElo().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
