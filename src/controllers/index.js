const Img = require('../models/img.model')
const User = require('../models/user.model')

const index = async (req, res) => {
  if (req.user) {
    const currentUser = await User.findById(req.user.id)
    let images = await Img.find({}).lean()
    images = images.map((el) => {
      const userLikePhoto = currentUser.like.includes(el._id.toString()) ? 'active' : ''
      return {
        ...el, user: el.user.toString(), id: el._id.toString(), userLikePhoto,
      }
    })

    return res.render('index', { images, user: { name: req.user.name, id: req.user.id } })
  }

  return res.render('index')
}

module.exports = {
  index,
}
