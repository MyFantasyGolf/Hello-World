const conn = require('./connection');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');

const isNil = require('lodash/isNil');

const getUser = async (email) => {
  const db = await conn.db;
  const coll = db.collection('users');

  try {
    const user = await coll.findOne({'email': email});
    return user;
  }
  catch(err) {
    console.log("No user");
  }
};

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

    const existingUser = await getUser(user.email);

    if (isNil(existingUser)) {
      await coll.ensureIndex('email', { unique: true });
      await coll.insertOne({ ...user });
    }
    else {
      await coll.findOneAndUpdate({ email: user.email },
        {$set: {
          'state': user.state,
          'password': user.password,
          'name': user.name
        }});
    }
  }
  catch(err) {
    console.log("User already exists");
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
