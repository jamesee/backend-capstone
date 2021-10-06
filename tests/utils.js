require('dotenv').config({ path: '.env.test' })
const App = require('../src/app')
const Router = require('../src/routes')
const AuthMiddleware = require('../src/middlewares/auth')
const AuthService = require('../src/services/auth')
const AmqpService = require('../src/services/amqp')
const Controllers = require('../src/controllers')
const Validations = require('../src/validations')

const db = require('../src/db')
const schema = require('../src/dto')
const ApiError = require('../src/errors/api-error')

const utils = {}

const amqpService = AmqpService()
const authService = AuthService(db, ApiError)
const authMiddleware = AuthMiddleware(authService, ApiError)
const controllers = Controllers(db, authService, amqpService, ApiError)
const validateDto = Validations(schema)
const router = Router(authMiddleware, validateDto, controllers)
const app = App(router)

utils.app = app
utils.db = db

utils.setup = async () => {
  await db.initialise()
  // await db.clearItemsTables()
  await db.clearUsersTables()
}

utils.teardown = async () => {
  await db.end()
}

utils.registerUser = async (username = 'test_user', email = 'test@gmail.com',password = 'test_password') => {
  const token = await authService.registerUser(username, email, password)
  return `Bearer ${token}`
}

module.exports = utils