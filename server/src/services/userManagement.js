const isNil = require('lodash/isNil');
const userMgmt = require('../db/userApi');
const bcrypt = require('bcrypt');


const registerUser = async (request, response) => {
  const user = request.body;

  if (
    isNil(user.email) ||
    isNil(user.password) ||
    isNil(user.firstName)
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
    isNil(login) ||
    isNil(login.email) ||
    isNil(login.password)
  ) {
    response.status(401).send('Login failed');
    return;
  }

  const user = await userMgmt.getUser(login.email);

  if (isNil(user)) {
    response.status(401).send('Login failed');
    return;
  }

  const success = await bcrypt.compare(login.password, user.password);

  if (success !== true) {
    response.status(401).send('Login failed');
    return;
  }

  request.session.userId = user._id.toString();
  request.session.save();
  response.send(user);
  return;
};

const logout = async (request, response) => {
  request.session.userId = null;
  request.session.destroy();
  response.send();
  return;
};

const getUser = async (request, response) => {
  let userId = request.params.userId;

  if (isNil(userId)) {
    userId = request.session.userId;
  }

  if (isNil(userId)) {
    response.status(500).send('ID does not exist');
    return;
  }

  const user = await userMgmt.getUserById(userId);
  response.send(user);
  return;
};

module.exports = {
  registerUser,
  login,
  logout,
  getUser
};
