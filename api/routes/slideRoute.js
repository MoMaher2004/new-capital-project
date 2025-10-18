const express = require('express')
const { verifyToken, adminOnly } = require('../controllers/userController')
const {
  viewSlides,
    addSlide,
    deleteSlide
} = require('../controllers/slideController')
const imagesUtils = require('../utils/imagesUtils')

const router = express.Router()

router.get('/viewSlides', viewSlides)
router.post(
  '/addSlide',
  verifyToken,
  adminOnly,
  imagesUtils.uploadImages('slides', false).single('files'),
  addSlide,
)
router.delete('/deleteSlide/:id', verifyToken, adminOnly, deleteSlide)

module.exports = router