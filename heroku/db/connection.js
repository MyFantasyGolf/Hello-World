'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var isUndefined = require('lodash/isUndefined');
var isNil = require('lodash/isNil');

var connection = void 0;

var DBConnection = function () {
  function DBConnection() {
    (0, _classCallCheck3.default)(this, DBConnection);

    if (isUndefined(connection)) {
      connection = this;
    }

    return connection;
  }

  (0, _createClass3.default)(DBConnection, [{
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
          console.log(process.env.MFG_MONGO_URI);
          var DB_URL = isNil(process.env.MFG_MONGO_URI) ? 'mongodb://localhost:27017' : process.env.MFG_MONGO_URI;
          MongoClient.connect(DB_URL, { useNewUrlParser: true }, function (err, client) {
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