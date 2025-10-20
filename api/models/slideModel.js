const conn = require('../config/db')

const viewSlides = async (page = 1, limit = 10, orderDesc = false) => {
  try {
    const offset = (page - 1) * limit
    const [rows] = await conn.query(
      `SELECT id, CONCAT('${process.env.URL}/images/slides/', fileName) AS fileName, url, backText, ARbackText, title, ARtitle, description, ARdescription FROM slides ORDER BY id ${orderDesc ? 'DESC' : ''} LIMIT ? OFFSET ?`,
      [limit, offset]
    )
    return rows
  } catch (error) {
    console.error('Error during viewSlides:', error)
    throw new Error('Something went wrong')
  }
}

const addSlide = async (fileName, backText, ARbackText, title, ARtitle, description, ARdescription, url) => {
  try {
    const [rows] = await conn.query(
      `INSERT INTO slides (fileName, backText, ARbackText, title, ARtitle, description, ARdescription, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [fileName, backText, ARbackText, title, ARtitle, description, ARdescription, url]
    )
    if (rows.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return { success: 'Slide is added successfully' }
  } catch (error) {
    console.error('Error during addSlide:', error)
    throw new Error('Something went wrong')
  }
}

const deleteSlide = async (id) => {
  try {
    const [rows] = await conn.query(`SELECT * FROM slides WHERE id = ?`, [id])
    const [res] = await conn.query(
      `DELETE FROM slides WHERE id = ?`,
      [id]
    )
    if (res.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return rows[0]
  } catch (error) {
    console.error('Error during deleteSlide:', error)
    throw new Error('Something went wrong')
  }
}

module.exports = {
  viewSlides,
  addSlide,
  deleteSlide
}