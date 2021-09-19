const Item = require('../models/item')

module.exports = (pool) => {
  const db = {}

  db.insertItem = async (item) => {
    const res = await pool.query(
      'INSERT INTO Items (name,quantity,uid) VALUES ($1,$2,$3) RETURNING *',
      [item.name, item.quantity, item.uid]
    )
    return new Item(res.rows[0])
  }
  
  db.findAllItems = async () => {
    const res = await pool.query(
      'SELECT * FROM Items'
    )
    return res.rows.map(row => new Item(row))
  }

  db.findItem = async (id) => {
    const res = await pool.query(
      'SELECT * FROM Items WHERE id = $1',
      [id]
    )
    return res.rowCount ? new Item(res.rows[0]) : null
  }

  db.updateItem = async (id, item) => {
    const res = await pool.query(
      'UPDATE Items SET name=$2, quantity=$3, uid=$4 WHERE id=$1 RETURNING *',
      [id, item.name, item.quantity, item.uid]
    )
    return new Item(res.rows[0])
  }

  db.deleteItem = async (id) => {
    const res = await pool.query(
      'DELETE FROM Items WHERE id=$1',
      [id]
    )
    return res.rowCount > 0
  }

  return db
}