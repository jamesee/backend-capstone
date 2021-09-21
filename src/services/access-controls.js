const AccessControl = require('../models/access-control')

module.exports = (db) => {
  const service = {}

  service.registerAccessControl = async (email, role, todo_id) => {
    const todo = await db.findTodoById(todo_id)
    const user = await db.findUserByEmail(email)

    // console.log(email, role, todo_id)
    // console.log(user)
    if (user && todo) {
      // to check whether the user already has access-privilege
      const access = await db.findAccessControlByTodoidUid(todo_id, user.id)
      if (access) {
        console.log(`[INFO] User ${email} already has access-privilege to todo_id ${todo_id}. Abort registration ...`)
      } else {
        console.log(`[INFO] Registered user ${email} and valid todo_id ${todo_id}`)
        const newAccessControl = new AccessControl({ todo_id: todo_id, user_id: user.id, role: role })
        console.log(newAccessControl)
        await db.insertAccessControl(newAccessControl)
      }
    } else {
      console.log(`[INFO] Unregistered user ${email} or invalid todo_id ${todo_id} ! Abort registration ... `)
    }
  }

  return service
}
