
module.exports = (pool, Todo) => {
  const db = {}

  db.insertTodo = async (todo) => {
    const res = await pool.query(
      'INSERT INTO Todos (title, updated_by, due_date, is_completed, is_deleted) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [todo.title, todo.updated_by, todo.due_date, todo.is_completed, false]
    )
    return new Todo(res.rows[0])
  }
  
  db.findTodoById = async (todo_id) => {
    const res = await pool.query(
      'SELECT * FROM Todos where todo_id=$1 AND is_deleted=$2',
      [todo_id, false]
    )
    return res.rowCount ? new Todo(res.rows[0]) : null
  }

  db.findAllTodosByUid = async (uid) => {
    const res = await pool.query(
      'SELECT * FROM Todos td INNER JOIN Access_controls ac ON td.todo_id = ac.todo_id where ac.user_id=$1 and td.is_deleted=$2',
      [uid, false]
    )
    return res.rows.map(row => new Todo(row))
  }


  db.findTodoByTodoidUid = async (todo_id, uid) => {
    const res = await pool.query(
      'SELECT * FROM Todos td INNER JOIN Access_controls ac ON td.todo_id = ac.todo_id WHERE ac.todo_id = $1 AND ac.user_id=$2 AND td.is_deleted=$3',
      [todo_id, uid, false]
    )
    return res.rowCount ? new Todo(res.rows[0]) : null
  }


  db.updateTodo = async (id, todo) => {
    const res = await pool.query(
      'UPDATE Todos SET title=$2, updated_by=$3, due_date=$4, is_completed=$5 WHERE todo_id=$1 RETURNING *',
      [id, todo.title, todo.updated_by, todo.due_date, todo.is_completed]
    )
    return new Todo(res.rows[0])
  }

  db.updateTodoByTodoidUid = async (todo_id, uid, todo) => {
    const res = await pool.query(
      'UPDATE Todos td SET title=$3, updated_by=$4, due_date=$5, is_completed=$6, is_deleted=$7 \
      FROM Access_controls ac \
      WHERE td.todo_id=ac.todo_id AND td.todo_id=$1 AND ac.user_id=$2  RETURNING *',
      [todo_id, uid, todo.title, todo.updated_by, todo.due_date, todo.is_completed, todo.is_deleted]
    )
    return new Todo(res.rows[0])
  }

  // db.deleteTodo = async (id) => {
  //   const res = await pool.query(
  //     'DELETE FROM Todos WHERE todo_id=$1',
  //     [id]
  //   )
  //   return res.rowCount > 0
  // }

  db.deleteTodo = async (todo_id) => {
    const res = await pool.query(
      'UPDATE Todos SET is_deleted=$2 WHERE todo_id=$1 RETURNING *',
      [todo_id, true]
    )
    return new Todo(res.rows[0])
  }

  // db.deleteTodoByTodoIdUid = async (todo_id, user_id) => {
  //   //remove access-privilege from AccessControls table
  //   await pool.query(
  //     'DELETE FROM Access_controls WHERE todo_id=$1 and user_id=$2',
  //     [todo_id, user_id]
  //   )

  //   const res = await pool.query(
  //     'UPDATE Todos SET is_deleted=$2 WHERE todo_id=$1 RETURNING *',
  //     [todo_id, true]
  //   )
  //   return new Todo(res.rows[0])
  // }

  return db
}