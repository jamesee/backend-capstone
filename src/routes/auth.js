const express = require('express')

module.exports = (authService, amqpService) => {
  const router = express.Router()

  /**
   * @openapi
   * components:
   *  schemas:
   *    RegistrationUser:
   *      type: object
   *      required:
   *        - username
   *        - email
   *        - password
   *      properties:
   *        username:
   *          type: string
   *        email:
   *          type: string
   *          format: email
   *        password:
   *          type: string
   */

  /**
   * @openapi
   * components:
   *  schemas:
   *    LoginUser:
   *      type: object
   *      required:
   *        - email
   *        - password
   *      properties:
   *        email:
   *          type: string
   *          format: email
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
   *            $ref: '#/components/schemas/RegistrationUser'
   *    responses:
   *      200:
   *        description: OK
   *      400:
   *        description: Username already exists
   */
  router.post('/register', async (req, res, next) => {
    const { username, email, password } = req.body
    const token = await authService.registerUser(username, email, password)
    if (token) {
      await amqpService.publishRegistration({ email, username })
      res.send({ token: token })
    } else {
      res.status(400).send(`Email ${email} already exists`)
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
   *            $ref: '#/components/schemas/LoginUser'
   *    responses:
   *      200:
   *        description: OK
   *      400:
   *        description: Invalid login credentials
   */
  router.post('/login', async (req, res, next) => {
    const { email, password } = req.body
    const token = await authService.loginUser(email, password)
    if (token) {
      res.send({ token: token })
    } else {
      res.status(400).send('Invalid login credentials')
    }
  })

  return router
}