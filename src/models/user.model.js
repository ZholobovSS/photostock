const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  googleId: String,
  name: String,
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Img' }],
  like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Img' }],
})

module.exports = mongoose.model('User', userSchema)
