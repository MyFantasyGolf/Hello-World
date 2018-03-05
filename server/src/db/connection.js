const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const isUndefined = require('lodash/isUndefined');

let connection;

class DBConnection {
  constructor() {
    if (isUndefined(connection)) {
      connection = this;

      MongoClient.connect('mongodb://localhost:27017', (err, client) => {
        connection.client = client;
        connection.db = connection.client.db('myfantasygolf');
      });
    }

    return connection;
  }

  get db() {
    return this._db;
  }

  set db(db) {
    this._db = db;
  }

  close() {
    console.log('Closing DB...');
    this.client.close();
  }

  getSchedules() {
    const coll = this.db.collection('schedule');
    return coll.find({}).toArray();
  }
}

const db = new DBConnection();
console.log('created db');

process.on('exit', () => {
  db.close();
});

module.exports = {
  db
};
