const multer = require('multer')
const path = require('path')

const appDir = path.dirname(require.main.filename)

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(appDir, 'public', 'img'))
  },
  filename(req, file, cb) {
    cb(null, `img-${Date.now()}${path.extname(file.originalname)}`)
  },
})

const uploadMulter = multer({
  storage,
  fileFilter(req, file, cb) {
    const filetypes = /jpeg|jpg|png|svg/
    const mimetype = filetypes.test(file.mimetype)
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    if (mimetype && extname) {
      return cb(null, true)
    }
    return cb(null, false)
  },
})

module.exports = uploadMulter
