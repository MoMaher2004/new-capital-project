const comparisonModel = require('../models/comparisonModel')
const fs = require('fs').promises
const path = require('path')
const joi = require('joi')

const viewComparisons = async (req, res) => {
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

    const data = await comparisonModel.viewComparisons(value.page, value.limit, value.orderDesc == true)
    return res.status(200).json({ data })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error, Please try again' })
  }
}

const addComparison = async (req, res) => {
  try {
    const schema = joi.object({
      title: joi.string().trim().min(2).max(255).required(),
    })
    const { error, value } = schema.validate(req.body, {
      abortEarly: true,
      convert: true,
    })
    if (error) return res.status(400).json({ error: error.details[0].message })

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' })
    }

    await comparisonModel.addComparison(
      value.title,
      req.files.before[0].filename,
      req.files.after[0].filename
    )

    return res.status(200).json({ success: 'Comparison is added successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error, Please try again' })
  }
}

const deleteComparison = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'ID is not valid!' })
    }
    const result = await comparisonModel.deleteComparison(id)
    if (result.error) {
      return res.status(400).json({ error: result.error })
    }
    try{
      await fs.unlink(path.join(__dirname, '../../images/comparisons', result.before))
      await fs.unlink(path.join(__dirname, '../../images/comparisons', result.after))
    } catch (error){}
    return res.status(200).json({ success: 'comparison is deleted successfully', data: result })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error, Please try again' })
  }
}

module.exports = {
  viewComparisons,
  addComparison,
  deleteComparison,
}
