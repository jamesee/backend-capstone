module.exports = (authService, amqpService, ApiError) => {
  const controllers = {};

  controllers.register = async (req, res, next) => {
    const { username, email, password } = req.body;
    const token = await authService.registerUser(username, email, password);
    if (token) {
    //   await amqpService.publishRegistration({ email, username });
      res.send({ token: token });
    } else {
      next(ApiError.badRequest({ error: `Email ${email} already exists` }));
    }
  };

  controllers.login = async (req, res, next) => {
    const { email, password } = req.body;
    const token = await authService.loginUser(email, password);
    if (token) {
      res.send({ token: token });
    } else {
      next(ApiError.badRequest({ error: `Invalid login credentials` }));
    }
  };

  return controllers;
};
