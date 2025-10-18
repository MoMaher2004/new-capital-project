const express = require('express')
const { verifyToken, adminOnly } = require('../controllers/userController')
const { viewCategories, addCategory, deleteCategory, editCategory } = require('../controllers/categoryController')

const router = express.Router()

router.get('/viewCategories', viewCategories)
router.post('/addCategory', verifyToken, adminOnly, addCategory)
router.patch('/editCategory', verifyToken, adminOnly, editCategory)
router.delete('/deleteCategory/:id', verifyToken, adminOnly, deleteCategory)

module.exports = router
