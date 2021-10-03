const express = require('express')

module.exports = (controllers, validateDto) => {
  const router = express.Router()
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
  router.post('/', validateDto.createTodo, controllers.createTodos)

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
  router.get('/', controllers.getAllTodos)
  

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
  router.get('/:todo_id', validateDto.getTodo, controllers.getTodo)


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
  router.put('/:todo_id',  validateDto.updateTodo, controllers.updateTodo)

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
  router.delete('/:todo_id', validateDto.deleteTodo, controllers.deleteTodo)

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
  router.post('/:todo_id/tasks', validateDto.createTask, controllers.createTask)

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
  router.post('/:todo_id/share', validateDto.shareTodo, controllers.shareTodo)


  return router
}