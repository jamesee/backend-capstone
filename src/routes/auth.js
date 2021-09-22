const express = require('express')

module.exports = (authService, amqpService) => {
  const router = express.Router()

  function myValidate(data) {

    if (Object.keys(data).length !== 1) {
      return null;
    }

    let re = null;
    switch (Object.keys(data)[0]) {
      case 'email':
        re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        break;
      case 'password':
        re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/;
        break;
      default:
        re = null;
    }
    return re ? re.test(Object.values(data)[0]) : null;
  }

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

    if (!username) {
      res.status(400).json({ error: `Username is required.` })
      return
    }

    if (!myValidate({email})) {
      res.status(400).json({ error: `${email} is an invalid email address.` })
      return
    }

    // if (!myValidate({password})) {
    //   res.status(400).json({ error: `Invalid password ! Password must be minimum 6 and maximum 20 characters, must contain at least one alphabet, special character and numeric.` })
    //   return
    // }

    const token = await authService.registerUser(username, email, password)
    if (token) {
      await amqpService.publishRegistration({ email, username })
      res.send({ token: token })
    } else {
      res.status(400).json({ error: `Email ${email} already exists` })
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