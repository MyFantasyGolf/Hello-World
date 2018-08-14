'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isNil = require('lodash/isNil');
var resultsApi = require('../db/resultsApi');
var rosterApi = require('../db/rosterApi');
var season = require('../utils/season');
var moment = require('moment');

var getGolfers = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request, response) {
    var season, golfers;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            season = isNil(request.params.season) ? season.getSeason(moment()) : request.params.season;
            _context.next = 3;
            return resultsApi.getRoster(season);

          case 3:
            golfers = _context.sent;


            response.send(golfers);

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getGolfers(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var getGolfer = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(request, response) {
    var playerId, golfer;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            playerId = request.params.key;
            _context2.next = 3;
            return rosterApi.getGolfer(playerId);

          case 3:
            golfer = _context2.sent;


            response.send(golfer);

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function getGolfer(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var getSchedule = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(request, response) {
    var season, schedule;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            season = isNil(request.params.season) ? season.getSeason(moment()) : request.params.season;
            _context3.next = 3;
            return resultsApi.getSchedules(season);

          case 3:
            schedule = _context3.sent;


            response.send(schedule);

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function getSchedule(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

module.exports = {
  getGolfers: getGolfers,
  getGolfer: getGolfer,
  getSchedule: getSchedule
};
//# sourceMappingURL=pgaService.js.map