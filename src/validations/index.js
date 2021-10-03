const ApiError = require("../errors/api-error");
const ValidateDto = require("../middlewares/validate-dto");

module.exports = (schema) => {
  validations = {};

  validations.register = ValidateDto(schema.register, ApiError);
  validations.login = ValidateDto(schema.login, ApiError);

  validations.createTodo = ValidateDto(schema.createTodo, ApiError);
  validations.getTodo = ValidateDto(schema.getTodo, ApiError);
  validations.updateTodo = ValidateDto(schema.updateTodo, ApiError);
  validations.deleteTodo = ValidateDto(schema.deleteTodo, ApiError);
  validations.shareTodo = ValidateDto(schema.shareTodo, ApiError);

  validations.createTask = ValidateDto(schema.createTask, ApiError);
  validations.getTask = ValidateDto(schema.getTask, ApiError);
  validations.updateTask = ValidateDto(schema.updateTask, ApiError);
  validations.deleteTask = ValidateDto(schema.deleteTask, ApiError);


  return validations;
};
