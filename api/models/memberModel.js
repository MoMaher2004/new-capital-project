const conn = require('../config/db')

const viewMembers = async (page = 1, limit = 10, orderDesc = false) => {
  try {
    const offset = (page - 1) * limit
    const [rows] = await conn.query(
      `SELECT id, CONCAT('${process.env.URL}/images/members/', fileName) AS fileName, name, role, ARname, ARrole, facebookUrl, instagramUrl, xUrl, customLink FROM members ORDER BY id ${orderDesc ? 'DESC' : ''} LIMIT ? OFFSET ?`,
      [limit, offset]
    )
    return rows
  } catch (error) {
    console.error('Error during viewMembers:', error)
    throw new Error('Something went wrong')
  }
}

const addMember = async (fileName, name, role, ARname, ARrole, facebookUrl, instagramUrl, xUrl, customLink) => {
  try {
    const [rows] = await conn.query(
      `INSERT INTO members (fileName, name, role, ARname, ARrole, facebookUrl, instagramUrl, xUrl, customLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [fileName, name, role, ARname, ARrole, facebookUrl, instagramUrl, xUrl, customLink]
    )
    if (rows.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return { success: 'Member is added successfully' }
  } catch (error) {
    console.error('Error during addMember:', error)
    throw new Error('Something went wrong')
  }
}

const deleteMember = async (id) => {
  try {
    const [rows] = await conn.query(`SELECT * FROM members WHERE id = ?`, [id])
    const [res] = await conn.query(
      `DELETE FROM members WHERE id = ?`,
      [id]
    )
    if (res.affectedRows === 0) {
      throw new Error('Something went wrong')
    }
    return rows[0]
  } catch (error) {
    console.error('Error during deleteMember:', error)
    throw new Error('Something went wrong')
  }
}

module.exports = {
  viewMembers,
  addMember,
  deleteMember
}