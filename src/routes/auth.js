const express = require('express');

const authSchema = require('../dto/auth-schema')
const workingValidateDto = require('../middlewares/validate-dto');



module.exports = (controllers, validateDto) => {
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
  router.post('/register', workingValidateDto(authSchema.register), controllers.register)
  // router.post('/register', validateDto, controllers.register)

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
  router.post('/login', workingValidateDto(authSchema.login), controllers.login)
  // router.post('/login', validateDto, controllers.login)

  return router
}