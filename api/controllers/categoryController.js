const categoryModel = require('../models/categoryModel')
const joi = require('joi')

const viewCategories = async (req, res) => {
  try {
    const schema = joi.object({
      page: joi.number().integer().min(1).optional().default(1),
      limit: joi.number().integer().min(1).optional().default(20)
    })
    const { error, value } = schema.validate(req.query, {
      abortEarly: true,
      convert: true,
    })
    if (error) return res.status(400).json({ error: error.details[0].category })

    const data = await categoryModel.viewCategories(value.page, value.limit)
    return res.status(200).json({ data })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ category: 'Internal server error, Please try again' })
  }
}

const addCategory = async (req, res) => {
  try {
    const schema = joi.object({
      name: joi.string().trim().min(2).max(255).required(),
      ARname: joi.string().trim().min(2).max(255).required(),
    })
    const { error, value } = schema.validate(req.body, {
      abortEarly: true,
      convert: true,
    })
    if (error) return res.status(400).json({ error: error.details[0].category })

    await categoryModel.addCategory(
      value.name,
      value.ARname
    )

    return res.status(200).json({ success: 'Category is added successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ category: 'Internal server error, Please try again' })
  }
}

const editCategory = async (req, res) => {
  try {
    const schema = joi.object({
      id: joi.number().integer().min(1).required(),
      name: joi.string().trim().min(2).max(255).required(),
      ARname: joi.string().trim().min(2).max(255).required(),
    })
    const { error, value } = schema.validate(req.body, {
      abortEarly: true,
      convert: true,
    })
    if (error) return res.status(400).json({ error: error.details[0].category })

    await categoryModel.editCategory(
      value.id,
      value.name,
      value.ARname
    )

    return res.status(200).json({ success: 'Category is edited successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ category: 'Internal server error, Please try again' })
  }
}

const deleteCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'ID is not valid!' })
    }
    const result = await categoryModel.deleteCategory(id)
    if (result.error) {
      return res.status(400).json({ error: result.error })
    }
    return res.status(200).json({ success: 'category is deleted successfully', data: result })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ category: 'Internal server error, Please try again' })
  }
}

module.exports = {
  viewCategories,
  editCategory,
  addCategory,
  deleteCategory,
}
