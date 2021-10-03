const ApiError = require('../errors/api-error');

module.exports = (schema) => {
  return async (req, res, next) => {
    try {
      const validatedBody = await schema.validate(req.body);
      // replace request body with validated schema object
      // so that default values are applied to the DTO
      req.body = validatedBody;
      return next();
    } catch (err) {
      return next(ApiError.badRequest(err));
    }
  };
}