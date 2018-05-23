const conn = require('./connection');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');

const isNil = require('lodash/isNil');

const registerUser = async (user, registered = true) => {
  const db = await conn.db;
  const coll = db.collection('users');

  try {
    if (registered === true) {
      user.state = 'REGISTERED';
    }
    else {
      user.state = 'UNREGISTERED';
    }

    if (!isNil(user.password)) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    await coll.ensureIndex('email', { unique: true });
    await coll.insertOne({ ...user });
  }
  catch(err) {
    console.log("User already exists");
  }
};

const getUser = async (email) => {
  const db = await conn.db;
  const coll = db.collection('users');

  try {
    const user = await coll.findOne({email: email});
    return user;
  }
  catch(err) {
    console.log("No user");
  }
};

const getUserById = async (id) => {
  const db = await conn.db;
  const coll = db.collection('users');

  try {
    const user = await coll.findOne({_id: ObjectId(id)});
    return user;
  }
  catch(err) {
    console.log("No user");
  }
};

const getUsers = async () => {
  const db = await conn.db;
  const coll = db.collection('users');

  try {
    const users = await coll.find({}).toArray();
    return users;
  }
  catch(err) {
    console.log("No users");
  }
};

module.exports = {
  registerUser,
  getUser,
  getUserById,
  getUsers
};
