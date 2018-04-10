const conn = require('./connection');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');

const registerUser = async (user) => {
  const db = await conn.db;
  const coll = db.collection('users');

  try {
    user.password = await bcrypt.hash(user.password, 10);
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
}

module.exports = {
  registerUser,
  getUser,
  getUserById
};
