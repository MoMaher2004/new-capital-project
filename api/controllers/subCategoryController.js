const subCategoryModel = require('../models/subCategoryModel')
const joi = require('joi')

const viewSubCategories = async (req, res) => {
  try {
    const schema = joi.object({
      page: joi.number().integer().min(1).optional().default(1),
      limit: joi.number().integer().min(1).optional().default(20)
    })
    const { error, value } = schema.validate(req.query, {
      abortEarly: true,
      convert: true,
    })
    if (error) return res.status(400).json({ error: error.details[0].subCategory })

    const data = await subCategoryModel.viewSubCategories(value.page, value.limit)
    return res.status(200).json({ data })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ subCategory: 'Internal server error, Please try again' })
  }
}

const addSubCategory = async (req, res) => {
  try {
    const schema = joi.object({
      name: joi.string().trim().min(2).max(255).required(),
      ARname: joi.string().trim().min(2).max(255).required(),
    })
    const { error, value } = schema.validate(req.body, {
      abortEarly: true,
      convert: true,
    })
    if (error) return res.status(400).json({ error: error.details[0].subCategory })

    await subCategoryModel.addSubCategory(
      value.name,
      value.ARname
    )

    return res.status(200).json({ success: 'SubCategory is added successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ subCategory: 'Internal server error, Please try again' })
  }
}

const editSubCategory = async (req, res) => {
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
    if (error) return res.status(400).json({ error: error.details[0].subCategory })

    await subCategoryModel.editSubCategory(
      value.id,
      value.name,
      value.ARname
    )

    return res.status(200).json({ success: 'SubCategory is edited successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ subCategory: 'Internal server error, Please try again' })
  }
}

const deleteSubCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'ID is not valid!' })
    }
    const result = await subCategoryModel.deleteSubCategory(id)
    if (result.error) {
      return res.status(400).json({ error: result.error })
    }
    return res.status(200).json({ success: 'subCategory is deleted successfully', data: result })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ subCategory: 'Internal server error, Please try again' })
  }
}

module.exports = {
  viewSubCategories,
  editSubCategory,
  addSubCategory,
  deleteSubCategory,
}
