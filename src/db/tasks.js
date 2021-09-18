const Task = require('../models/task')

module.exports = (pool) => {
  const db = {}

  db.insertTask = async (task) => {
    const res = await pool.query(
      'INSERT INTO Tasks (todo_id, title, description, updated_by, due_date, is_completed, is_deleted) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [task.todo_id, task.title, task.description, task.updated_by, task.due_date, task.is_completed, task.is_deleted]
    )
    return new Task(res.rows[0])
  }
  
  db.findAllTasks = async () => {
    const res = await pool.query(
      'SELECT * FROM Tasks'
    )
    return res.rows.map(row => new Task(row))
  }

  db.findTasksByUid = async (uid) => {
    const res = await pool.query(
      // 'SELECT * FROM Tasks tk INNER JOIN Todos td on tk.todo_id=td.todo_id INNER JOIN Access_controls ac ON tk.todo_id = ac.todo_id WHERE ac.user_id=$1',
      'SELECT * FROM Tasks tk INNER JOIN Access_controls ac ON tk.todo_id = ac.todo_id WHERE ac.user_id=$1',
      [uid]
    )
    return res.rows.map(row => new Task(row))
  }

  db.findTaskById = async (task_id) => {
    const res = await pool.query(
      'SELECT * FROM Tasks WHERE task_id = $1',
      [task_id]
    )
    return res.rowCount ? new Task(res.rows[0]) : null
  }

  db.findTaskByTaskidUid = async (task_id, uid) => {
    const res = await pool.query(
      'SELECT * FROM Tasks tk INNER JOIN Access_controls ac ON tk.todo_id=ac.todo_id WHERE tk.task_id = $1 AND ac.user_id=$2',
      [task_id, uid]
    )
    return res.rowCount ? new Task(res.rows[0]) : null
  }


  db.updateTask = async (task_id, task) => {
    const res = await pool.query(
      'UPDATE Tasks SET title=$2, updated_by=$3, due_date=$4, is_completed=$5, is_deleted=$6 WHERE task_id=$1 RETURNING *',
      [task_id, task.title, task.updated_by, task.due_date, task.is_completed, task.is_deleted]
    )
    return new Task(res.rows[0])
  }

  db.deleteTask = async (task_id) => {
    const res = await pool.query(
      'DELETE FROM Tasks WHERE task_id=$1',
      [task_id]
    )
    return res.rowCount > 0
  }

  return db
}