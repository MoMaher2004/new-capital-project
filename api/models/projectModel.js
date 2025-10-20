const conn = require('../config/db')
const { standardizeArabic } = require('../utils/standardizeArabic')

const viewProjectById = async (id) => {
  try {
    const [rows] = await conn.query(`
      SELECT 
        p.*,
        s.categoryId AS categoryId,
        s.name AS subCategoryName,
        s.ARname AS subCategoryARName,
        CONCAT('${process.env.URL}/images/subCategories/', s.fileName) AS subCategoryfileName,
        c.name AS categoryName,
        c.ARname AS categoryARName,
        CONCAT('${process.env.URL}/images/categories/', c.fileName) AS categoryfileName,
        COALESCE(
          JSON_ARRAYAGG(
            CASE
              WHEN m.id IS NOT NULL THEN
                JSON_OBJECT(
                  'id', m.id,
                  'fileName', CONCAT('http://0.0.0.0/images/projects/', m.fileName)
                )
            END
          )
        , JSON_ARRAY()) AS media
      FROM projects p
      LEFT JOIN projectMedia m ON p.id = m.projectId
      LEFT JOIN subCategories s ON p.subCategoryId = s.id
      LEFT JOIN categories c ON s.categoryId = c.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [id])
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
  searchText
) => {
  try {
    const offset = (page - 1) * limit
    let params = []
    if (categoryId > 0) params.push(categoryId)
    if (subCategoryId > 0) params.push(subCategoryId)
    searchText = standardizeArabic(searchText).split(' ')
    filter = ''
    if (searchText[0] !== '') {
      filter += searchText.map(() => ` AND searchText REGEXP ?`).join('')
      params.push(...searchText)
    }
    const [rows] = await conn.query(
      `
      SELECT 
        p.*,
        s.categoryId AS categoryId,
        s.name AS subCategoryName,
        s.ARname AS subCategoryARName,
        CONCAT('${process.env.URL}/images/subCategories/', s.fileName) AS subCategoryfileName,
        c.name AS categoryName,
        c.ARname AS categoryARName,
        CONCAT('${process.env.URL}/images/categories/', c.fileName) AS categoryfileName,
        COALESCE(
          JSON_ARRAYAGG(
            CASE
              WHEN m.id IS NOT NULL THEN
                JSON_OBJECT(
                  'id', m.id,
                  'fileName', CONCAT('${process.env.URL}/projects/', m.fileName)
                )
            END
          ), 
          JSON_ARRAY()
        ) AS media
      FROM projects p
      LEFT JOIN projectMedia m ON p.id = m.projectId
      LEFT JOIN subCategories s ON p.subCategoryId = s.id
      LEFT JOIN categories c ON s.categoryId = c.id
      WHERE 1 = 1
        ${homePage1 ? 'AND p.homePage1 = 1' : ''} 
        ${homePage2 ? 'AND p.homePage2 = 1' : ''}
        ${categoryId > 0 ? 'AND s.categoryId = ?' : ''} 
        ${subCategoryId > 0 ? 'AND p.subCategoryId = ?' : ''} 
        ${(searchText[0] !== '') ? ` ${filter}` : ''}
      GROUP BY p.id
      ORDER BY p.id ${orderDesc ? 'DESC' : 'ASC'}
      LIMIT ? OFFSET ?`,
      [...params, limit, offset]
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
  subCategoryId,
  showOnHome1,
  showOnHome2,
) => {
  try {
    const [cat] = await conn.query(`SELECT s.name AS sName, s.ARname AS sARname, c.name AS cName, c.ARname AS cARname FROM subCategories s LEFT JOIN categories c ON c.id = s.id WHERE s.id = ?`, [subCategoryId])
    const searchText = standardizeArabic(
      ARtitle,
      ARdescription,
      cat[0].sARname,
      cat[0].cARname
    ) + title + description + cat[0].sName + cat[0].cName
    const [rows] = await conn.query(
      `INSERT INTO projects (title, ARtitle, description, ARdescription, link, subCategoryId, showOnHome1, showOnHome2, searchText) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        ARtitle,
        description,
        ARdescription,
        link,
        subCategoryId,
        showOnHome1 + 0,
        showOnHome2 + 0,
        searchText
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
  subCategoryId,
  showOnHome1,
  showOnHome2,
) => {
  try {
    const [rows] = await conn.query(
      `UPDATE projects SET title = ?, ARtitle = ?, description = ?, ARdescription = ?, link = ?, subCategoryId = ?, showOnHome1 = ?, showOnHome2 = ? WHERE id = ?`,
      [
        title,
        ARtitle,
        description,
        ARdescription,
        link,
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
    const [rows] = await conn.query(`
      SELECT 
        p.*,
        s.categoryId AS categoryId,
        s.name AS subCategoryName,
        s.ARname AS subCategoryARName,
        CONCAT('${process.env.URL}/images/subCategories/', s.fileName) AS subCategoryfileName,
        c.name AS categoryName,
        c.ARname AS categoryARName,
        CONCAT('${process.env.URL}/images/categories/', c.fileName) AS categoryfileName,
        COALESCE(
          JSON_ARRAYAGG(
            CASE
              WHEN m.id IS NOT NULL THEN
                JSON_OBJECT(
                  'id', m.id,
                  'fileName', m.fileName
                )
            END
          )
        , JSON_ARRAY()) AS media
      FROM projects p
      LEFT JOIN projectMedia m ON p.id = m.projectId
      LEFT JOIN subCategories s ON p.subCategoryId = s.id
      LEFT JOIN categories c ON s.categoryId = c.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [id])
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
