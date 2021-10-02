require('dotenv').config()
const App = require('./app')
const Router = require('./routes')
const AuthMiddleware = require('./middlewares/auth')
const AuthService = require('./services/auth')
const AmqpService = require('./services/amqp')
const Controllers = require('./controllers')
const db = require('./db')


const amqpService = AmqpService()
const authService = AuthService(db)
const authMiddleware = AuthMiddleware(authService)
const controllers = Controllers(db, authService, amqpService)
const router = Router(authMiddleware, controllers)
const app = App(router)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})