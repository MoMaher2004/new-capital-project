const conn = require('../config/db')

const viewSubCategories = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit
    const [rows] = await conn.query(
      `SELECT * FROM subCategories ORDER BY name LIMIT ? OFFSET ?`,
      [limit, offset],
    )
    return rows
  } catch (error) {
    console.error('Error during viewSubCategories:', error)
    throw new Error('Something went wrong')
  }
}

const addSubCategory = async (name, ARname) => {
  try {
    const [rows] = await conn.query(
      `INSERT INTO subCategories (name, ARname) VALUES (?, ?)`,
      [name, ARname],
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

const editSubCategory = async (id, name, ARname) => {
  try {
    const [rows] = await conn.query(
      `UPDATE subCategories SET name = ?, ARname = ? WHERE id = ?`,
      [name, ARname, id],
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

module.exports = {
  viewSubCategories,
  addSubCategory,
  editSubCategory,
  deleteSubCategory,
}
