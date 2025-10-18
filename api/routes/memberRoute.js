const express = require('express')
const { verifyToken, adminOnly } = require('../controllers/userController')
const {
  viewMembers,
    addMember,
    deleteMember
} = require('../controllers/memberController')
const imagesUtils = require('../utils/imagesUtils')

const router = express.Router()

router.get('/viewMembers', viewMembers)
router.post(
  '/addMember',
  verifyToken,
  adminOnly,
  imagesUtils.uploadImages('members', false).single('files'),
  addMember,
)
router.delete('/deleteMember/:id', verifyToken, adminOnly, deleteMember)

module.exports = router