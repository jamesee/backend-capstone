
module.exports = (db, Task, ApiError) => {

  const controllers = {}

  function isInteger(n) { return /^\+?(0|[1-9]\d*)$/.test(n); }


  controllers.createTask = async (req, res, next) => {
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
    // console.log(authorised)
    if (authorised === null || authorised.role === 'read-only') {
      res.status(403).json({ error: `User not authorised to create task in todo_id ${todo_id}` })
    } else {
      const newTask = new Task({ todo_id, title, description, updated_by: username, due_date, is_completed, is_deleted })
      // console.log(newTask)
      const task = await db.insertTask(newTask)
      res.status(201).json(task)
    }
  }

  controllers.getAllTasks = async (req, res, next) => {
    const { uid } = req
    const tasks = await db.findTasksByUid(uid)
    res.status(200).json(tasks)
  }

  controllers.getTask = async (req, res, next) => {
    const { uid } = req
    const task_id = Number(req.params.task_id)

    if (!isInteger(task_id)) {
      res.status(400).json({ error: `Please provide a valid task_id` })
      return
    }

    const task = await db.findTaskByTaskidUid(task_id, uid);
    if (task) {
      res.status(200).json(task)
    } else {
      res.status(403).json({ error: `Task_id ${task_id} not found` })
    }
  }


  controllers.updateTask = async (req, res, next) => {
    const { uid, username } = req
    const task_id = Number(req.params.task_id)
    const { title, description, due_date, is_completed} = req.body

    if (!isInteger(task_id)) {
      res.status(400).json({ error: `Please provide a valid task_id` })
      return
    }

    const task = await db.findTaskById(task_id)
    if (!task) {
      res.status(404).json({ error: `Task_id ${task_id} not found` })
      return
    }

    const { todo_id } = task
    const authorised = await db.findAccessControlByTodoidUid(todo_id, uid)
    if (authorised === null || authorised.role === 'read-only') {
      res.status(403).json({ error: `User not authorised to update task_id ${task_id}` })
    } else {
      const updatedTask = new Task({ todo_id, title, description, 'updated_by': username, due_date, is_completed})
      const task = await db.updateTask(task_id, updatedTask)
      res.status(200).json(task)
    }
  }

  controllers.deleteTask = async (req, res, next) => {
    const { uid } = req
    const task_id = Number(req.params.task_id)

    if (!isInteger(task_id)) {
      res.status(400).json({ error: `Please provide a valid task_id` })
      return
    }

    const task = await db.findTaskById(task_id)
    if (task == null) {
      res.status(404).json({ error: `Task_id ${task_id} not found` })
    } else {
      const {todo_id} = task
      const authorised = await db.findAccessControlByTodoidUid(todo_id, uid)
      if (authorised === null || authorised.role === 'read-only') {
        res.status(403).json({ error: `User not authorised to delete task_id ${task_id}` })
      } else {
        const todo = await db.deleteTask(task_id)
        res.status(200).json(todo)
      }
    }
  }

  return controllers
}