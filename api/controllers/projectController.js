const projectModel = require('../models/projectModel')
const joi = require('joi')
const path = require('path')
const fs = require('fs').promises

const viewProjectById = async (req, res) => {
  try {
      console.log('value.id')
    const schema = joi.object({
      id: joi.number().integer().min(1).required(),
    })
    const { error, value } = schema.validate(req.params, {
      abortEarly: true,
      convert: true,
    })
    if (error) return res.status(400).json({ error: error.details[0].project })
    const data = await projectModel.viewProjectById(value.id)
    return res.status(200).json({ data })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ project: 'Internal server error, Please try again' })
  }
}

const viewProjects = async (req, res) => {
  try {
    const schema = joi.object({
      page: joi.number().integer().min(1).optional().default(1),
      limit: joi.number().integer().min(1).optional().default(20),
      orderDesc: joi.boolean().optional().default(true),
      showOnHome1: joi.boolean().optional().default(false),
      showOnHome2: joi.boolean().optional().default(false),
      categoryId: joi.number().integer().min(1).optional(),
      subCategoryId: joi.number().integer().min(1).optional(),
    })
    const { error, value } = schema.validate(req.query, {
      abortEarly: true,
      convert: true,
    })
    if (error) return res.status(400).json({ error: error.details[0].project })

    const data = await projectModel.viewProjects(
      value.page,
      value.limit,
      value.orderDesc,
      value.homePage1,
      value.homePage2,
      value.categoryId,
      value.subCategoryId,
    )
    return res.status(200).json({ data })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ project: 'Internal server error, Please try again' })
  }
}

const addProject = async (req, res) => {
  try {
    const schema = joi.object({
      title: joi.string().trim().min(2).max(255).required(),
      ARtitle: joi.string().trim().min(2).max(255).required(),
      description: joi.string().trim().min(2).required(),
      ARdescription: joi.string().trim().min(2).required(),
      link: joi.string().trim().min(2).max(255).allow('').optional(),
      subCategoryId: joi.number().integer().min(1).required(),
      showOnHome1: joi.boolean().required().default(false),
      showOnHome2: joi.boolean().required().default(false),
    })
    const { error, value } = schema.validate(req.body, {
      abortEarly: true,
      convert: true,
    })
    if (error) return res.status(400).json({ error: error.details[0].project })

    await projectModel.addProject(
      value.title,
      value.ARtitle,
      value.description,
      value.ARdescription,
      value.link,
      value.subCategoryId,
      value.showOnHome1,
      value.showOnHome2,
    )

    return res.status(200).json({ success: 'Project is added successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ project: 'Internal server error, Please try again' })
  }
}

const editProject = async (req, res) => {
  try {
    const schema = joi.object({
      id: joi.number().integer().min(1).required(),
      title: joi.string().trim().min(2).max(255).required(),
      ARtitle: joi.string().trim().min(2).max(255).required(),
      description: joi.string().trim().min(2).required(),
      ARdescription: joi.string().trim().min(2).required(),
      link: joi.string().trim().min(2).max(255).allow('').optional(),
      subCategoryId: joi.number().integer().min(1).required(),
      showOnHome1: joi.boolean().required().default(false),
      showOnHome2: joi.boolean().required().default(false),
    })
    const { error, value } = schema.validate(req.body, {
      abortEarly: true,
      convert: true,
    })
    if (error) return res.status(400).json({ error: error.details[0].project })

    await projectModel.editProject(
      value.id,
      value.title,
      value.ARtitle,
      value.description,
      value.ARdescription,
      value.link,
      value.subCategoryId,
      value.showOnHome1,
      value.showOnHome2,
    )

    return res.status(200).json({ success: 'Project is edited successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ project: 'Internal server error, Please try again' })
  }
}

const deleteProject = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'ID is not valid!' })
    }
    const result = await projectModel.deleteProject(id)
    if (result.error) {
      return res.status(400).json({ error: result.error })
    }
    return res.status(200).json({ success: 'project is deleted successfully', data: result })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ project: 'Internal server error, Please try again' })
  }
}

const uploadMedia = async (req, res) => {
  try {
    const projectId = parseInt(Object.values(req.body)[0])
    if (isNaN(projectId) || projectId < 1) {
      return res.status(400).json({ message: 'Project ID is invalid' })
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' })
    }

    for (const file of req.files) {
      await projectModel.uploadMedia(projectId, file.filename)
    }

    return res.status(200).json({ success: 'Media were uploaded successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error, Please try again' })
  }
}

const deleteMedia = async (req, res) => {
  try {
    const fileName = req.params.fileName
    const result = await projectModel.deleteMedia(fileName)
    if (result.error) {
      return res.status(400).json({ error: result.error })
    }
    const filePath = path.join(__dirname, '../../images/projects', fileName)
    await fs.unlink(filePath)
    return res.status(200).json({ success: 'Media were deleted successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error, Please try again' })
  }
}

module.exports = {
  viewProjectById,
  viewProjects,
  editProject,
  addProject,
  deleteProject,
  uploadMedia,
  deleteMedia,
}
