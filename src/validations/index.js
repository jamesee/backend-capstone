const ApiError = require("../errors/api-error");
const ValidateDto = require("../middlewares/validate-dto");

module.exports = (schema) => {
  validations = {};

  validations.register = ValidateDto(schema.register, ApiError);
  validations.login = ValidateDto(schema.login, ApiError);

  validations.createTodo = ValidateDto(schema.createTodo, ApiError);
  validations.updateTodo = ValidateDto(schema.updateTodo, ApiError);
  validations.shareTodo = ValidateDto(schema.shareTodo, ApiError);

  return validations;
};
