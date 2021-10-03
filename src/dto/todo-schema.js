const yup = require("yup");

const createTodo = yup.object({
  body: yup.object({
    title: yup.string().trim().required("Title is required"),
    due_date: yup.date().default(function () {
      return new Date();
    }),
    is_completed: yup.boolean().default(false),
  })
});

const getTodo = yup.object({
  params: yup.object({
    todo_id: yup
      .number("todo_id must be a number")
      .integer("todo_id must be an integer")
      .positive("todo_id must be positive")
      .required("todo_id is required"),
  }),
});

const deleteTodo = yup.object({
  params: yup.object({
    todo_id: yup
      .number("todo_id must be a number")
      .integer("todo_id must be an integer")
      .positive("todo_id must be positive")
      .required("todo_id is required"),
  }),
});

const updateTodo = yup.object({
  body: yup.object({
    title: yup.string().trim().required("Title is required"),
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

const shareTodo = yup.object({
  body: yup.object({
    sharelist: yup.array().of(
      yup.object().shape({
        role: yup
          .string()
          .oneOf(["creator", "collaborator", "read-only"])
          .required("Role required"),
        email: yup
          .string()
          .required("Email required")
          .email("Enter valid email"),
      })
    ),
  }),
  params: yup.object({
    todo_id: yup
      .number("todo_id must be a number")
      .integer("todo_id must be an integer")
      .positive("todo_id must be positive")
      .required("todo_id is required"),
  }),
});

module.exports = {
  createTodo,
  getTodo,
  updateTodo,
  deleteTodo,
  shareTodo,
};
