
module.exports = (pool, User) => {
  const db = {}

  db.insertUser = async (user) => {
    const res = await pool.query(
      'INSERT INTO Users (username, email, password_hash) VALUES ($1,$2, $3) RETURNING *',
      [user.username, user.email, user.password_hash]
    )
    return new User(res.rows[0])
  }
  
  db.findUserById = async (id) => {
    const res = await pool.query(
      'SELECT * FROM Users WHERE id = $1',
      [id]
    )
    return res.rowCount ? new User(res.rows[0]) : null
  }

  db.findUserByUsername = async (username) => {
    const res = await pool.query(
      'SELECT * FROM Users WHERE username = $1',
      [username]
    )
    return res.rowCount ? new User(res.rows[0]) : null
  }

  db.findUserByEmail = async (email) => {
    const res = await pool.query(
      'SELECT * FROM Users WHERE email = $1',
      [email]
    )
    return res.rowCount ? new User(res.rows[0]) : null
  }

  return db
}