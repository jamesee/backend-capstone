const { Pool } = require('pg')
const fs = require('fs')

// Heroku enviroment
let pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
    ca: fs.readFileSync(`${__dirname}/global-bundle.pem`)
  }
})

// local environment 
// let pool = new Pool({
//     connectionString: process.env.DATABASE_URL
//   })

const db = {
  ...require('./access-controls')(pool),
  ...require('./tasks')(pool),
  ...require('./todos')(pool),
  // ...require('./items')(pool),
  ...require('./users')(pool),
}

db.initialise = async () => {

    // delete all tables
    // for development purpose
    // await pool.query(`
    //   DROP TABLE IF EXISTS items;
    //   DROP TABLE IF EXISTS access_controls;
    //   DROP TABLE IF EXISTS tasks;
    //   DROP TABLE IF EXISTS todos;
    //   DROP TABLE IF EXISTS users;
    // `)

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
        todo_id           SERIAL PRIMARY KEY,
        title             VARCHAR(128) NOT NULL,
        updated_by        VARCHAR(100) NOT NULL,
        due_date          DATE NOT NULL,
        is_completed      BOOLEAN NOT NULL,
        is_deleted        BOOLEAN NOT NULL,
        create_at         DATE NOT NULL DEFAULT CURRENT_DATE
      )
    `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Tasks (
      task_id           SERIAL PRIMARY KEY,
      todo_id           INTEGER NOT NULL,
      title             VARCHAR(128) NOT NULL,
      description       VARCHAR(255) NOT NULL,
      updated_by        VARCHAR(100) NOT NULL,
      due_date          DATE NOT NULL,
      is_completed      BOOLEAN NOT NULL,
      is_deleted        BOOLEAN NOT NULL,
      create_at         DATE NOT NULL DEFAULT CURRENT_DATE,
      FOREIGN KEY (todo_id) REFERENCES Todos(todo_id) ON DELETE CASCADE
    )
  `)

  await pool.query(`
    DROP TYPE IF EXISTS my_roles;
    CREATE TYPE my_roles AS ENUM ('creator', 'collaborator', 'read-only');

    CREATE TABLE IF NOT EXISTS Access_controls (
      access_id         SERIAL PRIMARY KEY,
      todo_id           INTEGER NOT NULL,
      user_id           INTEGER NOT NULL,
      role              my_roles NOT NULL,
      create_at         DATE NOT NULL DEFAULT CURRENT_DATE,
      FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
      FOREIGN KEY (todo_id) REFERENCES Todos(todo_id) ON DELETE CASCADE
    )
  `)

  //   await pool.query(`    
  //     CREATE TABLE IF NOT EXISTS Items (
  //       id SERIAL PRIMARY KEY,
  //       name VARCHAR(100) NOT NULL,
  //       quantity INTEGER NOT NULL,
  //       uid INTEGER NOT NULL,
  //       FOREIGN KEY (uid) REFERENCES Users(id) ON DELETE CASCADE
  //     )
  //   `)
  // }

  // db.clearItemsTables = async () => {
  //   await pool.query('DELETE FROM Items')
  //   await pool.query('ALTER SEQUENCE items_id_seq RESTART')
  // }

  db.clearUsersTables = async () => {
    await pool.query('DELETE FROM Users')
    await pool.query('ALTER SEQUENCE users_id_seq RESTART')
  }

  db.clearTodosTables = async () => {
    await pool.query('DELETE FROM Todos')
    await pool.query('ALTER SEQUENCE todos_id_seq RESTART')
  }

  db.clearAccessControlsTables = async () => {
    await pool.query('DELETE FROM Access_controls')
    await pool.query('ALTER SEQUENCE access_id_seq RESTART')
  }

  db.clearTasksTables = async () => {
    await pool.query('DELETE FROM Tasks')
    await pool.query('ALTER SEQUENCE task_id_seq RESTART')
  }

  db.end = async () => {
    await pool.end()
  }

}

module.exports = db