const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const isUndefined = require('lodash/isUndefined');

let connection;

class DBConnection {
  constructor() {
    if (isUndefined(connection)) {
      connection = this;
    }

    return connection;
  }

  get db() {
    return new Promise( (resolve, reject) => {
      if (isUndefined(this._db)) {
        MongoClient.connect('mongodb://localhost:27017', (err, client) => {
          this._client = client;
          this._db = connection.client.db('myfantasygolf');
          resolve(this._db);
        });
      }
      else {
        resolve(this._db);
      }
    });
  }

  set db(db) {
    this._db = db;
  }

  get client() {
    return this._client;
  }

  close() {
    console.log('Closing DB...');

    if (!isUndefined(this.client)) {
      this.client.close();
    }
  }
}

const db = new DBConnection();
console.log('created db');

process.on('exit', () => {
  db.close();
});

module.exports = db;
