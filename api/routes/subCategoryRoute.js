const express = require('express')
const { verifyToken, adminOnly } = require('../controllers/userController')
const { viewSubCategories, addSubCategory, deleteSubCategory, editSubCategory, updateMedia } = require('../controllers/subCategoryController')
const imagesUtils = require('../utils/imagesUtils')

const router = express.Router()

router.get('/viewSubCategories', viewSubCategories)
router.post('/addSubCategory', verifyToken, adminOnly, addSubCategory)
router.patch('/editSubCategory', verifyToken, adminOnly, editSubCategory)
router.delete('/deleteSubCategory/:id', verifyToken, adminOnly, deleteSubCategory)

router.patch(
  '/updateMedia',
  verifyToken,
  imagesUtils.uploadImages('subCategories', true).single('files'),
  adminOnly,
  updateMedia,
)

module.exports = router
