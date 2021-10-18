# End-of-Module Final Project for "Backend Developement" course at Singapore University of Technology and Design

Submitted by : James Ee

# Project Description

This is the end-of-module final project for our learning of backend Dev at SUTD. Please see project [requirements](images/project-requirements.pdf).


# Entity Relationship and Schema

The entity relationship chart is shown below: <br><br>
![entity-relationship](images/entity-relationship.png)

The sql schema is as follows:
```sql
CREATE TABLE IF NOT EXISTS Users (
   id SERIAL         PRIMARY KEY,
   username          VARCHAR(100) NOT NULL,
   email             VARCHAR(50) NOT NULL,
   password_hash     VARCHAR(100) NOT NULL,
   create_at         DATE NOT NULL DEFAULT CURRENT_DATE
)

CREATE TABLE IF NOT EXISTS Todos (
   todo_id           SERIAL PRIMARY KEY,
   title             VARCHAR(128) NOT NULL,
   updated_by        VARCHAR(100) NOT NULL,
   due_date          TIMESTAMPTZ NOT NULL,
   is_completed      BOOLEAN NOT NULL,
   is_deleted        BOOLEAN NOT NULL,
   create_at         DATE NOT NULL DEFAULT CURRENT_DATE
)

CREATE TABLE IF NOT EXISTS Tasks (
   task_id           SERIAL PRIMARY KEY,
   todo_id           INTEGER NOT NULL,
   title             VARCHAR(128) NOT NULL,
   description       VARCHAR(255) NOT NULL,
   updated_by        VARCHAR(100) NOT NULL,
   due_date          TIMESTAMPTZ NOT NULL,
   is_completed      BOOLEAN NOT NULL,
   is_deleted        BOOLEAN NOT NULL,
   create_at         DATE NOT NULL DEFAULT CURRENT_DATE,
   FOREIGN KEY (todo_id) REFERENCES Todos(todo_id) ON DELETE CASCADE
)

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

```
# Project Structure

```bash
.
├── Procfile
├── README.md
├── demos
│   └── demo-share-todolist.http
├── directory-tree.txt
├── package-lock.json
├── package.json
├── public
│   ├── index.html
│   └── minion.png
├── scripts
│   └── migrate.js
├── src
│   ├── app.js
│   ├── controllers
│   │   ├── auth.js
│   │   ├── index.js
│   │   ├── tasks.js
│   │   └── todos.js
│   ├── db
│   │   ├── access-controls.js
│   │   ├── global-bundle.pem
│   │   ├── index.js
│   │   ├── tasks.js
│   │   ├── todos.js
│   │   └── users.js
│   ├── dto
│   │   ├── auth-schema.js
│   │   ├── index.js
│   │   ├── task-schema.js
│   │   └── todo-schema.js
│   ├── errors
│   │   ├── api-error-handler.js
│   │   └── api-error.js
│   ├── middlewares
│   │   ├── auth.js
│   │   ├── auth.test.js
│   │   └── validate-dto.js
│   ├── models
│   │   ├── access-control.js
│   │   ├── task.js
│   │   ├── todo.js
│   │   └── user.js
│   ├── routes
│   │   ├── auth.js
│   │   ├── index.js
│   │   ├── tasks.js
│   │   └── todos.js
│   ├── server.js
│   ├── services
│   │   ├── access-controls.js
│   │   ├── amqp.js
│   │   ├── auth.js
│   │   └── auth.test.js.bak
│   ├── validations
│   │   └── index.js
│   └── worker.js
└── tests
    ├── auth.int.test.js
    ├── tasks.int.test.js
    ├── todos.int.test.js
    └── utils.js
```
# Project Setup

## Installation

```bash
$ npm install
```
## Usage

### DB migration

```bash
$ npm run db:migrate
```
### Start server
```bash
# for development
$ npm run dev

# for production
$ npm run start
```

## Local Deployment

```bash
# start postgres docker container
$ source backup/postgres-docker.sh

# start rabbitmq docker container
$ source  backup/rabbitMQ-docker.sh
```

## Heroku Deployment

### App Setup

