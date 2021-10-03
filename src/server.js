require('dotenv').config()
const App = require('./app')
const Router = require('./routes')
const AuthMiddleware = require('./middlewares/auth')
const AuthService = require('./services/auth')
const AmqpService = require('./services/amqp')
const Controllers = require('./controllers')
const Validations = require('./validations')

const db = require('./db')
const schema = require('./dto')
const ApiError = require('./errors/api-error')

const amqpService = AmqpService()
const authService = AuthService(db, ApiError)
const authMiddleware = AuthMiddleware(authService)
const controllers = Controllers(db, authService, amqpService)
const validateDto = Validations(schema)
const router = Router(authMiddleware, validateDto, controllers)
const app = App(router)


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})