const express = require('express')

module.exports = (authService, amqpService) => {
  const router = express.Router()

  /**
   * @openapi
   * components:
   *  schemas:
   *    User:
   *      type: object
   *      required:
   *        - username
   *        - password
   *      properties:
   *        username:
   *          type: string
   *        password:
   *          type: string
   */

  /**
   * @openapi
   * /register:
   *  post:
   *    tags:
   *    - auth
   *    description: Register a user
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/User'
   *    responses:
   *      200:
   *        description: OK
   *      400:
   *        description: Username already exists
   */
  router.post('/register', async (req, res, next) => {
    const { username, email, password } = req.body
    const token = await authService.registerUser(username, password)
    if (token) {
      await amqpService.publishRegistration({ email, username })
      res.send({ token: token })
    } else {
      res.status(400).send(`Username ${username} already exists`)
    }
  })

  /**
   * @openapi
   * /login:
   *  post:
   *    tags:
   *    - auth
   *    description: Login a user
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/User'
   *    responses:
   *      200:
   *        description: OK
   *      400:
   *        description: Invalid login credentials
   */
  router.post('/login', async (req, res, next) => {
    const { username, password } = req.body
    const token = await authService.loginUser(username, password)
    if (token) {
      res.send({ token: token })
    } else {
      res.status(400).send('Invalid login credentials')
    }
  })

  return router
}