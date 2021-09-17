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
  ...require('./todo-role')(pool),
  ...require('./todos')(pool),
  ...require('./items')(pool),
  ...require('./users')(pool),
}

db.initialise = async () => {

  // delete all tables
  // for development purpose
  await pool.query(`
    DROP TABLE IF EXISTS items;
    DROP TABLE IF EXISTS todo_roles;
    DROP TABLE IF EXISTS todos;
    DROP TABLE IF EXISTS users;
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Users (
      id SERIAL         PRIMARY KEY,
      username          VARCHAR(100) NOT NULL,
      email             VARCHAR(50) NOT NULL,
      password_hash     VARCHAR(100) NOT NULL,
      create_at         DATE NOT NULL DEFAULT CURRENT_DATE
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Todos (
      id                SERIAL PRIMARY KEY,
      task_name         VARCHAR(128) NOT NULL,
      description       VARCHAR(255) NOT NULL,
      complete          BOOLEAN NOT NULL,
      due_date          DATE NOT NULL,
      updated_by        VARCHAR(100) NOT NULL,
      create_at         DATE NOT NULL DEFAULT CURRENT_DATE
    )
  `)

  await pool.query(`
  DROP TYPE IF EXISTS my_roles;
  CREATE TYPE my_roles AS ENUM ('owner', 'collaborator', 'read-only');

  CREATE TABLE IF NOT EXISTS Todo_Roles (
    id                SERIAL PRIMARY KEY,
    task_id           INTEGER NOT NULL,
    user_id           INTEGER NOT NULL,
    role              my_roles NOT NULL,
    create_at         DATE NOT NULL DEFAULT CURRENT_DATE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES Todos(id) ON DELETE CASCADE
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

db.clearTodosTables = async () => {
  await pool.query('DELETE FROM Todos')
  await pool.query('ALTER SEQUENCE todos_id_seq RESTART')
}

db.clearRolesTables = async () => {
  await pool.query('DELETE FROM Roles')
  await pool.query('ALTER SEQUENCE roles_id_seq RESTART')
}

db.end = async () => {
  await pool.end()
}

module.exports = db