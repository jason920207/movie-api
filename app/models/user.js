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
  token: String,
  favorite: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  avatar: {
    type: String,
    default: 'https://react.semantic-ui.com/images/avatar/small/matt.jpg'
  }
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