```bash
$ heroku login

$ heroku create backenddev-capstone

# Add Postgres and CloudAMQP add-ons to app
$ heroku addons:create heroku-postgresql:hobby-dev
$ heroku addons:create cloudamqp:lemur

# Set config vars that we need for our app
$ heroku config:set JWT_SECRET=some_secret
$ heroku config:set JWT_EXPIRY=900
$ heroku config:set SALT_ROUNDS=10
$ heroku config:set MYHEROKU="true"
```
Create a "Procfile" at the root directory of project with the followings to instruct heroku how to start the app.

```bash
release: npm run db:migrate
web: npm run start
worker: npm run worker
```

After uploaded codes to Heroku git repo, ensure that at least one web container and one worker container are running with the following command:
```bash
# upload codes to heroku git repo
$ git push heroku main

# enable 1 web and 1 worker containers
$ heroku ps:scale web=1 worker=1
```

To access the cloudamqp manager,

```bash
$ heroku addons:open cloudamqp -a backenddev-capstone
```

### Nodejs accessing Heroku postgres add-on with TLS

To access the heroku postgres add-on with TLS using Nodejs, the following settings are required.
```js
// src/db/index.js

// Heroku enviroment
let pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
    ca: fs.readFileSync(`${__dirname}/global-bundle.pem`)
  }
})
```

The AWS global-bundle.pem can be downloaded from this [link](https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem)

### CI/CD Using Github Actions

```yaml
# .github/workflows/node.js.yml

name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    # Docker Hub image that `container-job` executes in
    container: node:10.18-jessie
    # Service containers to run with `container-job`
    services:
      # Label used to access the service container
      postgres:
        # Docker Hub image
        image: postgres
        # Provide the password for postgres
        env:
          POSTGRES_PASSWORD: postgres
        # Set health checks to wait until postgres has started
        options: 
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      rabbitmq:
        image: rabbitmq:3.8
        env:
          RABBITMQ_DEFAULT_USER: test_user
          RABBITMQ_DEFAULT_PASS: test_password
        ports:
          - 5672:5672
        options:
          --health-cmd "rabbitmqctl node_health_check"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v2
      - run: npm ci
      - run: npm test
        env:
          DATABASE_URL: 'postgresql://postgres:postgres@postgres:5432/postgres'
          CLOUDAMQP_URL: 'amqp://test_user:test_password@rabbitmq:5672'
          JWT_SECRET: 'test_secret'
          JWT_EXPIRY: 900
          SALT_ROUNDS: 10

  deploy: 
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "backenddev-capstone"
          heroku_email: "james.ee.developer@gmail.com"
```

# Demo

The url of the app is at :
https://backenddev-capstone.herokuapp.com/

At command prompt, 
```bash
# run the app with one web container and one worker container
$ heroku ps:scale web=1 worker=1

# a browser will be spun-up with the app url
$ heroku open
```

Swagger documentation can be found at 
https://backenddev-capstone.herokuapp.com/api-docs

## Steps to demostrate the functionalities of the APIs 

The demo will be using the REST-Client plugin for VS Code.

The http file is at [demos/demo-share-todolist.http](demos/demo-share-todolist.http).


```bash
@baseUrl = http://localhost:3000
# @baseUrl = https://backenddev-capstone.herokuapp.com
```

### [Step 1] Register 5 users using bogus email accounts.
```bash
### ***************** [1] register James1
# @name register
POST {{baseUrl}}/register HTTP/1.1
content-type: application/json

{
    "username": "james1",
    "email": "james1@gmail.com",
    "password": "12345678"
}

### ***************** [2] register James2
POST {{baseUrl}}/register HTTP/1.1
content-type: application/json

{
    "username": "james2",
    "email": "james2@gmail.com",
    "password": "12345678"
}

### ***************** [3] register James3
POST {{baseUrl}}/register HTTP/1.1
content-type: application/json

{
    "username": "james3",
    "email": "james3@gmail.com",
    "password": "12345678"
}

### ***************** [4] register James4
POST {{baseUrl}}/register HTTP/1.1
content-type: application/json

{
    "username": "james4",
    "email": "james4@gmail.com",
    "password": "12345678"
}

### ***************** [5] register James5
POST {{baseUrl}}/register HTTP/1.1
content-type: application/json

{
    "username": "james5",
    "email": "james5@gmail.com",
    "password": "12345678"
}
```
### [Step 2] Login as James1.
```bash
### ***************** [6] login james1
# @name loginJames1
POST {{baseUrl}}/login HTTP/1.1
content-type: application/json

{
    "email": "james1@gmail.com",
    "password": "12345678"
}
```

