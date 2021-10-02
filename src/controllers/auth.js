module.exports = (authService, amqpService) => {
  const controllers = {};

  function myValidate(data) {
    if (Object.keys(data).length !== 1) {
      return null;
    }

    let re = null;
    switch (Object.keys(data)[0]) {
      case "email":
        re =
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        break;
      case "password":
        re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/;
        break;
      default:
        re = null;
    }
    return re ? re.test(Object.values(data)[0]) : null;
  }

  controllers.register = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username) {
      res.status(400).json({ error: `Username is required.` });
      return;
    }

    if (!myValidate({ email })) {
      res.status(400).json({ error: `${email} is an invalid email address.` });
      return;
    }

    // if (!myValidate({password})) {
    //   res.status(400).json({ error: `Invalid password ! Password must be minimum 6 and maximum 20 characters, must contain at least one alphabet, special character and numeric.` })
    //   return
    // }

    const token = await authService.registerUser(username, email, password);
    if (token) {
      await amqpService.publishRegistration({ email, username });
      res.send({ token: token });
    } else {
      res.status(400).json({ error: `Email ${email} already exists` });
    }
  };

  controllers.login = async (req, res, next) => {
    const { email, password } = req.body;
    const token = await authService.loginUser(email, password);
    if (token) {
      res.send({ token: token });
    } else {
      res.status(400).send("Invalid login credentials");
    }
  };

  return controllers;
};
