
module.exports = (schema, ApiError) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.validate({ body: req.body, params: req.params});
      // replace request body with validated schema object
      // so that default values are applied to the DTO
      req.body = validated.body;
      return next();
    } catch (err) {
      return next(ApiError.badRequest(err));
    }
  };
}