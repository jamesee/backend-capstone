
module.exports = (db, amqpService, AccessControl, Todo) => {

  const controllers = {}

  function isInteger(n) { return /^\+?(0|[1-9]\d*)$/.test(n); }


  controllers.createTodos = async (req, res, next) => {
    const { uid, username } = req
    const { title, due_date, is_completed, is_deleted } = req.body
    const newTodo = new Todo({ title, updated_by: username, due_date, is_completed, is_deleted })
    const todo = await db.insertTodo(newTodo)
    const newAccessControl = new AccessControl({ todo_id: todo.todo_id, user_id: uid, role: 'creator' })
    await db.insertAccessControl(newAccessControl)
    res.status(201).json(todo)
  }

  controllers.getAllTodos = async (req, res, next) => {
    const { uid } = req
    const todos = await db.findAllTodosByUid(uid)
    res.status(200).json(todos)
  }

  controllers.getTodo = async (req, res, next) => {
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
        res.json({ ...todo, tasks })
      }

    }
  }

  controllers.updateTodo = async (req, res, next) => {
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
  }

  controllers.deleteTodo = async (req, res, next) => {
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
  }


  controllers.shareTodo = async (req, res, next) => {
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
    res.status(202).json({ status: "accepted", sharelist })
  }


  return controllers
}
