const express = require('express')
const Todo = require('../models/todo')
const Task = require('../models/task')
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
   * /todos/{todo_id}:
   *  get:
   *    tags:
   *    - todos
   *    description: Get todo based on access-privilege in AccessControls table of database
   *    parameters:
   *      - in: path
   *        name: todo_id
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
  router.get('/:todo_id', async (req, res, next) => {
    const { uid } = req
    const todo_id = Number(req.params.todo_id)

    if (!isInteger(todo_id)) {
      res.status(400).json({ error: `Please provide a valid todo_id` })
      return
    }

    const authorised = await db.findAccessControlByTodoidUid(todo_id, uid)
    if (authorised === null) {
      res.status(403).json({ error: `User not authorised to access todo_id ${todo_id}` })
    } else {
      const todo = await db.findTodoByTodoidUid(todo_id, uid);
      const tasks = await db.findTasksByTodoid(todo_id);

      if (todo) {
        // res.json(todo)
        res.json({...todo, tasks})
      } 
      // else {
      //   res.status(404).json({ error: `Todo_id ${todo_id} not found` })
      // }
    }
  })


  /**
   * @openapi
   * /todos/{todo_id}:
   *  put:
   *    tags:
   *    - todos
   *    description: Update a todo based on access-privilege in AccessControls table of database
   *    parameters:
   *      - in: path
   *        name: todo_id
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
  router.put('/:todo_id', async (req, res, next) => {
    const { uid, username } = req
    const todo_id = Number(req.params.todo_id)

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


  /**
   * @openapi
   * /todos/{todo_id}:
   *  delete:
   *    tags:
   *    - todos
   *    description: Soft delete a todo based on access-privilege in AccessControls table of database
   *    parameters:
   *      - in: path
   *        name: todo_id
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
  router.delete('/:todo_id', async (req, res, next) => {
    const { uid } = req
    const todo_id = Number(req.params.todo_id)

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
   * /todos/{todo_id}/tasks:
   *  post:
   *    tags:
   *    - tasks
   *    description: Create a Task
   *    parameters:
   *      - in: path
   *        name: todo_id
   *        schema:
   *          type: integer
   *        required: true
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/Task'
   *    responses:
   *      201:
   *        description: Created
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Task'
   */
  router.post('/:todo_id/tasks', async (req, res, next) => {
    const { uid, username } = req
    const { title, description, due_date, is_completed, is_deleted } = req.body
    const todo_id = Number(req.params.todo_id)

    if (!isInteger(todo_id)) {
      res.status(400).json({ error: `Please provide a valid todo_id` })
      return
    }

    // console.log(req.body)
    //check whether uid has access to todo_id to create task
    const authorised = await db.findAccessControlByTodoidUid(todo_id, uid)
    console.log(authorised)
    if (authorised === null || authorised.role === 'read-only') {
      res.status(403).json({ error: `User not authorised to create task in todo_id ${todo_id}` })
    } else {
      const newTask = new Task({ todo_id, title, description, updated_by: username, due_date, is_completed, is_deleted })
      console.log(newTask)
      const task = await db.insertTask(newTask)
      res.status(201).json(task)
    }
  })

  /**
   * @openapi
   * /todos/{todo_id}/share:
   *  post:
   *    tags:
   *    - todos
   *    description: Submit an array [{email1, role1}, {email2, role2}, ...] for user_id registration into AccessControls table to share the todo list with todo_id={id} 
    *    parameters:
   *      - in: path
   *        name: todo_id
   *        schema:
   *          type: integer
   *        required: true
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
  router.post('/:todo_id/share', async (req, res, next) => {
    const { uid } = req
    const todo_id = Number(req.params.todo_id)
    const { sharelist } = req.body

    if (!isInteger(todo_id)) {
      res.status(400).json({ error: `Please provide a valid todo_id` })
      return
    }

    const accessCheck = await db.findAccessControlByTodoidUid(todo_id, uid)
    if (!accessCheck) {
      res.status(403).json({ error: `No access-privilege to todo_id ${todo_id}` })
      return
    }

    //check whether sharelist is an Arrray
    if (!Array.isArray(sharelist)) {
      res.status(400).json({ error: `Please provide a sharelist array.` })
      return
    }

    sharelist.forEach(async (item) => {
      await amqpService.publishEmail(item.email, item.role, todo_id)
    })
    res.status(202).json({status: "accepted", sharelist})
  })


  return router
}