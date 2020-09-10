const Img = require('../models/img.model')
const uploadMulter = require('../config/multer')
const User = require('../models/user.model')

const upload = async (req, res) => {
  if (req.file) {
    const img = new Img({
      user: req.user.id,
      description: req.body.description,
      path: req.file.filename,
      raiting: 0,
    })

    await img.save()
    await User.findOneAndUpdate({ _id: req.user.id }, { $push: { images: img.id } })

    return res.json({
      status: 'OK',
      file: {
        id: img._id,
        userID: img.user,
        path: img.path,
        raiting: img.raiting,
        description: img.description,
      },
    })
  }
  return res.json({ status: 'BAD', message: 'Bad file' })
}

const star = async (req, res) => {
  if (req.body.id && req.user.id) {
    const result = await Img.star(req.body.id, req.user.id)
    return result ? res.sendStatus(200) : res.sendStatus(208)
  }

  return res.sendStatus(403)
}

module.exports = {
  uploadMulter,
  upload,
  star,
}
