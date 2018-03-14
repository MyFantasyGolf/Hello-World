'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var isUndefined = require('lodash/isUndefined');

var connection = void 0;

var DBConnection = function () {
  function DBConnection() {
    _classCallCheck(this, DBConnection);

    if (isUndefined(connection)) {
      connection = this;
    }

    return connection;
  }

  _createClass(DBConnection, [{
    key: 'close',
    value: function close() {
      console.log('Closing DB...');

      if (!isUndefined(this.client)) {
        this.client.close();
      }
    }
  }, {
    key: 'db',
    get: function get() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (isUndefined(_this._db)) {
          MongoClient.connect('mongodb://localhost:27017', function (err, client) {
            _this._client = client;
            _this._db = connection.client.db('myfantasygolf');
            resolve(_this._db);
          });
        } else {
          resolve(_this._db);
        }
      });
    },
    set: function set(db) {
      this._db = db;
    }
  }, {
    key: 'client',
    get: function get() {
      return this._client;
    }
  }]);

  return DBConnection;
}();

var db = new DBConnection();
console.log('created db');

process.on('exit', function () {
  db.close();
});

module.exports = db;
//# sourceMappingURL=connection.js.map