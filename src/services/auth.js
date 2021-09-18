const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRY = parseInt(process.env.JWT_EXPIRY)

module.exports = (db) => {
  const service = {}

  service.generateToken = (uid, username) => {
    return jwt.sign({ uid, username }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
  }

  service.registerUser = async (username, email, password) => {
    const user = await db.findUserByEmail(email)
    if (user) {
      return null
    } else {
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
      const newUser = new User({ username, email, password_hash: passwordHash })
      const user = await db.insertUser(newUser)
      return service.generateToken(user.id, user.username)
    }
  }

  service.loginUser = async (email, password) => {
    const user = await db.findUserByEmail(email)
    if (user) {
      const isValid = await bcrypt.compare(password, user.password_hash)
      if (isValid) {
        return service.generateToken(user.id, user.username)
      }
    }
    return null
  }

  service.verifyToken = (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      return decoded
    } catch (err) {
      return null
    }
  }

  return service
}