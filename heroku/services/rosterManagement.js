'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isNil = require('lodash/isNil');
var pgaService = require('./pgaService');
var draftApi = require('../db/draftApi');
var rosterApi = require('../db/rosterApi');

var getActiveRoster = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request, response) {
    var leagueId, userId, map;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            leagueId = request.params.leagueId;
            userId = request.session.userId;

            if (!(isNil(leagueId) || isNil(userId))) {
              _context.next = 5;
              break;
            }

            response.status(500).send('League and User session must both be vaild.');
            return _context.abrupt('return');

          case 5:
            _context.next = 7;
            return rosterApi.getActiveRosterMap(leagueId, userId);

          case 7:
            map = _context.sent;


            response.send({ map: map });

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getActiveRoster(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var setActiveRoster = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(request, response) {
    var leagueId, userId, map, newMap;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            leagueId = request.params.leagueId;
            userId = request.session.userId;
            map = request.body;

            if (!(isNil(leagueId) || isNil(userId) || isNil(map))) {
              _context2.next = 6;
              break;
            }

            response.status(500).send('League, active settings and User session must both be vaild.');
            return _context2.abrupt('return');

          case 6:
            _context2.next = 8;
            return rosterApi.setActiveRosterMap(leagueId, userId, map);

          case 8:
            newMap = _context2.sent;

            response.send(newMap);

          case 10:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function setActiveRoster(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = {
  getActiveRoster: getActiveRoster,
  setActiveRoster: setActiveRoster
};
//# sourceMappingURL=rosterManagement.js.map