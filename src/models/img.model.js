const mongoose = require('mongoose')

const imgShema = mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
  description: String,
  path: String,
  raiting: Number,
})

imgShema.statics.star = async function (photoID, userID) {
  const currentImg = await this.findById(photoID).exec()
  const currentUser = await this.model('User').findById(userID)
  const canUserLikePhoto = !currentUser.like.includes(photoID)

  if (canUserLikePhoto) {
    currentImg.raiting++
    await currentImg.save()
    currentUser.like.push(photoID)
    await currentUser.save()

    console.log(currentUser, currentImg)
    return true
  }

  console.log(currentUser, currentImg)
  return false
}

module.exports = mongoose.model('Img', imgShema)
