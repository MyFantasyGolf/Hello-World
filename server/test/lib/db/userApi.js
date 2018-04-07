'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var conn = require('./connection');
var bcrypt = require('bcrypt');

var registerUser = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user) {
    var db, coll;
    return regeneratorRuntime.wrap(function _callee$(_context) {
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
            return bcrypt.hash(user.password, 10);

          case 7:
            user.password = _context.sent;
            _context.next = 10;
            return coll.ensureIndex('email', { unique: true });

          case 10:
            _context.next = 12;
            return coll.insertOne({ ...user });

          case 12:
            _context.next = 17;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context['catch'](4);

            console.log("User already exists");

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[4, 14]]);
  }));

  return function registerUser(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getUser = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(email) {
    var db, coll, user;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return conn.db;

          case 2:
            db = _context2.sent;
            coll = db.collection('users');
            _context2.prev = 4;
            _context2.next = 7;
            return coll.findOne({ email: email });

          case 7:
            user = _context2.sent;
            return _context2.abrupt('return', user);

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2['catch'](4);

            console.log("No user");

          case 14:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[4, 11]]);
  }));

  return function getUser(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = {
  registerUser: registerUser,
  getUser: getUser
};
//# sourceMappingURL=userApi.js.map