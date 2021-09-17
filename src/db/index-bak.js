const { Pool } = require('pg')
const fs = require('fs')

// Heroku enviroment
// let pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     require: true,
//     rejectUnauthorized: false,
//     ca: fs.readFileSync(`${__dirname}/global-bundle.pem`)
//   }
// })

// local environment 
let pool = new Pool({
    connectionString: process.env.DATABASE_URL
  })

const db = {
  ...require('./items')(pool),
  ...require('./users')(pool),
}

db.initialise = async () => {

  // await pool.query(`
  // CREATE DATABASE IF NOT EXISTS mydb;
  // `)

  // await pool.query(`
  // CREATE USER IF NOT EXISTS james WITH PASSWORD 'password12345678' CREATEDB SUPERUSER;
  // `)

  // await pool.query(`
  // CREATE DATABASE mydb;
  // `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      password_hash VARCHAR(100) NOT NULL
    )
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS Items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      quantity INTEGER NOT NULL,
      uid INTEGER NOT NULL,
      FOREIGN KEY (uid) REFERENCES Users(id) ON DELETE CASCADE
    )
  `)
}

db.clearItemsTables = async () => {
  await pool.query('DELETE FROM Items')
  await pool.query('ALTER SEQUENCE items_id_seq RESTART')
}

db.clearUsersTables = async () => {
  await pool.query('DELETE FROM Users')
  await pool.query('ALTER SEQUENCE users_id_seq RESTART')
}

db.end = async () => {
  await pool.end()
}

module.exports = db