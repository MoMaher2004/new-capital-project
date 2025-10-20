const conn = require('../config/db')
const {
  compareToken,
  generateToken,
  hashToken
} = require('../utils/tokenUtils')
const bcrypt = require('bcrypt')

const login = async (email, password) => {
  try {
    const [rows] = await conn.query(
      'SELECT * FROM users WHERE email = ? AND isDeleted = 0',
      [email]
    )

    if (rows.length === 0) {
      return null
    }
    const passwordComparisonRes = await bcrypt.compare(
      password,
      rows[0].password
    )
    if (!passwordComparisonRes) {
      return null
    }
    rows[0].password = undefined
    rows[0].passwordResetTokenExpiresAt = undefined
    rows[0].passwordResetToken = undefined
    rows[0].passwordLastUpdatedAt = undefined
    rows[0].isDeleted = undefined
    rows[0].emailConfirmationToken = undefined
    return rows[0]
  } catch (error) {
    console.error('Error during login:', error)
    throw new Error('Something went wrong')
  }
}

const checkPasswordToken = async (email, passwordResetToken) => {
  try {
    const [rows] = await conn.query(
      'SELECT * FROM users WHERE email = ? AND isDeleted = 0 AND passwordResetTokenExpiresAt > NOW()',
      [email]
    )

    if (rows.length === 0) {
      return { error: 'Token is not valid or expired, Try again' }
    }
    const passwordTokenComparisonRes = await bcrypt.compare(
      passwordResetToken,
      rows[0].passwordResetToken
    )
    if (!passwordTokenComparisonRes) {
      return { error: 'Token is not valid or expired, Try again' }
    }

    await conn.query(
      'UPDATE users SET passwordResetTokenExpiresAt = NULL, passwordResetToken = NULL WHERE id = ?',
      [rows[0].id]
    )

    rows[0].password = undefined
    rows[0].passwordResetTokenExpiresAt = undefined
    rows[0].passwordResetToken = undefined
    rows[0].passwordLastUpdatedAt = undefined
    rows[0].isDeleted = undefined
    rows[0].emailConfirmationToken = undefined
    return rows[0]
  } catch (error) {
    console.error('Error during login:', error)
    throw new Error('Something went wrong')
  }
}

