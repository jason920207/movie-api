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
  },
  imdbRating: {
    type: Number,
    required: true,
    default: 0,
    max: 10,
    min: 0
  },
  tag: {
    type: String
  },
  trailer: {
    type: String
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Movie', movieSchema)
