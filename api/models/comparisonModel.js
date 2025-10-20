const conn = require('../config/db')

const viewComparisons = async (page = 1, limit = 10, orderDesc = false) => {
  try {
    const offset = (page - 1) * limit
    const [rows] = await conn.query(
      `SELECT id, CONCAT('${process.env.URL}/images/comparisons/', \`before\`) AS 'before', CONCAT('${process.env.URL}/images/comparisons/', \`after\`) AS 'after', title FROM comparisons ORDER BY id ${orderDesc ? 'DESC' : ''} LIMIT ? OFFSET ?`,
      [limit, offset]
    )
    return rows
  } catch (error) {
    console.error('Error during viewComparisons:', error)
    throw new Error('Something went wrong')
  }
}

const addComparison = async (title, before, after) => {
  try {
    const [rows] = await conn.query(
      'INSERT INTO comparisons (`title`, `before`, `after`) VALUES (?, ?, ?)',
      [title, before, after]
    )
    if (rows.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return { success: 'Comparison is added successfully' }
  } catch (error) {
    console.error('Error during addComparison:', error)
    throw new Error('Something went wrong')
  }
}

const deleteComparison = async (id) => {
  try {
    const [rows] = await conn.query(`SELECT * FROM comparisons WHERE id = ?`, [id])
    const [res] = await conn.query(
      `DELETE FROM comparisons WHERE id = ?`,
      [id]
    )
    if (res.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return rows[0]
  } catch (error) {
    console.error('Error during deleteComparison:', error)
    throw new Error('Something went wrong')
  }
}

module.exports = {
  viewComparisons,
  addComparison,
  deleteComparison
}