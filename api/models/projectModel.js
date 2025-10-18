const conn = require('../config/db')

const viewProjectById = async (id) => {
  try {
    const [rows] = await conn.query(`SELECT * FROM projects WHERE id = ?`, [id])
    return rows
  } catch (error) {
    console.error('Error during viewProject:', error)
    throw new Error('Something went wrong')
  }
}

const viewProjects = async (
  page = 1,
  limit = 10,
  orderDesc = true,
  homePage1 = false,
  homePage2 = false,
  categoryId = 0,
  subCategoryId = 0,
) => {
  try {
    const offset = (page - 1) * limit
    let params = []
    if (categoryId > 0) params.push(categoryId)
    if (subCategoryId > 0) params.push(subCategoryId)
    const [rows] = await conn.query(
      `SELECT * FROM projects WHERE ${homePage1 ? 'homePage1 = 1 AND' : ''} ${categoryId > 0 ? 'categoryId = ? AND' : ''} ${subCategoryId > 0 ? 'subCategoryId = ? AND' : ''} ${homePage2 ? 'homePage2 = 1' : '1 = 1'} ORDER BY id ${orderDesc ? 'DESC' : ''} LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    )
    return rows
  } catch (error) {
    console.error('Error during viewProject:', error)
    throw new Error('Something went wrong')
  }
}

const addProject = async (
  title,
  ARtitle,
  description,
  ARdescription,
  link,
  categoryId,
  subCategoryId,
  showOnHome1,
  showOnHome2,
) => {
  try {
    const [rows] = await conn.query(
      `INSERT INTO projects (title, ARtitle, description, ARdescription, link, categoryId, subCategoryId, showOnHome1, showOnHome2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        ARtitle,
        description,
        ARdescription,
        link,
        categoryId,
        subCategoryId,
        showOnHome1 + 0,
        showOnHome2 + 0,
      ],
    )
    if (rows.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return { success: 'Project is added successfully' }
  } catch (error) {
    console.error('Error during addProject:', error)
    throw new Error('Something went wrong')
  }
}

const editProject = async (
  id,
  title,
  ARtitle,
  description,
  ARdescription,
  link,
  categoryId,
  subCategoryId,
  showOnHome1,
  showOnHome2,
) => {
  try {
    const [rows] = await conn.query(
      `UPDATE projects SET title = ?, ARtitle = ?, description = ?, ARdescription = ?, link = ?, categoryId = ?, subCategoryId = ?, showOnHome1 = ?, showOnHome2 = ? WHERE id = ?`,
      [
        title,
        ARtitle,
        description,
        ARdescription,
        link,
        categoryId,
        subCategoryId,
        showOnHome1 + 0,
        showOnHome2 + 0,
        id,
      ],
    )
    if (rows.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return { success: 'Project is edited successfully' }
  } catch (error) {
    console.error('Error during editProject:', error)
    throw new Error('Something went wrong')
  }
}

const deleteProject = async (id) => {
  try {
    const [rows] = await conn.query(`SELECT * FROM projects WHERE id = ?`, [id])
    const [res] = await conn.query(`DELETE FROM projects WHERE id = ?`, [id])
    if (res.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return rows[0]
  } catch (error) {
    console.error('Error during deleteProject:', error)
    throw new Error('Something went wrong')
  }
}

const uploadMedia = async (projectId, fileName) => {
  try {
    const [res] = await conn.query(`INSERT INTO projectMedia (projectId, fileName) VALUES (?, ?)`, [
      projectId,
      fileName,
    ])
    if (res.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return { success: 'Media was uploaded successfully' }
  } catch (error) {
    console.error('Error during uploadMedia:', error)
    throw new Error('Something went wrong')
  }
}

const deleteMedia = async (fileName) => {
  try {
    const [res] = await conn.query(`DELETE FROM projectMedia WHERE fileName = ?`, [fileName])
    if (res.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return { success: 'Media was deleted successfully' }
  } catch (error) {
    console.error('Error during deleteMedia:', error)
    throw new Error('Something went wrong')
  }
}

module.exports = {
  viewProjectById,
  viewProjects,
  addProject,
  editProject,
  deleteProject,
  uploadMedia,
  deleteMedia,
}
