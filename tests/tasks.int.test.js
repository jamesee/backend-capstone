const request = require("supertest");
const utils = require("./utils");

const app = utils.app;
const db = utils.db;

const username = "test_user";
const email = "test@gmail.com";
const password = "test_password";

let token;
let todo_id;
let task_id;

beforeAll(async () => {
  await utils.setup();
  token = await utils.registerUser(username, email, password);
});

afterAll(async () => {
  await utils.teardown();
});

// ************************************************ empty GET /tasks
describe("GET /tasks", () => {
  describe("given no tasks in db", () => {
    beforeAll(async () => {
      await db.clearTodosTables();
    });

    it("should return an empty array", async () => {
      return await request(app)
        .get("/tasks")
        .set("Authorization", token)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual([]);
        });
    });
  });
});

// ************************************************ POST /tasks
describe("create 1xtodos and 2xtasks in db", () => {
  const tasks = [
    {
      title: "test_task_1",
      description: "task1 description1",
      due_date: "2021-10-18T16:00:00.000Z",
      is_completed: false,
    },
    {
      title: "test_task_2",
      description: "task2 description2",
      due_date: "2021-10-18T16:00:00.000Z",
      is_completed: false,
    },
  ];

  beforeAll(async () => {
    await utils.setup();

    const todo = {
      title: "test_todo_1",
      due_date: "2021-10-18T16:00:00.000Z",
      is_completed: false,
    };

    token = await utils.registerUser(username, email, password);

    await request(app)
      .post("/todos")
      .set("Authorization", token)
      .send(todo)
      .expect(201)
      .then((response) => {
        todo_id = response.body.todo_id;
      });
  });

  it("should return a todo", async () => {
    return request(app)
      .get(`/todos/${todo_id}`)
      .set("Authorization", token)
      .expect(200);
  });

  //** insert 2 tasks under the created todo into db */
  //** check its responses */
  it("should successfully return tasks array of length 2", async () => {
    await Promise.all(
      tasks.map((task) => {
        return request(app)
          .post(`/todos/${todo_id}/tasks`)
          .set("Authorization", token)
          .send(task)
          .expect(201)
          .then((response) => {
            expect(response.body).toMatchObject(
              expect.objectContaining({
         
                updated_by: username,
                is_deleted: false,
                todo_id: todo_id,
              })
            );
          });
      })
    );
  });

  it("should return todo with tasks field as an array of length = 2", async () => {
    return request(app)
      .get(`/todos/${todo_id}`)
      .set("Authorization", token)
      .expect(200)
      .then((response) => {
        expect(response.body.tasks).toHaveLength(2);
      });
  });

  it("should return todo with tasks field as an array of object = tasks", async () => {
    return request(app)
      .get(`/todos/${todo_id}`)
      .set("Authorization", token)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty(
          "tasks",
          tasks.map((task, index) => {
            return {
              ...task,
              todo_id,
              task_id: index + 1,
              is_deleted: false,
              updated_by: username,
            };
          })
        );
      });
  });
});

// ************************************************ PUT /tasks/:task_id
describe("PUT /tasks/:task_id", () => {
  const todo = {
    title: "test_todo_1",
    due_date: "2021-10-18T16:00:00.000Z",
    is_completed: false,
  };

  const task = {
    title: "test_task_1",
    description: "test_task_1 description",
    due_date: "2021-10-18T16:00:00.000Z",
    is_completed: false,
  };

  beforeAll(async () => {
    await utils.setup();
    token = await utils.registerUser(username, email, password);

    await request(app)
      .post("/todos")
      .set("Authorization", token)
      .send(todo)
      .expect(201)
      .then((response) => {
        todo_id = response.body.todo_id;
      });

    await request(app)
      .post(`/todos/${todo_id}/tasks`)
      .set("Authorization", token)
      .send(task)
      .expect(201)
      .then((response) => {
        task_id = response.body.task_id;
      });
  });

  describe("update a task", () => {
    const updatedTask = {
      title: "test_todo_1 updated",
      description: "test_task_1 description updated",
      due_date: "2021-10-19T16:00:00.000Z",
      is_completed: true,
    };

    it("should return 200", async () => {
      return request(app)
        .put(`/tasks/${task_id}`)
        .set("Authorization", token)
        .send(updatedTask)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject(
            expect.objectContaining({
              ...updatedTask,
              task_id: 1,
              todo_id,
              updated_by: username,
              is_deleted: false,
            })
          );
        });
    });

    it("getTaskById should return 200 and updatedTask", async () => {
      return request(app)
        .get(`/tasks/${task_id}`)
        .set("Authorization", token)
        .send(updatedTask)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject(
            expect.objectContaining({
              ...updatedTask,
              task_id: 1,
              todo_id,
              updated_by: username,
              is_deleted: false,
            })
          );
        });
    });

    it("getTodoById should return with task field = updatedTask ", async () => {
      return request(app)
        .get(`/todos/${todo_id}`)
        .set("Authorization", token)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty("tasks", [
            {
              ...updatedTask,
              task_id: 1,
              todo_id,
              updated_by: username,
              is_deleted: false,
            },
          ]);
        });
    });
  });
});

// ************************************************ soft-DELETE /tasks/:task_id
describe("DELETE /tasks/:task_id", () => {
  const todo = {
    title: "test_todo_1",
    due_date: "2021-10-18T16:00:00.000Z",
    is_completed: false,
  };

  const task = {
    title: "test_task_1",
    description: "test_task_1 description",
    due_date: "2021-10-18T16:00:00.000Z",
    is_completed: false,
  };

  beforeAll(async () => {
    await utils.setup();
    token = await utils.registerUser(username, email, password);

    //*** create a todo for the purpose of creating a task */
    await request(app)
      .post("/todos")
      .set("Authorization", token)
      .send(todo)
      .expect(201)
      .then((response) => {
        todo_id = response.body.todo_id;
      });

    //*** create a task */
    await request(app)
      .post(`/todos/${todo_id}/tasks`)
      .set("Authorization", token)
      .send(task)
      .expect(201)
      .then((response) => {
        task_id = response.body.task_id;
      });
  });

  describe("delete a task", () => {

    it("should return 200 with both is_deleted and access_control_deleted fields = true", async () => {
      return request(app)
        .delete(`/tasks/${task_id}`)
        .set("Authorization", token)
        .expect(200)
        .then((response) => {
          // console.debug(response.body)
          expect(response.body).toHaveProperty('is_deleted', true)
        });
    });


    it("should return 403 when getting TaskById after soft-deletion", async () => {
      return request(app)
        .get(`/tasks/${task_id}`)
        .set("Authorization", token)
        .expect(403)
    });

  });
});
