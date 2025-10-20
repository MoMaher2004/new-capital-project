const slideModel = require('../models/slideModel')
const fs = require('fs').promises
const path = require('path')
const joi = require('joi')

const viewSlides = async (req, res) => {
  try {
    const schema = joi.object({
      page: joi.number().integer().min(1).optional().default(1),
      limit: joi.number().integer().min(1).optional().default(20),
      orderDesc: joi.boolean().optional().default(true),
    })
    const { error, value } = schema.validate(req.query, {
      abortEarly: true,
      convert: true,
    })
    if (error) return res.status(400).json({ error: error.details[0].message })

    const data = await slideModel.viewSlides(value.page, value.limit, value.orderDesc == true)
    return res.status(200).json({ data })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error, Please try again' })
  }
}

const addSlide = async (req, res) => {
  try {
    const schema = joi.object({
      backText: joi.string().trim().min(2).max(255).required(),
      title: joi.string().trim().min(2).max(255).required(),
      description: joi.string().trim().min(2).max(255).required(),
      ARbackText: joi.string().trim().min(2).max(255).required(),
      ARtitle: joi.string().trim().min(2).max(255).required(),
      ARdescription: joi.string().trim().min(2).max(255).required(),
      url: joi.string().trim().uri().max(255).allow('').optional(),
    })
    const { error, value } = schema.validate(req.body, {
      abortEarly: true,
      convert: true,
    })
    if (error) return res.status(400).json({ error: error.details[0].message })

    if (!req.file || req.file.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' })
    }

    await slideModel.addSlide(
      req.file.filename,
      value.backText,
      value.title,
      value.description,
      value.ARbackText,
      value.ARtitle,
      value.ARdescription,
      value.url
    )

    return res.status(200).json({ success: 'Slide is added successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error, Please try again' })
  }
}

const deleteSlide = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'ID is not valid!' })
    }
    const result = await slideModel.deleteSlide(id)
    if (result.error) {
      return res.status(400).json({ error: result.error })
    }
    try{
      const filePath = path.join(__dirname, '../../images/slides', result.fileName)
      await fs.unlink(filePath)
    } catch (error){}
    return res.status(200).json({ success: 'slide is deleted successfully', data: result })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error, Please try again' })
  }
}

module.exports = {
  viewSlides,
  addSlide,
  deleteSlide,
}
