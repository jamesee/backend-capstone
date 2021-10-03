const schema = {
  ...require("./auth-schema"),
  ...require("./todo-schema"),
  ...require("./task-schema"),
};

module.exports = schema;
