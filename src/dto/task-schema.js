const yup = require("yup");

const createTask = yup.object({
  body: yup.object({
    title: yup.string().trim().required("Title is required"),
    description: yup.string().trim().required("Description is required"),
    due_date: yup.date().default(function () {
      return new Date();
    }),
    is_completed: yup.boolean().default(false),
  }),
  params: yup.object({
    todo_id: yup
      .number("todo_id must be a number")
      .integer("todo_id must be an integer")
      .positive("todo_id must be positive")
      .required("todo_id is required"),
  }),
});

const updateTask = yup.object({
  body: yup.object({
    title: yup.string().trim().required("Title is required"),
    description: yup.string().trim().required("Description is required"),
    due_date: yup.date().default(function () {
      return new Date();
    }),
    is_completed: yup.boolean().default(false),
  }),
  params: yup.object({
    task_id: yup
      .number("task_id must be a number")
      .integer("task_id must be an integer")
      .positive("task_id must be positive")
      .required("task_id is required"),
  }),
});

const deleteTask = yup.object({
  params: yup.object({
    task_id: yup
      .number("task_id must be a number")
      .integer("task_id must be an integer")
      .positive("task_id must be positive")
      .required("task_id is required"),
  }),
});

const getTask = yup.object({
  params: yup.object({
    task_id: yup
      .number("task_id must be a number")
      .integer("task_id must be an integer")
      .positive("task_id must be positive")
      .required("task_id is required"),
  }),
});

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getTask,
};
