const subCategoryModel = require('../models/subCategoryModel')
const joi = require('joi')
const path = require('path')
const fs = require('fs').promises

const viewSubCategories = async (req, res) => {
  try {
    const schema = joi.object({
      page: joi.number().integer().min(1).optional().default(1),
      limit: joi.number().integer().min(1).optional().default(20),
      categoryId: joi.number().integer().min(1).allow('').optional(),
    })
    const { error, value } = schema.validate(req.query, {
      abortEarly: true,
      convert: true,
    })
    if (error) return res.status(400).json({ error: error.details[0].subCategory })

    const data = await subCategoryModel.viewSubCategories(value.page, value.limit, value.categoryId)
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
      categoryId: joi.number().integer().min(1).required(),
    })
    const { error, value } = schema.validate(req.body, {
      abortEarly: true,
      convert: true,
    })
    if (error) return res.status(400).json({ error: error.details[0].subCategory })

    await subCategoryModel.addSubCategory(
      value.name,
      value.ARname,
      value.categoryId,
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
      categoryId: joi.number().integer().min(1).required(),
    })
    const { error, value } = schema.validate(req.body, {
      abortEarly: true,
      convert: true,
    })
    if (error) return res.status(400).json({ error: error.details[0].subCategory })

    await subCategoryModel.editSubCategory(
      value.id,
      value.name,
      value.ARname,
      value.categoryId,
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

const updateMedia = async (req, res) => {
  try {
    const subCategoryId = parseInt(Object.values(req.body)[0])
    if (isNaN(subCategoryId) || subCategoryId < 1) {
      return res.status(400).json({ message: 'Category ID is invalid' })
    }
    if (!req.file || req.file.length === 0) {
      return res.status(400).json({ message: 'No file was uploaded' })
    }

    const result = await subCategoryModel.updateMedia(subCategoryId, req.file.filename)
    if (result.error) {
      return res.status(400).json({ error: result.error })
    }
    try{
      const filePath = path.join(__dirname, '../../images/subCategories', result.fileName)
      await fs.unlink(filePath)
    } catch (error){}

    return res.status(200).json({ success: 'Media were updated successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error, Please try again' })
  }
}


module.exports = {
  viewSubCategories,
  editSubCategory,
  addSubCategory,
  deleteSubCategory,
  updateMedia,
}
