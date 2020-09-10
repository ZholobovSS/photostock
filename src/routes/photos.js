const express = require('express')
const controller = require('../controllers/photos')
const lib = require('../controllers/lib')

const router = express.Router()

router.post('/upload', lib.isAuthenticated, controller.uploadMulter.single('file'), controller.upload)
router.post('/star', controller.star)

module.exports = router
