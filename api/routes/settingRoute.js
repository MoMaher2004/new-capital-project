const express = require('express')
const { verifyToken, adminOnly } = require('../controllers/userController')
const {
  viewAllSettings,
  viewSettings,
    updateSettings
} = require('../controllers/settingController')

const router = express.Router()

router.get('/viewAllSettings', verifyToken, adminOnly, viewAllSettings)
router.get('/viewSettings', viewSettings)
router.patch(
  '/updateSettings',
  verifyToken,
  adminOnly,
  updateSettings,
)

module.exports = router