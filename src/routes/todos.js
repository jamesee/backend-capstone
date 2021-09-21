const express = require('express')
const Todo = require('../models/todo')
const AccessControl = require('../models/access-control')
// const email = require('../services/email')

module.exports = (db, amqpService) => {
  const router = express.Router()
  function isInteger(n) { return /^\+?(0|[1-9]\d*)$/.test(n); }
  /**
   * @openapi
   * components:
   *  schemas:
   *    Todo:
   *      type: object
   *      required:
   *        - title
   *        - update_by
   *        - due_date
   *        - is_completed
   *        - is_deleted
   *      properties:
   *        title:
   *          type: string   
   *        updated_by:
   *          type: string
   *        due_date:
   *          type: string
   *          format: date
   *        is_completed:
   *          type: boolean  
   *        is_deleted:
   *          type: boolean
   */

  /**
   * @openapi
   * components:
   *  schemas:
   *    PublishEmail:
   *      type: array
   *      items:
   *        type: object
   *        properties:
   *          email:
   *            type: string
   *            format: email
   *          role:
   *            type: string
   */

  /**
   * @openapi
   * components:
   *  schemas:
   *    Error:
   *      type: object
   *      required:
   *        - error
   *      properties:
   *        error:
   *          type: string
   */

  /**
   * @openapi
   * /todos:
   *  post:
   *    tags:
   *    - todos
   *    description: Create a todo 
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/Todo'
   *    responses:
   *      201:
   *        description: Created
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Todo'
   */
  router.post('/', async (req, res, next) => {
    const { uid, username } = req
    const { title, due_date, is_completed, is_deleted } = req.body
    const newTodo = new Todo({ title, updated_by: username, due_date, is_completed, is_deleted })
    const todo = await db.insertTodo(newTodo)
    const newAccessControl = new AccessControl({ todo_id: todo.todo_id, user_id: uid, role: 'creator' })
    await db.insertAccessControl(newAccessControl)
    res.status(201).json(todo)
  })

  /**
   * @openapi
   * /todos:
   *  get:
   *    tags:
   *    - todos
   *    description: Get all todos  by uid signed in JWT token
   *    responses:
   *      200:
   *        description: OK
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/Todo'
   *      403:
   *        description: No access-privilege
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Error'
   */
  router.get('/', async (req, res, next) => {
    const { uid } = req
    const todos = await db.findAllTodosByUid(uid)
    res.status(200).json(todos)
  })

  /**
   * @openapi
   * /todos/{id}:
   *  get:
   *    tags:
   *    - todos
   *    description: Get todo based on access-privilege in AccessControls table of database
   *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *    responses:
   *      200:
   *        description: OK
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Todo'
   *      403:
   *        description: No access-privilege
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Error'
   */
  router.get('/:id', async (req, res, next) => {
    const { uid } = req
    const todo_id = Number(req.params.id)

    if (!isInteger(todo_id)) {
      res.status(400).json({ error: `Please provide a valid todo_id` })
      return
    }

    const authorised = await db.findAccessControlByTodoidUid(todo_id, uid)
    if (authorised === null || authorised.role === 'read-only') {
      res.status(403).json({ error: `User not authorised to access todo_id ${todo_id}` })
    } else {
      const todo = await db.findTodoByTodoidUid(todo_id, uid);
      if (todo) {
        res.json(todo)
      } else {
        res.status(400).json({ error: `Todo_id ${todo_id} not found` })
      }
    }
  })

  // router.get('/:id', async (req, res, next) => {
  //   const { uid } = req
  //   const todo_id = req.params.id
  //   const todo = await db.findTodoByTodoidUid(todo_id, uid);
  //   if (todo) {
  //     res.send(todo)
  //   } else {
  //     res.status(400).send(`Todo id ${todo_id} not found`)
  //   }
  // })

  /**
   * @openapi
   * /todos/{id}:
   *  put:
   *    tags:
   *    - todos
   *    description: Update a todo based on access-privilege in AccessControls table of database
   *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/Todo'
   *    responses:
   *      200:
   *        description: OK
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Todo'
   *      403:
   *        description: No access-privilege
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Error'
   */
  router.put('/:id', async (req, res, next) => {


    const { uid, username } = req
    const todo_id = Number(req.params.id)

    if (!isInteger(todo_id)) {
      res.status(400).json({ error: `Please provide a valid todo_id` })
      return
    }

    const authorised = await db.findAccessControlByTodoidUid(todo_id, uid)
    if (authorised === null || authorised.role === 'read-only') {
      res.status(403).json({ error: `User not authorised to update todo_id ${todo_id}` })
    } else {
      const { title, due_date, is_completed, is_deleted } = req.body
      const updatedTodo = new Todo({ todo_id, title, updated_by: username, due_date, is_completed, is_deleted })
      const todo = await db.updateTodo(todo_id, updatedTodo)
      res.status(200).json(todo)
    }
  })

  // router.put('/:id', async (req, res, next) => {
  //   const { uid, username } = req
  //   const todo_id = req.params.id
  //   const { title, due_date, is_completed, is_deleted} = req.body

  //   const updatedTodo = new Todo({  title, updated_by: username, due_date, is_completed, is_deleted })
  //   const todo = await db.updateTodoByTodoidUid(todo_id, uid, updatedTodo)
  //   console.log(todo)
  //   res.status(200).send(todo)
  // })

  /**
   * @openapi
   * /todos/{id}:
   *  delete:
   *    tags:
   *    - todos
   *    description: Soft delete a todo based on access-privilege in AccessControls table of database
   *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *    responses:
  *      200:
   *        description: OK
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Todo'
   *      403:
   *        description: No access-privilege
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Error'
   */
  router.delete('/:id', async (req, res, next) => {
    const { uid } = req
    const todo_id = Number(req.params.id)

    if (!isInteger(todo_id)) {
      res.status(400).json({ error: `Please provide a valid todo_id` })
      return
    }

    const authorised = await db.findAccessControlByTodoidUid(todo_id, uid)
    if (authorised === null || authorised.role === 'read-only') {
      res.status(403).json({ error: `User not authorised to delete todo_id ${todo_id}` })
    } else {

      let ac = false
      if (authorised.role === "creator") {
        ac = await db.deleteAccessControlByTodoid(authorised.todo_id)
      }

      if (authorised.role === "collaborator") {
        ac = await db.deleteAccessControl(authorised.access_id)
      }

      const todo = await db.deleteTodo(todo_id)
      todo ? res.status(200).json({ access_control_deleted: ac, todo }) : res.status(404).json({ error: `Item id ${todo_id} not found` });
    }
  })


  /**
   * @openapi
   * /todos/{id}/share:
   *  post:
   *    tags:
   *    - todos
   *    description: Submit an array of emails for user_id registration into AccessControls table 
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/PublishEmail'
   *    responses:
   *      200:
   *        description: Sumbitted
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/PublishEmail'
   */
  router.post('/:id/share', async (req, res, next) => {
    const { uid, username } = req
    const todo_id = Number(req.params.id)
    const { emails } = req.body

    const privilegeCheck = await db.findAccessControlByTodoidUid(todo_id, uid)
    if (!privilegeCheck) {
      res.status(403).json({ error: `No access-privilege to todo_id ${todo_id}` })
      return
    }

    //check whether emails is an Arrray
    if (!Array.isArray(emails)) {
      res.status(400).json({ error: "Please provide emails array." })
      return
    }

    emails.forEach(async (item) => {
      await amqpService.publishEmail(item.email, item.role, todo_id)
    })
    res.status(204).json({})
  })



  // router.post('/:id/emails', async (req, res, next) => {
  //   const {uid, username } = req
  //   const todo_id = Number(req.params.id)
  //   const { emails } = req.body

  //   const privilegeCheck = await db.findAccessControlByTodoidUid(todo_id, uid)
  //   if (!privilegeCheck){
  //     res.status(403).json({error: `No access-privilege to todo_id ${todo_id}`})
  //     return
  //   } 

  //   //check whether emails is an Arrray
  //   if (!Array.isArray(emails)){
  //     res.status(400).json({error: "Please provide emails array."})
  //     return
  //   }

  //   emails.forEach(async (email) => {
  //     await amqpService.publishEmail(email,"collaborator", todo_id)
  //   })
  //   res.status(204).json({})
  // })


  return router
}