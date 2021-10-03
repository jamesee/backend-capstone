class ApiError {
  constructor(code, message) {
    this.message = message;
    this.code = code;
  }

  static badRequest(msg) {
    return new ApiError(400, msg);
  }

  static accessControlNotFound(msg) {
    return new ApiError(403, msg);
  }

  static internalServerError(msg){
    return new ApiError(500, msg);
  }

  static notFound(msg){
    return new ApiError(404, msg);
  }

}

module.exports = ApiError;
