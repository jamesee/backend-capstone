const AccessControl = require("../models/access-control");
const Todo = require("../models/todo");
const Task = require("../models/task");
// const email = require('../services/email')

module.exports = (db, authService, amqpService, ApiError) => {
  const controllers = {
    ...require("./auth")(authService, amqpService, ApiError),
    ...require("./todos")(db, amqpService, AccessControl, Todo, ApiError),
    ...require("./tasks")(db, Task, ApiError),
  };

  return controllers;
};
