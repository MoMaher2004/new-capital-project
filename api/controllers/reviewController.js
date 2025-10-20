const reviewModel = require('../models/reviewModel')
const fs = require('fs').promises
const path = require('path')
const joi = require('joi')

const viewReviews = async (req, res) => {
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

    const data = await reviewModel.viewReviews(value.page, value.limit, value.orderDesc == true)
    return res
      .status(200)
      .json({ data })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Internal server error, Please try again' })
  }
}

const addReview = async (req, res) => {
  try {
    const schema = joi.object({
      name: joi.string().trim().min(2).max(255).required(),
      role: joi.string().trim().min(2).max(255).required(),
      content: joi.string().trim().min(2).max(255).required(),
      ARname: joi.string().trim().min(2).max(255).required(),
      ARrole: joi.string().trim().min(2).max(255).required(),
      ARcontent: joi.string().trim().min(2).max(255).required(),
    })
    const { error, value } = schema.validate(req.body, {
      abortEarly: true,
      convert: true,
    })
    if (error) return res.status(400).json({ error: error.details[0].message })

    if (!req.file || req.file.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' })
    }

    await reviewModel.addReview(req.file.filename, value.name, value.role, value.content, value.ARname, value.ARrole, value.ARcontent)

    return res
      .status(200)
      .json({ success: 'Review is added successfully' })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Internal server error, Please try again' })
  }
}

const deleteReview = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if(isNaN(id) || id <= 0){
      return res.status(400).json({ error: 'ID is not valid!' })
    }
    const result = await reviewModel.deleteReview(id)
    if (result.error) {
      return res.status(400).json({ error: result.error })
    }
    try{
      const filePath = path.join(__dirname, '../../images/reviews', result.fileName)
      await fs.unlink(filePath)
    } catch (error){}
    return res.status(200).json({ success: 'review is deleted successfully', data: result })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Internal server error, Please try again' })
  }
}

module.exports = {
    viewReviews,
    addReview,
    deleteReview
}