const express = require('express')
const { verifyToken, adminOnly } = require('../controllers/userController')
const {
  viewReviews,
    addReview,
    deleteReview
} = require('../controllers/reviewController')
const imagesUtils = require('../utils/imagesUtils')

const router = express.Router()

router.get('/viewReviews', viewReviews)
router.post(
  '/addReview',
  verifyToken,
  adminOnly,
  imagesUtils.uploadImages('reviews', false).single('files'),
  addReview,
)
router.delete('/deleteReview/:id', verifyToken, adminOnly, deleteReview)

module.exports = router