'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var conn = require('./connection');
var ObjectId = require('mongodb').ObjectId;
var season = require('../utils/season');
var moment = require('moment');
var isNil = require('lodash/isNil');

var getActiveRosterMap = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(leagueId, userId) {
    var db, coll, map, myMap;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return conn.db;

          case 2:
            db = _context.sent;
            coll = db.collection('leagues');

            console.log('here with ' + leagueId + ' and ' + userId);

            _context.next = 7;
            return coll.findOne({
              '_id': ObjectId(leagueId),
              'season': season.getSeason(moment())
            }, {
              'teams.user': 1,
              'teams.currentRoster': 1,
              'teams.activeMap': 1,
              'teams.draftList': 0
            });

          case 7:
            map = _context.sent;
            myMap = map.teams.find(function (team) {
              return team.user === userId;
            });
            return _context.abrupt('return', myMap.activeMap);

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getActiveRosterMap(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var setActiveRosterMap = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(leagueId, userId, map) {
    var db, coll;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return conn.db;

          case 2:
            db = _context2.sent;
            coll = db.collection('leagues');
            _context2.next = 6;
            return coll.findOneAndUpdate({
              _id: ObjectId(leagueId),
              'teams.user': userId
            }, {
              $set: { 'teams.$.activeMap': map }
            });

          case 6:
            return _context2.abrupt('return', map);

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function setActiveRosterMap(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

var getGolfer = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(key) {
    var db, coll, year, player;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return conn.db;

          case 2:
            db = _context3.sent;
            coll = db.collection('players');
            year = season.getSeason(moment());
            _context3.next = 7;
            return coll.find({ 'year': year }).project({
              'players': {
                $elemMatch: { 'key': key }
              }
            }).toArray();

          case 7:
            player = _context3.sent;

            if (!(isNil(player) || player.length < 1)) {
              _context3.next = 10;
              break;
            }

            return _context3.abrupt('return', null);

          case 10:
            return _context3.abrupt('return', player[0].players[0]);

          case 11:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function getGolfer(_x6) {
    return _ref3.apply(this, arguments);
  };
}();

module.exports = {
  getActiveRosterMap: getActiveRosterMap,
  getGolfer: getGolfer,
  setActiveRosterMap: setActiveRosterMap
};
//# sourceMappingURL=rosterApi.js.map