const conn = require('../config/db')

const viewMessages = async (page = 1, limit = 10, orderDesc = false) => {
  try {
    const offset = (page - 1) * limit
    const [rows] = await conn.query(
      `SELECT * FROM messages ORDER BY id ${orderDesc ? 'DESC' : ''} LIMIT ? OFFSET ?`,
      [limit, offset]
    )
    return rows
  } catch (error) {
    console.error('Error during viewMessages:', error)
    throw new Error('Something went wrong')
  }
}

const addMessage = async (name, email, message) => {
  try {
    const [rows] = await conn.query(
      `INSERT INTO messages (name, email, message) VALUES (?, ?, ?)`,
      [name, email, message]
    )
    if (rows.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return { success: 'Message is added successfully' }
  } catch (error) {
    console.error('Error during addMessage:', error)
    throw new Error('Something went wrong')
  }
}

const deleteMessage = async (id) => {
  try {
    const [rows] = await conn.query(`SELECT * FROM messages WHERE id = ?`, [id])
    const [res] = await conn.query(
      `DELETE FROM messages WHERE id = ?`,
      [id]
    )
    if (res.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return rows[0]
  } catch (error) {
    console.error('Error during deleteMessage:', error)
    throw new Error('Something went wrong')
  }
}

module.exports = {
  viewMessages,
  addMessage,
  deleteMessage
}