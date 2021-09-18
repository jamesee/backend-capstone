const express = require('express')
const Task = require('../models/task')

module.exports = (db) => {
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
    const { todo_id, title, description, due_date, is_completed, is_deleted} = req.body

    //check whether uid has access to todo_id to create task
    const authorised = await db.findAccessControlByTodoidUid(todo_id, uid)
    if (authorised === null || authorised.role === 'read-only') {
        res.status(403).json({error: `User not authorised to create task in todo_id ${todo_id}`})
    } else {
        const newTask = new Task({ todo_id, title, description, updated_by: username,  due_date, is_completed, is_deleted })
        const task = await db.insertTask(newTask)
        res.status(201).json(task)
    }
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
    const { uid } = req
    const tasks = await db.findTasksByUid(uid)
    res.status(200).json(tasks)
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
    const {uid} = req
    const task_id = Number(req.params.id)
    const task = await db.findTaskByTaskidUid(task_id, uid);
    if (task) {
      res.status(200).json(task)
    } else {
      res.status(403).json({error: `Task_id ${task_id} not found`})
    }
  })

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
    const task_id = Number(req.params.id)
    const { todo_id, title, description, due_date, is_completed, is_deleted} = req.body

    const authorised = await db.findAccessControlByTodoidUid(todo_id, uid)
    if (authorised === null || authorised.role === 'read-only') {
      res.status(403).json({error:`User not authorised to update task_id ${task_id}`})
    } else {
      const updatedTask = new Task({ todo_id, title,description, updated_by: username, due_date, is_completed, is_deleted })
      const task = await db.updateTask(task_id, updatedTask)
      res.status(200).json(task)
    }
  })

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
  const { uid } = req
  const task_id = Number(req.params.id)
  const task = await db.findTaskById(task_id)
  if (task == null){
    res.status(404).json({error: `Task_id ${task_id} not found`})
  } else {
    const authorised = await db.findAccessControlByTodoidUid(task.todo_id, uid)
    if (authorised === null || authorised.role === 'read-only') {
      res.status(403).json({error: `User not authorised to delete task_id ${task_id}`})
    } else {
      const todo = await db.deleteTask(task_id)
      res.status(200).json(todo)
    }
  }
})

  return router
}