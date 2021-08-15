const User = require('../models/user')

module.exports = (pool) => {
  const db = {}

  db.insertUser = async (user) => {
    const res = await pool.query(
      'INSERT INTO Users (username,password_hash) VALUES ($1,$2) RETURNING *',
      [user.username, user.password_hash]
    )
    return new User(res.rows[0])
  }

  db.findUserByUsername = async (username) => {
    const res = await pool.query(
      'SELECT * FROM Users WHERE username = $1',
      [username]
    )
    return res.rowCount ? new User(res.rows[0]) : null
  }

  return db
}