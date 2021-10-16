const request = require("supertest");
const utils = require("./utils");

const app = utils.app;
const db = utils.db;

const username = "test_user";
const email = "test@gmail.com";
const password = "test_password";

let token;

beforeAll(async () => {
  await utils.setup();
  token = await utils.registerUser(username, email, password);
});

afterAll(async () => {
  await utils.teardown();
});

// ************************************************ GET /todos
describe("GET /todos", () => {
  describe("given no todos in db", () => {
    beforeAll(async () => {
      await db.clearTodosTables();
    });

    it("should return an empty array", async () => {
      return await request(app)
        .get("/todos")
        .set("Authorization", token)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual([]);
        });
    });
  });

  describe("given some todos in db", () => {
    const todos = [
      {
        title: "test_todo_1",
        due_date: "2021-10-18T16:00:00.000Z",
        is_completed: false,
      },
      {
        title: "test_todo_2",
        due_date: "2021-10-18T16:00:00.000Z",
        is_completed: false,
      },
    ];

    beforeAll(async () => {
      await db.clearTodosTables();
      await Promise.all(
        todos.map((todo) => {
          return request(app)
            .post("/todos")
            .set("Authorization", token)
            .send(todo);
        })
      );
    });

    it("should return all todos", async () => {
      return request(app)
        .get("/todos")
        .set("Authorization", token)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject(
            expect.arrayContaining(
              todos.map((todo,index) => {
                return expect.objectContaining({
                  title: todo.title,
                  due_date: todo.due_date,
                  is_completed: todo.is_completed,
                  is_deleted: false,
                  todo_id: index+1,
                  updated_by: username,
                });
              })
            )
          );
        });
    });
  });
});

// ************************************************ POST /todos

describe("POST /todos", () => {
  beforeAll(async () => {
    await db.clearTodosTables();
  });

  describe("create a todo", () => {
    let todo_id;
    const todo = {
      title: "test_todo_1",
      due_date: "2021-10-18T16:00:00.000Z",
      is_completed: false,
    };

    it("should return 201", async () => {
      return await request(app)
        .post("/todos")
        .set("Authorization", token)
        .send(todo)
        .expect(201)
        .then((response) => {
          todo_id = response.body.todo_id;
          expect(response.body).toMatchObject(todo);
        });
    });

    it("should return the todo", async () => {
      return request(app)
        .get(`/todos/${todo_id}`)
        .set("Authorization", token)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({
            ...todo,
            updated_by: username,
            tasks: [],
          });
        });
    });
  });
});

// ************************************************ PUT /todo/:todo_id
describe("PUT /todos/:todo_id", () => {
  beforeAll(async () => {
    await db.clearTodosTables();
  });

  describe("update an todo", () => {
    let todo_id;
    const todo = {
      title: "test_todo_1",
      due_date: "2021-10-18T16:00:00.000Z",
      is_completed: false,
    };

    const updatedTodo = {
      title: "test_todo_1 updated",
      due_date: "2021-10-19T16:00:00.000Z",
      is_completed: true,
    };

    beforeAll(async () => {
      return request(app)
        .post("/todos")
        .set("Authorization", token)
        .send(todo)
        .then((response) => {
          todo_id = response.body.todo_id;
        });
    });

    it("should return 200", async () => {
      return request(app)
        .put(`/todos/${todo_id}`)
        .set("Authorization", token)
        .send(updatedTodo)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject(updatedTodo);
        });
    });

    it("should return the updated todo", async () => {
      return request(app)
        .get(`/todos/${todo_id}`)
        .set("Authorization", token)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({
            ...updatedTodo,
            updated_by: username,
            tasks: [],
          });
        });
    });
  });
});

// ************************************************ soft-DELETE /todo/:todo_id
describe("DELETE /items", () => {
  beforeAll(async () => {
    await db.clearTodosTables();
  });

  describe("delete an item", () => {
    let todo_id;
    const todo = {
      title: "test_todo_1",
      due_date: "2021-10-18T16:00:00.000Z",
      is_completed: false,
    };

    beforeAll(async () => {
      return request(app)
        .post("/todos")
        .set("Authorization", token)
        .send(todo)
        .then((response) => {
          todo_id = response.body.todo_id;
        });
    });

    it("should return 200", async () => {
      return request(app)
        .delete(`/todos/${todo_id}`)
        .set("Authorization", token)
        .expect(200);
    });

    it("should return 403 when getting todo after soft-deletion", async () => {
      return request(app)
        .get(`/todos/${todo_id}`)
        .set("Authorization", token)
        .expect(403);
    });
  });
});
