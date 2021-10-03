const express = require('express');

module.exports = (controllers, validateDto) => {
  const router = express.Router()
  function isInteger(n) { return /^\+?(0|[1-9]\d*)$/.test(n); }

  /**
   * @openapi
   * components:
   *  schemas:
   *    Task:
   *      type: object
   *      required:
   *        - title   
   *        - description
   *        - update_by
   *        - due_date
   *        - is_completed
   *        - is_deleted
   *      properties:
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
  router.get('/', controllers.getAllTasks)

  /**
   * @openapi
   * /tasks/{task_id}:
   *  get:
   *    tags:
   *    - tasks
   *    description: Get task based on access-privilege in AccessControls table of database
   *    parameters:
   *      - in: path
   *        name: task_id
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
  router.get('/:task_id', controllers.getTask)

  /**
 * @openapi
 * /tasks/{task_id}:
 *  put:
 *    tags:
 *    - tasks
 *    description: Update a task based on access-privilege in AccessControls table of database
 *    parameters:
 *      - in: path
 *        name: task_id
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
  router.put('/:task_id', validateDto.updateTask, controllers.updateTask)

  /**
   * @openapi
   * /tasks/{task_id}:
   *  delete:
   *    tags:
   *    - tasks
   *    description: Soft delete a task based on access-privilege in AccessControls table of database
   *    parameters:
   *      - in: path
   *        name: task_id
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
  router.delete('/:task_id', controllers.deleteTask)

  return router
}