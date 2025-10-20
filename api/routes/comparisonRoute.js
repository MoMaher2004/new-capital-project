const express = require('express')
const { verifyToken, adminOnly } = require('../controllers/userController')
const {
  viewComparisons,
    addComparison,
    deleteComparison
} = require('../controllers/comparisonController')
const imagesUtils = require('../utils/imagesUtils')

const router = express.Router()

router.get('/viewComparisons', viewComparisons)
router.post(
  '/addComparison',
  verifyToken,
  adminOnly,
  imagesUtils.uploadImages('comparisons', false).fields([
    {name: 'before', maxCount: 1},
    {name: 'after', maxCount: 1},
  ]),
  addComparison,
)
router.delete('/deleteComparison/:id', verifyToken, adminOnly, deleteComparison)

module.exports = router