const changePassword = async (
  email,
  oldPassword,
  newPassword,
  authType = 'password'
) => {
  try {
    if (authType != 'email') {
      const loginRes = await login(email, oldPassword)
      if (!loginRes) {
        return { error: 'Old password is incorrect' }
      }
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    const [res] = await conn.query(
      'UPDATE users SET password = ?, passwordLastUpdatedAt = NOW() WHERE email = ? AND isDeleted = 0',
      [hashedPassword, email]
    )
    if (res.affectedRows === 0) {
      throw new Error('Failed to change password')
    }
    return { success: 'Password changed successfully' }
  } catch (error) {
    console.error('Error during changing password:', error)
    throw new Error('Something went wrong')
  }
}

const checkUserAuth = async id => {
  try {
    const [rows] = await conn.query(
      'SELECT passwordLastUpdatedAt, isEmailConfirmed, isDeleted, email, isAdmin, Name FROM users WHERE id = ?',
      [id]
    )
    return rows[0]
  } catch (error) {
    console.error('Error during checking password change:', error)
    throw new Error('Something went wrong')
  }
}

const getUserById = async id => {
  try {
    const [rows] = await conn.query('SELECT * FROM users WHERE id = ? ', [id])
    if (rows.length === 0) {
      return null
    }
    rows[0].password = undefined
    rows[0].passwordResetToken = undefined
    rows[0].emailConfirmationToken = undefined
    return rows[0]
  } catch (error) {
    console.error('Error during getting user by id:', error)
    throw new Error('Something went wrong')
  }
}

const getUserByEmail = async email => {
  try {
    const [rows] = await conn.query('SELECT * FROM users WHERE email = ? ', [
      email
    ])
    if (rows.length === 0) {
      return null
    }
    rows[0].password = undefined
    rows[0].passwordResetToken = undefined
    rows[0].emailConfirmationToken = undefined
    return rows[0]
  } catch (error) {
    console.error('Error getUserByEmail:', error)
    throw new Error('Something went wrong')
  }
}

const deactivateUser = async id => {
  try {
    const [res] = await conn.query(
      'UPDATE users SET isDeleted = 1 WHERE id = ?',
      [id]
    )
    if (res.affectedRows === 0) {
      throw new Error('Failed to deactivate user')
    }
    return { success: 'User deactivated successfully' }
  } catch (error) {
    console.error('Error during deactivating user:', error)
    throw new Error('Something went wrong')
  }
}

const updateResetPasswordToken = async email => {
  try {
    const resetPasswordToken = generateToken()
    const hashedResetPasswordToken = await hashToken(resetPasswordToken)
    const [res] = await conn.query(
      'UPDATE users SET passwordResetToken = ?, passwordResetTokenExpiresAt = DATE_ADD(NOW(), INTERVAL 30 MINUTE) WHERE email = ? AND isDeleted = 0',
      [hashedResetPasswordToken, email]
    )
    if (res.affectedRows === 0) {
      throw new Error('Failed to update Reset Password Token')
    }
    return {
      success: 'Password reset token updated successfully',
      resetPasswordToken: resetPasswordToken
    }
  } catch (error) {
    console.error('Error during updateResetPasswordToken:', error)
    throw new Error('Something went wrong')
  }
}

const addUser = async (name, email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 12)
    const [checkEmail] = await conn.query(
      'SELECT * FROM users WHERE email = ? and isDeleted = 0',
      [email]
    )
    if (checkEmail.length > 0) {
      return { error: 'Email already exists' }
    }
    const [res] = await conn.query(
      'INSERT INTO users (name, email, password, isAdmin, isEmailConfirmed) VALUES (?, ?, ?, 1, 1)',
      [name, email, hashedPassword]
    )
    if (res.affectedRows === 0) {
      throw new Error('Failed to add user')
    }
    return {
      success: 'User added successfully',
      id: res.insertId
    }
  } catch (error) {
    console.error('Error during adding user:', error)
    throw new Error('Something went wrong')
  }
}

const getUsersList = async (page = 1, limit = 20, isDeleted = 0) => {
  try {
    const offset = (page - 1) * limit
    const [rows] = await conn.query(
      'SELECT id, name, email FROM users WHERE isDeleted = ? LIMIT ? OFFSET ?',
      [isDeleted ? 1 : 0, limit, offset]
    )
    const [count] = await conn.query(
      'SELECT COUNT(*) AS length FROM users WHERE isDeleted = ?',
      [isDeleted ? 1 : 0]
    )
    return { data: rows, length: count[0]['length'] }
  } catch (error) {
    console.error('Error during getting user list:', error)
    throw new Error('Something went wrong')
  }
}

const accountInfo = async id => {
  try {
    const [rows] = await conn.query(
      'SELECT * FROM users WHERE id = ? AND isDeleted = 0',
      [id]
    )
    if (rows.length === 0) {
      return null
    }
    rows[0].password = undefined
    rows[0].passwordResetTokenExpiresAt = undefined
    rows[0].passwordResetToken = undefined
    rows[0].passwordLastUpdatedAt = undefined
    rows[0].isDeleted = undefined
    rows[0].emailConfirmationToken = undefined
    return rows[0]
  } catch (error) {
    console.error('Error during accountInfo:', error)
    throw new Error('Something went wrong')
  }
}

module.exports = {
  login,
  changePassword,
  checkUserAuth,
  getUserById,
  deactivateUser,
  addUser,
  getUsersList,
  accountInfo,
  getUserByEmail,
  updateResetPasswordToken,
  checkPasswordToken
}