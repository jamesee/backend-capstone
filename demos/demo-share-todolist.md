
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

P.S. james9@gmail.com is unregistered user.
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

P.S. james3@gmail.com is a repeated submission. The access_controls table will be updated with the latest submission.
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
