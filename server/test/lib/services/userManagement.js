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

            if (!(isNil(user.email) || isNil(user.password) || isNil(user.name))) {
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

            if (!(isNil(login) || isNil(login.email) || isNil(login.password))) {
              _context2.next = 4;
              break;
            }

            response.status(401).send('Login failed');
            return _context2.abrupt('return');

          case 4:
            _context2.next = 6;
            return userMgmt.getUser(login.email);

          case 6:
            user = _context2.sent;

            if (!isNil(user)) {
              _context2.next = 10;
              break;
            }

            response.status(401).send('Login failed');
            return _context2.abrupt('return');

          case 10:
            if (!(user.state !== 'REGISTERED')) {
              _context2.next = 13;
              break;
            }

            response.status(401).send('User not registered');
            return _context2.abrupt('return');

          case 13:
            _context2.next = 15;
            return bcrypt.compare(login.password, user.password);

          case 15:
            success = _context2.sent;

            if (!(success !== true)) {
              _context2.next = 19;
              break;
            }

            response.status(401).send('Login failed');
            return _context2.abrupt('return');

          case 19:

            request.session.userId = user._id.toString();
            request.session.save();
            response.send(user);
            return _context2.abrupt('return');

          case 23:
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

var logout = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(request, response) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            request.session.userId = null;
            request.session.destroy();
            response.send();
            return _context3.abrupt('return');

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function logout(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var getUser = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(request, response) {
    var userId, user;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            userId = request.params.userId;


            if (isNil(userId)) {
              userId = request.session.userId;
            }

            if (!isNil(userId)) {
              _context4.next = 5;
              break;
            }

            response.status(500).send('ID does not exist');
            return _context4.abrupt('return');

          case 5:
            _context4.next = 7;
            return userMgmt.getUserById(userId);

          case 7:
            user = _context4.sent;

            response.send(user);
            return _context4.abrupt('return');

          case 10:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function getUser(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var getUsers = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(request, response) {
    var users;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return userMgmt.getUsers();

          case 2:
            users = _context5.sent;

            response.send(users);
            return _context5.abrupt('return');

          case 5:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function getUsers(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

module.exports = {
  registerUser: registerUser,
  login: login,
  logout: logout,
  getUser: getUser,
  getUsers: getUsers
};
//# sourceMappingURL=userManagement.js.map