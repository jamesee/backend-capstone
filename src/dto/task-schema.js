const yup = require("yup");

const createTask = yup.object().shape({
  title: yup.string().trim().required("Title is required"),
  description: yup.string().trim().required("Description is required"),
  due_date: yup.date().default(function () {
    return new Date();
  }),
  is_completed: yup.boolean().default(false),
});

const updateTask = yup.object().shape({
  title: yup.string().trim().required("Title is required"),
  description: yup.string().trim().required("Description is required"),
  due_date: yup.date().default(function () {
    return new Date();
  }),
  is_completed: yup.boolean().default(false),
});

module.exports = {
  createTask,
  updateTask,
};
