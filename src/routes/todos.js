const express = require('express')
const Todo = require('../models/todo')
const AccessControl = require('../models/access-control')
// const email = require('../services/email')

module.exports = (db, amqpService) => {
  const router = express.Router()
  
  /**
   * @openapi
   * components:
   *  schemas:
   *    Item:
   *      type: object
   *      required:
   *        - name
   *        - quantity
   *      properties:
   *        name:
   *          type: string
   *        quantity:
   *          type: integer
   */

  /**
   * @openapi
   * /items:
   *  post:
   *    tags:
   *    - items
   *    description: Create an item
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/Item'
   *    responses:
   *      201:
   *        description: Created
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Item'
   */
  router.post('/', async (req, res, next) => {
    const {uid, username } = req
    const { title, due_date, is_completed, is_deleted} = req.body
    const newTodo = new Todo({ title, updated_by: username, due_date, is_completed, is_deleted })
    const todo = await db.insertTodo(newTodo)
    const newAccessControl = new AccessControl({todo_id : todo.todo_id, user_id: uid, role: 'creator'})
    // console.log(todo)
    // console.log(newAccessControl)
    await db.insertAccessControl(newAccessControl)
    res.status(201).json(todo)
  })

  /**
   * @openapi
   * /items:
   *  get:
   *    tags:
   *    - items
   *    description: Get all items
   *    responses:
   *      200:
   *        description: OK
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/Item'
   */
  router.get('/', async (req, res, next) => {
    const {uid } = req
    const todos = await db.findAllTodosByUid(uid)
    res.status(200).json(todos)
  })

  /**
   * @openapi
   * /items/{id}:
   *  get:
   *    tags:
   *    - items
   *    description: Get item
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
   *              $ref: '#/components/schemas/Item'
   */
  router.get('/:id', async (req, res, next) => {
    const { uid } = req
    const todo_id = Number(req.params.id)
    const authorised = await db.findAccessControlByTodoidUid(todo_id, uid)
    if (authorised === null || authorised.role === 'read-only') {
      res.status(403).json({error: `User not authorised to access todo_id ${todo_id}`})
    } else {
      const todo = await db.findTodoByTodoidUid(todo_id, uid);
      if (todo) {
        res.json(todo)
      } else {
        res.status(400).json({error: `Todo_id ${todo_id} not found`})
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
   * /items/{id}:
   *  put:
   *    tags:
   *    - items
   *    description: Update an item
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
   *            $ref: '#/components/schemas/Item'
   *    responses:
   *      200:
   *        description: OK
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Item'
   */

  router.put('/:id', async (req, res, next) => {
    const { uid, username } = req
    const todo_id = Number(req.params.id)
    const authorised = await db.findAccessControlByTodoidUid(todo_id, uid)
    if (authorised === null || authorised.role === 'read-only') {
      res.status(403).json({error:`User not authorised to update todo_id ${todo_id}`})
    } else {
      const { title, due_date, is_completed, is_deleted} = req.body
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
   * /items/{id}:
   *  delete:
   *    tags:
   *    - items
   *    description: Delete an item
   *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *    responses:
   *      200:
   *        description: OK
   */

  router.delete('/:id', async (req, res, next) => {
    // const todo_id = req.params.id
  //   const success = await db.deleteTodo(todo_id)
  //   if (success) {
  //     res.send(`Deleted item ${todo_id} successfully`)
  //   } else {
  //     res.status(400).send(`Item id ${todo_id} not found`)
  //   }
  // })
  const { uid } = req
  const todo_id = Number(req.params.id)
  const authorised = await db.findAccessControlByTodoidUid(todo_id, uid)
  if (authorised === null || authorised.role === 'read-only') {
    res.status(403).json({error: `User not authorised to update todo_id ${todo_id}`})
  } else {
    const todo = await db.deleteTodo(todo_id)
    todo ? res.status(200).json(todo): res.status(404).json({error: `Item id ${todo_id} not found`});
  }
})



router.post('/:id/emails', async (req, res, next) => {
  const {uid, username } = req
  const todo_id = Number(req.params.id)
  const { emails } = req.body

  emails.forEach(async (email) => {
    console.log(email)
    await amqpService.publishEmail(email, todo_id)
  })

  // console.log(`todo_id: ${todo_id}, email : ${emails}`)
  res.status(201).json({todo_id, emails})
})


  return router
}