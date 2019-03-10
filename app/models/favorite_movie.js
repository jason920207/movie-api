const mongoose = require('mongoose')

const favoriteMovieSchema = new mongoose.Schema({
  movies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('FavoriteMovie', favoriteMovieSchema)
