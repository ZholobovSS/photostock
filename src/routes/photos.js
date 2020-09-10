const express = require('express')
const controller = require('../controllers/photos')
const lib = require('../controllers/lib')

const router = express.Router()

router.post('/upload', lib.isAuthenticated, controller.uploadMulter.single('file'), controller.upload)
router.patch('/star', lib.isAuthenticated, controller.star)
router.delete('/delete', lib.isAuthenticated, controller.deleteImg)

module.exports = router