### [Step 3] Create 3x todos by James1
```bash
### ***************** @jwtTokenJames1
@jwtTokenJames1 = {{loginJames1.response.body.token}}
### ***************** [7] james1 - create todos1
# @name createTodo1
POST {{baseUrl}}/todos HTTP/1.1
Content-Type: application/json
Authorization: token {{jwtTokenJames1}}

{
      "title": "todo_1 - james1",
      "due_date": "2021-10-19",
      "is_completed": false
}

### ***************** [8] james1 - create todos2

# @name createTodo2
POST {{baseUrl}}/todos HTTP/1.1
Content-Type: application/json
Authorization: token {{jwtTokenJames1}}

{
      "title": "todo_2 - james1",
      "due_date": "2021-10-19",
      "is_completed": false
}
### ***************** [9] james1 - create todos3


# @name createTodo3
POST {{baseUrl}}/todos HTTP/1.1
Content-Type: application/json
Authorization: token {{jwtTokenJames1}}

{
      "title": "todo_3 - james1",
      "due_date": "2021-10-19",
      "is_completed": false
}
```

### [Step 4] Create 3x tasks under todo_id=1 by James1

```bash

### ***************** @todoId1
@todoId1 = {{createTodo1.response.body.todo_id}}
### ***************** [10] james1 - create tasks1 under todo_id=1
# @name createTask1
POST {{baseUrl}}/todos/{{todoId1}}/tasks HTTP/1.1
Content-Type: application/json
Authorization: token {{jwtTokenJames1}}

{
    "title": "Task_1 Title - todo_id=1 , james1",
    "due_date": "2021-12-15T08:00:00.000Z",
    "description": "description - james1",
    "is_complete": false
}

### ***************** [11] james1 - create tasks2 under todo_id=1
# @name createTask2
POST {{baseUrl}}/todos/{{todoId1}}/tasks HTTP/1.1
Content-Type: application/json
Authorization: token {{jwtTokenJames1}}

{
    "title": "Task_2 Title - todo_id=1 , james1",
    "due_date": "2021-12-15T08:00:00.000Z",
    "description": "description - james1",
    "is_complete": false
}

### ***************** [12] james1 - create tasks3 under todo_id=1
# @name createTask3
POST {{baseUrl}}/todos/{{todoId1}}/tasks HTTP/1.1
Content-Type: application/json
Authorization: token {{jwtTokenJames1}}

{
    "title": "Task_3 Title - todo_id=1 , james1",
    "due_date": "2021-12-15T08:00:00.000Z",
    "description": "description - james1",
    "is_complete": false
}
```

### [Step 5] Verify the 3x Todos and 3x Tasks
```bash
### ***************** [13] james1 - getAllTodos
# @name getAllTodos
GET {{baseUrl}}/todos HTTP/1.1
Authorization: token {{jwtTokenJames1}}

### ***************** [14] james1 - get todo_id=1 
# @name getTodoById
GET {{baseUrl}}/todos/{{todoId1}} HTTP/1.1
Authorization: token {{jwtTokenJames1}}
```

### [Step 6] Share todo_id=1 with others using emails.


```bash
### ***************** [15] james1 - share-todolist=1
POST {{baseUrl}}/todos/{{todoId1}}/share HTTP/1.1
Content-Type: application/json
Authorization: token {{jwtTokenJames1}}

{
"sharelist": [
    {"email":"james9@gmail.com", "role":"read-only"},
    {"email":"james2@gmail.com", "role":"collaborator"},
    {"email":"james3@gmail.com", "role":"collaborator"}
    ]
}
```
P.S. james9@gmail.com is unregistered user.

```bash
### ***************** [16] james1 - share-todolist=1
### james3@gmail.com is a repeat submission
POST {{baseUrl}}/todos/{{todoId1}}/share HTTP/1.1
Content-Type: application/json
Authorization: token {{jwtTokenJames1}}

{
"sharelist": [
    {"email": "james3@gmail.com", "role": "read-only"},
    {"email": "james4@gmail.com", "role": "read-only"}
    ]
}
```
P.S. james3@gmail.com is a repeated submission. The access_controls table will be updated with the latest submission.

