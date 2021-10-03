const yup = require("yup");


const createTodo = yup.object().shape({
  title: yup.string().trim().required("Title is required"),
  due_date: yup.date().default(function () {
    return new Date();
  }),
  is_completed: yup.boolean().default(false),
});

const updateTodo = yup.object().shape({
  title: yup.string().trim().required("Title is required"),
  due_date: yup.date().default(function () {
    return new Date();
  }),
  is_completed: yup.boolean().default(false),
});

const shareTodo = yup.object().shape({
  sharelist: yup.array().of(
    yup.object().shape({
      role: yup.string().oneOf(['creator', 'collaborator','read-only']).required("Role required"),
      email: yup.string().required("email required").email("Enter valid email"),
    })
  ),
});

module.exports = {
  createTodo,
  updateTodo,
  shareTodo,
};
