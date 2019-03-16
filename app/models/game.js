const mongoose = require('mongoose')

const GameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  url: [{
    type: String
  }]
}, {
  timestamps: true
})

module.exports = mongoose.model('Game', GameSchema)