### [Step 7] Login as James2.
```bash
### ***************** [17] login james2
 # @name loginJames2
POST {{baseUrl}}/login HTTP/1.1
content-type: application/json

{
    "email": "james2@gmail.com",
    "password": "12345678"
}
```

### [Step 8] Verify James2 access to todo_id=1 and the tasks under it.
```bash
### ***************** @jwtTokenJames2 
@jwtTokenJames2 = {{loginJames2.response.body.token}}

### ***************** [18] james2 - getAllTodos
# @name getAllTodos
GET {{baseUrl}}/todos HTTP/1.1
Authorization: token {{jwtTokenJames2}}

### ***************** [19] james2 - get todo_id=1 
# @name getTodoById
GET {{baseUrl}}/todos/{{todoId1}} HTTP/1.1
Authorization: token {{jwtTokenJames2}}
```

### [Step 8] Demonstrate that James2 can **update** todo_id=1 as role="collaborator".
```bash
### ***************** [20] james2 - Update todo_id=1 
PUT {{baseUrl}}/todos/{{todoId1}} HTTP/1.1
Content-Type: application/json
Authorization: token {{jwtTokenJames2}}

{
      "title": "todo_1 updated - james2",
      "due_date": "2021-12-12",
      "is_completed": true
}

### ***************** [21] james2 - get todo_id=1 
# @name getTodoById
GET {{baseUrl}}/todos/{{todoId1}} HTTP/1.1
Authorization: token {{jwtTokenJames2}}

### *****************  @taskId1 
@taskId1 = {{createTask1.response.body.task_id}}
### *****************  [22] james2 - Update task_id=1 
PUT {{baseUrl}}/tasks/{{taskId1}} HTTP/1.1
Content-Type: application/json
Authorization: token {{jwtTokenJames2}}

{
    "title": "Task Title - updated, james2",
    "due_date": "2022-12-18",
    "description": "description updated - james2",
    "is_complete": true
}

### ***************** [23] james2 - get todo_id=1 
# @name getTodoById
GET {{baseUrl}}/todos/{{todoId1}} HTTP/1.1
Authorization: token {{jwtTokenJames2}}
```


### [Step 8] Demonstrate that James2 can **delete** task_id=3 as role="collaborator".

```bash
### ***************** @taskId3 
@taskId3 = {{createTask3.response.body.task_id}}
### ***************** [24] james2 - Update task_id=1 
DELETE {{baseUrl}}/tasks/{{taskId3}} HTTP/1.1
Content-Type: application/json
Authorization: token {{jwtTokenJames2}}

### ***************** [25] james2 - get todo_id=1 
# @name getTodoById
GET {{baseUrl}}/todos/{{todoId1}} HTTP/1.1
Authorization: token {{jwtTokenJames2}}
```
### [Step 10] Demonstrate James3's access to todo_id=1 as role="read-only".

```bash
### ***************** [26] login james3
 # @name loginJames3
POST {{baseUrl}}/login HTTP/1.1
content-type: application/json

{
    "email": "james3@gmail.com",
    "password": "12345678"
}

### ***************** @jwtTokenJames3
@jwtTokenJames3 = {{loginJames3.response.body.token}}
### ***************** [27] james3 - getAllTodos
# @name getAllTodos
GET {{baseUrl}}/todos HTTP/1.1
Authorization: token {{jwtTokenJames3}}

### ***************** [28] james3 - get todo_id=1 
# @name getTodoById
GET {{baseUrl}}/todos/{{todoId1}} HTTP/1.1
Authorization: token {{jwtTokenJames3}}

### ***************** [29] james3 - Update todo_id=1 =
PUT {{baseUrl}}/todos/{{todoId1}} HTTP/1.1
Content-Type: application/json
Authorization: token {{jwtTokenJames3}}

{
      "title": "todo_1 updated by james3",
      "due_date": "2021-12-12",
      "is_completed": true
}

### ***************** [30] james3 - Update task_id=1 
PUT {{baseUrl}}/tasks/{{taskId1}} HTTP/1.1
Content-Type: application/json
Authorization: token {{jwtTokenJames3}}

{
    "title": "Task Title - updated, james3",
    "due_date": "2022-12-20",
    "description": "description updated - james3",
    "is_complete": true
}
```