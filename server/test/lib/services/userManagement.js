'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var isNil = require('lodash/isNil');
var userMgmt = require('../db/userApi');
var bcrypt = require('bcrypt');

var registerUser = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, response) {
    var user;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user = request.body;

            if (!(isNil(user.email) || isNil(user.password))) {
              _context.next = 4;
              break;
            }

            response.status(500).send('Insufficient information to register.');
            return _context.abrupt('return');

          case 4:
            _context.next = 6;
            return userMgmt.registerUser(user);

          case 6:
            response.send();

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function registerUser(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var login = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(request, response) {
    var login, user, success;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            login = request.body;

            if (!(isNil(login.email) || isNil(login.password))) {
              _context2.next = 4;
              break;
            }

            response.status(401).send('Login failed.');
            return _context2.abrupt('return');

          case 4:
            _context2.next = 6;
            return userMgmt.getUser(login.email);

          case 6:
            user = _context2.sent;
            _context2.next = 9;
            return bcrypt.compare(login.password, user.password);

          case 9:
            success = _context2.sent;


            if (success !== true) {
              response.status(401).send('Login failed.');
            }

            request.session.userId = user._id;
            response.send();

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function login(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = {
  registerUser: registerUser,
  login: login
};
//# sourceMappingURL=userManagement.js.map