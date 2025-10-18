const express = require('express')
const { verifyToken, adminOnly } = require('../controllers/userController')
const { viewSubCategories, addSubCategory, deleteSubCategory, editSubCategory } = require('../controllers/subCategoryController')

const router = express.Router()

router.get('/viewSubCategories', viewSubCategories)
router.post('/addSubCategory', verifyToken, adminOnly, addSubCategory)
router.patch('/editSubCategory', verifyToken, adminOnly, editSubCategory)
router.delete('/deleteSubCategory/:id', verifyToken, adminOnly, deleteSubCategory)

module.exports = router
