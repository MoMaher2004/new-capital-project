const conn = require('../config/db')

const viewSubCategories = async (page = 1, limit = 10, categoryId) => {
  try {
    const offset = (page - 1) * limit
    if(categoryId){
      categoryId = [categoryId]
    }else{
      categoryId = []
    }
    const [rows] = await conn.query(
      `SELECT id, name, ARname, CASE 
      WHEN fileName = NULL THEN NULL
      ELSE CONCAT('${process.env.URL}/images/categories/', fileName)
      END AS fileName
      FROM subCategories ${categoryId.length > 0 ? 'WHERE categoryId = ?' : ''} ORDER BY name LIMIT ? OFFSET ?`,
      [ ...categoryId, limit, offset],
    )
    return rows
  } catch (error) {
    console.error('Error during viewSubCategories:', error)
    throw new Error('Something went wrong')
  }
}

const addSubCategory = async (name, ARname, categoryId) => {
  try {
    const [rows] = await conn.query(
      `INSERT INTO subCategories (name, ARname, categoryId) VALUES (?, ?, ?)`,
      [name, ARname, categoryId],
    )
    if (rows.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return { success: 'SubCategory is added successfully' }
  } catch (error) {
    console.error('Error during addSubCategory:', error)
    throw new Error('Something went wrong')
  }
}

const editSubCategory = async (id, name, ARname, categoryId) => {
  try {
    const [rows] = await conn.query(
      `UPDATE subCategories SET name = ?, ARname = ?, categoryId = ? WHERE id = ?`,
      [name, ARname, categoryId, id],
    )
    if (rows.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return { success: 'SubCategory is edited successfully' }
  } catch (error) {
    console.error('Error during editSubCategory:', error)
    throw new Error('Something went wrong')
  }
}

const deleteSubCategory = async (id) => {
  try {
    const [rows] = await conn.query(`SELECT * FROM subCategories WHERE id = ?`, [id])
    const [res] = await conn.query(`DELETE FROM subCategories WHERE id = ?`, [id])
    if (res.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return rows[0]
  } catch (error) {
    console.error('Error during deleteSubCategory:', error)
    throw new Error('Something went wrong')
  }
}

const updateMedia = async (id, fileName) => {
  try {
    const [file] = await conn.query(
      `SELECT fileName FROM subCategories WHERE id = ?`,
      [id],
    )
    const [rows] = await conn.query(
      `UPDATE subCategories SET fileName = ? WHERE id = ?`,
      [fileName, id],
    )
    if (rows.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return { success: 'Category is edited successfully', fileName: file[0].fileName }
  } catch (error) {
    console.error('Error during editCategory:', error)
    throw new Error('Something went wrong')
  }
}

module.exports = {
  viewSubCategories,
  addSubCategory,
  editSubCategory,
  deleteSubCategory,
  updateMedia,
}
