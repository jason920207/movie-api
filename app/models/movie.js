const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  publishDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Movie', movieSchema)
