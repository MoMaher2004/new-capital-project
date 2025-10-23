const express = require('express')
const { verifyToken, adminOnly } = require('../controllers/userController')
const {
  viewCategories,
  addCategory,
  deleteCategory,
  editCategory,
  updateMedia,
} = require('../controllers/categoryController')
const imagesUtils = require('../utils/imagesUtils')

const router = express.Router()

router.get('/viewCategories', viewCategories)
router.post('/addCategory', verifyToken, adminOnly, addCategory)
router.patch('/editCategory', verifyToken, adminOnly, editCategory)
router.delete('/deleteCategory/:id', verifyToken, adminOnly, deleteCategory)

router.patch(
  '/updateMedia',
  verifyToken,
  imagesUtils.uploadImages('categories', true).single('files'),
  adminOnly,
  updateMedia,
)

module.exports = router
