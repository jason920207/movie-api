const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  isAdmin: Boolean,
  favorite: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true
    }
  ],
  watchList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true
    }
  ],
  token: String
}, {
  timestamps: true,
  toObject: {
    // remove `hashedPassword` field when we call `.toObject`
    transform: (_doc, user) => {
      delete user.hashedPassword
      return user
    }
  }
})

module.exports = mongoose.model('User', userSchema)
