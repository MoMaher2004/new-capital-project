const express = require('express')
const { verifyToken, adminOnly } = require('../controllers/userController')
const imagesUtils = require('../utils/imagesUtils')
const { viewProjectById, viewProjects, addProject, deleteProject, editProject, uploadMedia, deleteMedia } = require('../controllers/projectController')

const router = express.Router()

router.get('/viewProjectById/:id', viewProjectById)
router.get('/viewProjects', viewProjects)
router.post('/addProject', verifyToken, adminOnly, addProject)
router.patch('/editProject', verifyToken, adminOnly, editProject)
router.delete('/deleteProject/:id', verifyToken, adminOnly, deleteProject)
router.post(
  '/uploadMedia',
  verifyToken,
  adminOnly,
  imagesUtils.uploadImages('projects', true).array('files', 10),
  uploadMedia,
)
router.delete('/deleteMedia/:fileName', verifyToken, adminOnly, deleteMedia)

module.exports = router
