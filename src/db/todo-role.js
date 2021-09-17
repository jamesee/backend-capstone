const TodoRole = require('../models/todo-role')

module.exports = (pool) => {
  const db = {}

  db.insertTodoRole = async (todo_role) => {
    const res = await pool.query(
      'INSERT INTO Todo_Roles (task_id, user_id ,role ) VALUES ($1,$2,$3) RETURNING *',
      [todo_role.task_id, todo_role.user_id, todo_role.role]
    )
    return new TodoRole(res.rows[0])
  }
  
  db.findAllTodoRoles = async () => {
    const res = await pool.query(
      'SELECT * FROM Todo_Roles'
    )
    return res.rows.map(row => new TodoRole(row))
  }

  db.findTodoRole = async (id) => {
    const res = await pool.query(
      'SELECT * FROM Todo_Roles WHERE id = $1',
      [id]
    )
    return res.rowCount ? new TodoRole(res.rows[0]) : null
  }

  db.updateTodoRole = async (id, todo_role) => {
    const res = await pool.query(
      'UPDATE Todo_Roles SET task_id=$2, user_id=$3, role=$4 WHERE id=$1 RETURNING *',
      [id, todo_role.task_id, todo_role.user_id, todo_role.role]
    )
    return new TodoRole(res.rows[0])
  }

  db.deleteTodoRole = async (id) => {
    const res = await pool.query(
      'DELETE FROM Todo_Roles WHERE id=$1',
      [id]
    )
    return res.rowCount > 0
  }

  return db
}