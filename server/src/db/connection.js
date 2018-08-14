const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const isUndefined = require('lodash/isUndefined');
const isNil = require('lodash/isNil');

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
        console.log(process.env.MFG_MONGO_URI);
        const DB_URL = isNil(process.env.MFG_MONGO_URI) ?
          'mongodb://localhost:27017' :
          process.env.MFG_MONGO_URI;
        MongoClient.connect(DB_URL, { useNewUrlParser: true }, (err, client) => {
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
