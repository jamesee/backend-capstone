
module.exports = (pool, Task) => {
  const db = {}

  db.insertTask = async (task) => {
    const res = await pool.query(
      'INSERT INTO Tasks (todo_id, title, description, updated_by, due_date, is_completed, is_deleted) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [task.todo_id, task.title, task.description, task.updated_by, task.due_date, task.is_completed, false]
    )
    return new Task(res.rows[0])
  }
  
  db.findAllTasks = async () => {
    const res = await pool.query(
      'SELECT * FROM Tasks'
    )
    return res.rows.map(row => new Task(row))
  }

  db.findTasksByTodoid = async (todo_id) => {
    const res = await pool.query(
      // 'SELECT * FROM Tasks tk INNER JOIN Todos td on tk.todo_id=td.todo_id INNER JOIN Access_controls ac ON tk.todo_id = ac.todo_id WHERE ac.user_id=$1',
      'SELECT * FROM Tasks WHERE todo_id = $1 AND is_deleted = $2',
      [todo_id, false]
    )
    return res.rows.map(row => new Task(row))
  }

  db.findTasksByUid = async (uid) => {
    const res = await pool.query(
      // 'SELECT * FROM Tasks tk INNER JOIN Todos td on tk.todo_id=td.todo_id INNER JOIN Access_controls ac ON tk.todo_id = ac.todo_id WHERE ac.user_id=$1',
      'SELECT * FROM Tasks tk INNER JOIN Access_controls ac ON tk.todo_id = ac.todo_id WHERE ac.user_id=$1 AND tk.is_deleted=$2',
      [uid, false]
    )
    return res.rows.map(row => new Task(row))
  }

  db.findTaskById = async (task_id) => {
    const res = await pool.query(
      'SELECT * FROM Tasks WHERE task_id = $1 AND is_deleted=$2',
      [task_id, false]
    )
    return res.rowCount ? new Task(res.rows[0]) : null
  }

  db.findTaskByTaskidUid = async (task_id, uid) => {
    const res = await pool.query(
      'SELECT * FROM Tasks tk INNER JOIN Access_controls ac ON tk.todo_id=ac.todo_id WHERE tk.task_id = $1 AND ac.user_id=$2 AND tk.is_deleted=$3',
      [task_id, uid, false]
    )
    return res.rowCount ? new Task(res.rows[0]) : null
  }


  db.updateTask = async (task_id, task) => {
    const res = await pool.query(
      'UPDATE Tasks SET title=$2, description=$3, updated_by=$4, due_date=$5, is_completed=$6 WHERE task_id=$1 RETURNING *',
      [task_id, task.title, task.description, task.updated_by, task.due_date, task.is_completed]
    )
    return new Task(res.rows[0])
  }

  // db.deleteTask = async (task_id) => {
  //   const res = await pool.query(
  //     'DELETE FROM Tasks WHERE task_id=$1',
  //     [task_id]
  //   )
  //   return res.rowCount > 0
  // }

  db.deleteTask = async (task_id) => {
    const res = await pool.query(
      'UPDATE Tasks SET is_deleted=$2 WHERE task_id=$1 RETURNING *',
      [task_id, true]
    )
    return new Task(res.rows[0])
  }

  return db
}