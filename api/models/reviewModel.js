const conn = require('../config/db')

const viewReviews = async (page = 1, limit = 10, orderDesc = false) => {
  try {
    const offset = (page - 1) * limit
    const [rows] = await conn.query(
      `SELECT id, CONCAT('${process.env.URL}/images/reviews/', fileName) AS fileName, name, ARname, role, ARrole, content, ARcontent FROM reviews ORDER BY id ${orderDesc ? 'DESC' : ''} LIMIT ? OFFSET ?`,
      [limit, offset]
    )
    return rows
  } catch (error) {
    console.error('Error during viewReviews:', error)
    throw new Error('Something went wrong')
  }
}

const addReview = async (fileName, name, role, content, ARname, ARrole, ARcontent) => {
  try {
    const [rows] = await conn.query(
      `INSERT INTO reviews (fileName, name, role, content, ARname, ARrole, ARcontent) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [fileName, name, role, content, ARname, ARrole, ARcontent]
    )
    if (rows.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return { success: 'Review is added successfully' }
  } catch (error) {
    console.error('Error during addReview:', error)
    throw new Error('Something went wrong')
  }
}

const deleteReview = async (id) => {
  try {
    const [rows] = await conn.query(`SELECT * FROM reviews WHERE id = ?`, [id])
    const [res] = await conn.query(
      `DELETE FROM reviews WHERE id = ?`,
      [id]
    )
    if (res.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return rows[0]
  } catch (error) {
    console.error('Error during deleteReview:', error)
    throw new Error('Something went wrong')
  }
}

module.exports = {
  viewReviews,
  addReview,
  deleteReview
}