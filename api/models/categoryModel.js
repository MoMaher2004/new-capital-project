const conn = require('../config/db')

const viewCategories = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit
    const [rows] = await conn.query(
      `SELECT * FROM categories ORDER BY name LIMIT ? OFFSET ?`,
      [limit, offset],
    )
    return rows
  } catch (error) {
    console.error('Error during viewCategories:', error)
    throw new Error('Something went wrong')
  }
}

const addCategory = async (name, ARname) => {
  try {
    const [rows] = await conn.query(
      `INSERT INTO categories (name, ARname) VALUES (?, ?)`,
      [name, ARname],
    )
    if (rows.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return { success: 'Category is added successfully' }
  } catch (error) {
    console.error('Error during addCategory:', error)
    throw new Error('Something went wrong')
  }
}

const editCategory = async (id, name, ARname) => {
  try {
    const [rows] = await conn.query(
      `UPDATE categories SET name = ?, ARname = ? WHERE id = ?`,
      [name, ARname, id],
    )
    if (rows.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return { success: 'Category is edited successfully' }
  } catch (error) {
    console.error('Error during editCategory:', error)
    throw new Error('Something went wrong')
  }
}

const deleteCategory = async (id) => {
  try {
    const [rows] = await conn.query(`SELECT * FROM categories WHERE id = ?`, [id])
    const [res] = await conn.query(`DELETE FROM categories WHERE id = ?`, [id])
    if (res.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return rows[0]
  } catch (error) {
    console.error('Error during deleteCategory:', error)
    throw new Error('Something went wrong')
  }
}

module.exports = {
  viewCategories,
  addCategory,
  editCategory,
  deleteCategory,
}
