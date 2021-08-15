require('dotenv').config({ path: '.env.test' })
const App = require('../src/app')
const Router = require('../src/routes')
const AuthMiddleware = require('../src/middlewares/auth')
const AuthService = require('../src/services/auth')
const db = require('../src/db')

const utils = {}

const authService = AuthService(db)
const authMiddleware = AuthMiddleware(authService)
const router = Router(authMiddleware, authService, db)
const app = App(router)

utils.app = app
utils.db = db

utils.setup = async () => {
  await db.initialise()
  await db.clearItemsTables()
  await db.clearUsersTables()
}

utils.teardown = async () => {
  await db.end()
}

utils.registerUser = async (username = 'test_user', password = 'test_password') => {
  const token = await authService.registerUser(username, password)
  return `Bearer ${token}`
}

module.exports = utils