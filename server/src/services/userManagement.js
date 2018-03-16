const isNil = require('lodash/isNil');
const userMgmt = require('../db/userApi');
const bcrypt = require('bcrypt');

const registerUser = async (request, response) => {
  const user = request.body;

  if (
    isNil(user.email) ||
    isNil(user.password)
  ) {
    response.status(500).send('Insufficient information to register.');
    return;
  }

  // really register
  await userMgmt.registerUser(user);
  response.send();
};

const login = async (request, response) => {
  const login = request.body;

  if (
    isNil(login.email) ||
    isNil(login.password)
  ) {
    response.status(401).send('Login failed.');
    return;
  }

  const user = await userMgmt.getUser(login.email);

  const success = await bcrypt.compare(login.password, user.password);

  if (success !== true) {
    response.status(401).send('Login failed.');
  }

  request.session.userId = user._id;
  response.send();
};

module.exports = {
  registerUser,
  login
};
