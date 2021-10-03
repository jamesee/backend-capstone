const db = {
  ...require("./auth-schema"),
  ...require("./todo-schema"),
};

module.exports = db;
