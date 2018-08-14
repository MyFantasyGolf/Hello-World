'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var conn = require('./connection');
var ObjectId = require('mongodb').ObjectId;
var bcrypt = require('bcrypt');

var isNil = require('lodash/isNil');

var getUser = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(email) {
    var db, coll, user;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return conn.db;

          case 2:
            db = _context.sent;
            coll = db.collection('users');
            _context.prev = 4;
            _context.next = 7;
            return coll.findOne({ 'email': email });

          case 7:
            user = _context.sent;
            return _context.abrupt('return', user);

          case 11:
            _context.prev = 11;
            _context.t0 = _context['catch'](4);

            console.log("No user");

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[4, 11]]);
  }));

  return function getUser(_x) {
    return _ref.apply(this, arguments);
  };
}();

var registerUser = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(user) {
    var registered = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var db, coll, existingUser;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return conn.db;

          case 2:
            db = _context2.sent;
            coll = db.collection('users');
            _context2.prev = 4;

            if (registered === true) {
              user.state = 'REGISTERED';
            } else {
              user.state = 'UNREGISTERED';
            }

            if (isNil(user.password)) {
              _context2.next = 10;
              break;
            }

            _context2.next = 9;
            return bcrypt.hash(user.password, 10);

          case 9:
            user.password = _context2.sent;

          case 10:
            _context2.next = 12;
            return getUser(user.email);

          case 12:
            existingUser = _context2.sent;

            if (!isNil(existingUser)) {
              _context2.next = 20;
              break;
            }

            _context2.next = 16;
            return coll.createIndex('email', { unique: true });

          case 16:
            _context2.next = 18;
            return coll.insertOne({ ...user });

          case 18:
            _context2.next = 22;
            break;

          case 20:
            _context2.next = 22;
            return coll.findOneAndUpdate({ email: user.email }, { $set: {
                'state': user.state,
                'password': user.password,
                'name': user.name
              } });

          case 22:
            _context2.next = 27;
            break;

          case 24:
            _context2.prev = 24;
            _context2.t0 = _context2['catch'](4);

            console.log("User already exists");

          case 27:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[4, 24]]);
  }));

  return function registerUser(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

var getUserById = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(id) {
    var db, coll, user;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return conn.db;

          case 2:
            db = _context3.sent;
            coll = db.collection('users');
            _context3.prev = 4;
            _context3.next = 7;
            return coll.findOne({ _id: ObjectId(id) });

          case 7:
            user = _context3.sent;
            return _context3.abrupt('return', user);

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3['catch'](4);

            console.log("No user");

          case 14:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[4, 11]]);
  }));

  return function getUserById(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

var getUsers = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var db, coll, users;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return conn.db;

          case 2:
            db = _context4.sent;
            coll = db.collection('users');
            _context4.prev = 4;
            _context4.next = 7;
            return coll.find({}).toArray();

          case 7:
            users = _context4.sent;
            return _context4.abrupt('return', users);

          case 11:
            _context4.prev = 11;
            _context4.t0 = _context4['catch'](4);

            console.log("No users");

          case 14:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined, [[4, 11]]);
  }));

  return function getUsers() {
    return _ref4.apply(this, arguments);
  };
}();

module.exports = {
  registerUser: registerUser,
  getUser: getUser,
  getUserById: getUserById,
  getUsers: getUsers
};
//# sourceMappingURL=userApi.js.map