const express = require('express')
const Task = require('../models/task')

module.exports = (db) => {
  const router = express.Router()
  function isInteger(n) { return /^\+?(0|[1-9]\d*)$/.test(n); } 

  /**
   * @openapi
   * components:
   *  schemas:
   *    Task:
   *      type: object
   *      required:
   *        - todo_id
   *        - title   
   *        - description
   *        - update_by
   *        - due_date
   *        - is_completed
   *        - is_deleted
   *      properties:
   *        todo_id:
   *          type: integer
   *        title:
   *          type: string 
   *        description:
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
   * /tasks:
   *  post:
   *    tags:
   *    - tasks
   *    description: Create a Task
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
   * /tasks:
   *  get:
   *    tags:
   *    - tasks
   *    description: Get all tasks by uid signed in JWT token
   *    responses:
   *      200:
   *        description: OK
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/Task'
   *      403:
   *        description: No access-privilege
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Error'
   */
  router.get('/', async (req, res, next) => {
    const { uid } = req
    const tasks = await db.findTasksByUid(uid)
    res.status(200).json(tasks)
  })

  /**
   * @openapi
   * /tasks/{id}:
   *  get:
   *    tags:
   *    - tasks
   *    description: Get task based on access-privilege in AccessControls table of database
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
   *              $ref: '#/components/schemas/Task'
   *      403:
   *        description: No access-privilege
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Error'
   */
  router.get('/:id', async (req, res, next) => {
    const {uid} = req
    const task_id = Number(req.params.id)

    if(!isInteger(task_id)) {
      res.status(400).json({error: `Please provide a valid task_id`})
      return
    }
    
    const task = await db.findTaskByTaskidUid(task_id, uid);
    if (task) {
      res.status(200).json(task)
    } else {
      res.status(403).json({error: `Task_id ${task_id} not found`})
    }
  })

  /**
   * @openapi
   * /tasks/{id}:
   *  put:
   *    tags:
   *    - tasks
   *    description: Update a task based on access-privilege in AccessControls table of database
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
   *            $ref: '#/components/schemas/Task'
   *    responses:
   *      200:
   *        description: OK
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Task'
   *      403:
   *        description: No access-privilege
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Error'
   */
  router.put('/:id', async (req, res, next) => {
    const { uid, username } = req
    const task_id = Number(req.params.id)
    const { todo_id, title, description, due_date, is_completed, is_deleted} = req.body

    if(!isInteger(task_id)) {
      res.status(400).json({error: `Please provide a valid task_id`})
      return
    }

    if(!isInteger(todo_id)) {
      res.status(400).json({error: `Please provide a valid todo_id`})
      return
    }

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
   * /tasks/{id}:
   *  delete:
   *    tags:
   *    - tasks
   *    description: Soft delete a task based on access-privilege in AccessControls table of database
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
   *              $ref: '#/components/schemas/Task'
   *      403:
   *        description: No access-privilege
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Error'
   */
  router.delete('/:id', async (req, res, next) => {
    const { uid } = req
    const task_id = Number(req.params.id)

    if(!isInteger(task_id)) {
      res.status(400).json({error: `Please provide a valid task_id`})
      return
    }

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