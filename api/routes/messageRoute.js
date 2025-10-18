const express = require('express')
const { verifyToken, adminOnly } = require('../controllers/userController')
const { viewMessages, addMessage, deleteMessage } = require('../controllers/messageController')

const router = express.Router()

router.get('/viewMessages', verifyToken, adminOnly, viewMessages)
router.post('/addMessage', addMessage)
router.delete('/deleteMessage/:id', verifyToken, adminOnly, deleteMessage)

module.exports = router
