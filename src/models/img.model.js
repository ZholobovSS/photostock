const mongoose = require('mongoose')
const fs = require('fs').promises
const path = require('path')
const { addRootDir, appRootDir } = require('../config/const')

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

    return true
  }

  return false
}

// TODO: We shoud remove current removing photo from all users like photo array
imgShema.statics.remove = async function (photoID, userID) {
  const currentImg = await this.findOne({ _id: photoID, user: userID }).exec()
  if (currentImg) {
    const currentUser = await this.model('User').findById(userID)
    currentUser.images = currentUser.images.filter((el) => el.toString() !== photoID)
    currentUser.like = currentUser.like.filter((el) => el.toString() !== photoID)
    await currentUser.save()

    await fs.unlink(path.join(appRootDir, 'public', 'img', currentImg.path))
    await this.deleteOne({ _id: photoID })
    return 'OK'
  }
  return 'BAD USER'
}

module.exports = mongoose.model('Img', imgShema)
