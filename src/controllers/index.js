const AccessControl = require("../models/access-control");
const Todo = require("../models/todo");
const Task = require("../models/task");
// const email = require('../services/email')

module.exports = (db, authService, amqpService) => {
  const controllers = {
    ...require("./auth")(authService, amqpService),
    ...require("./todos")(db, amqpService, AccessControl, Todo),
    ...require("./tasks")(db, Task),
  };

  return controllers;
};
