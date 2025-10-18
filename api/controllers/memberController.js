const memberModel = require('../models/memberModel')
const fs = require('fs').promises
const path = require('path')
const joi = require('joi')

const viewMembers = async (req, res) => {
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

    const data = await memberModel.viewMembers(value.page, value.limit, value.orderDesc == true)
    return res.status(200).json({ data })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error, Please try again' })
  }
}

const addMember = async (req, res) => {
  try {
    const schema = joi.object({
      name: joi.string().trim().min(2).max(255).required(),
      role: joi.string().trim().min(2).max(255).required(),
      ARname: joi.string().trim().min(2).max(255).required(),
      ARrole: joi.string().trim().min(2).max(255).required(),
      facebookUrl: joi.string().trim().uri().max(255).allow('').optional(),
      instagramUrl: joi.string().trim().uri().max(255).allow('').optional(),
      xUrl: joi.string().trim().uri().max(255).allow('').optional(),
      customLink: joi.string().trim().uri().max(255).allow('').optional()
    })
    const { error, value } = schema.validate(req.body, {
      abortEarly: true,
      convert: true,
    })
    if (error) return res.status(400).json({ error: error.details[0].message })

    if (!req.file || req.file.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' })
    }

    await memberModel.addMember(
      req.file.filename,
      value.name,
      value.role,
      value.ARname,
      value.ARrole,
      value.facebookUrl,
      value.instagramUrl,
      value.xUrl,
      value.customLink
    )

    return res.status(200).json({ success: 'Member is added successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error, Please try again' })
  }
}

const deleteMember = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'ID is not valid!' })
    }
    const result = await memberModel.deleteMember(id)
    if (result.error) {
      return res.status(400).json({ error: result.error })
    }
    const filePath = path.join(__dirname, '../../images/members', result.fileName)
    await fs.unlink(filePath)
    return res.status(200).json({ success: 'member is deleted successfully', data: result })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error, Please try again' })
  }
}

module.exports = {
  viewMembers,
  addMember,
  deleteMember,
}
