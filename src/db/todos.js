const Todo = require('../models/todo')

module.exports = (pool) => {
  const db = {}

  db.insertTodo = async (todo) => {
    const res = await pool.query(
      'INSERT INTO Todos (task_name, description , complete, due_date, updated_by) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [todo.task_name, todo.description, todo.complete, todo.due_date, todo.updated_by]
    )
    return new Todo(res.rows[0])
  }
  
  db.findAllTodos = async () => {
    const res = await pool.query(
      'SELECT * FROM Todos'
    )
    return res.rows.map(row => new Todo(row))
  }

  db.findTodo = async (id) => {
    const res = await pool.query(
      'SELECT * FROM Todos WHERE id = $1',
      [id]
    )
    return res.rowCount ? new Todo(res.rows[0]) : null
  }

  db.updateTodo = async (id, todo) => {
    const res = await pool.query(
      'UPDATE Todos SET task_name=$2, description=$3, complete=$4, due_date=$5, updated_by=$6 WHERE id=$1 RETURNING *',
      [id, todo.task_name, todo.description, todo.complete, todo.due_date, todo.updated_by]
    )
    return new Todo(res.rows[0])
  }

  db.deleteTodo = async (id) => {
    const res = await pool.query(
      'DELETE FROM Todos WHERE id=$1',
      [id]
    )
    return res.rowCount > 0
  }

  return db
}