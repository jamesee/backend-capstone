const AccessControl = require('../models/access-control')

module.exports = (db) => {
  const service = {}

  service.registerAccessControl = async (email, todo_id) => {
    const todo = await db.findTodoById(todo_id)
    const user = await db.findUserByEmail(email)
    // console.log(user)
    // console.log(todo)
    if (user && todo){
      console.log(`[INFO] Registered user ${user.email} and valid todo_id ${todo_id}`)
      const newAccessControl = new AccessControl({todo_id : todo.todo_id, user_id: user.id, role: 'collaborator'})
      await db.insertAccessControl(newAccessControl)
    } else {
      console.log(`[INFO] Unregistered user ${user.email} or invalid todo_id ${todo_id} ! Do nothing ... `)
    }
  }

  return service
}
