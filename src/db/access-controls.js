
module.exports = (pool, AccessControl) => {
  const db = {}

  db.insertAccessControl = async (access) => {
    const res = await pool.query(
      'INSERT INTO Access_controls (todo_id, user_id ,role ) VALUES ($1,$2,$3) RETURNING *',
      [access.todo_id, access.user_id, access.role]
    )
    return new AccessControl(res.rows[0])
  }
  
  db.findAllAccessControls = async () => {
    const res = await pool.query(
      'SELECT * FROM Access_controls'
    )
    return res.rows.map(row => new AccessControl(row))
  }

  db.findAccessControlById = async (access_id) => {
    const res = await pool.query(
      'SELECT * FROM Access_controls WHERE access_id = $1',
      [access_id]
    )
    return res.rowCount ? new AccessControl(res.rows[0]) : null
  }

  db.findAccessControlByTodoidUid = async (todo_id, user_id) => {
    const res = await pool.query(
      'SELECT * FROM Access_controls WHERE todo_id = $1 AND user_id = $2',
      [todo_id, user_id]
    )
    return res.rowCount ? new AccessControl(res.rows[0]) : null
  }

  db.updateAccessControl = async (access_id, access) => {
    const res = await pool.query(
      'UPDATE Access_controls SET todo_id=$2, user_id=$3, role=$4 WHERE access_id=$1 RETURNING *',
      [access_id, access.todo_id, access.user_id, access.role]
    )
    return new AccessControl(res.rows[0])
  }

  db.deleteAccessControl = async (access_id) => {
    const res = await pool.query(
      'DELETE FROM Access_controls WHERE access_id=$1',
      [access_id]
    )
    return res.rowCount > 0
  }

  db.deleteAccessControlByTodoid = async (todo_id) => {
    const res = await pool.query(
      'DELETE FROM Access_controls WHERE todo_id=$1',
      [todo_id]
    )
    // console.log(res)
    return res.rowCount > 0
  }

  return db
}