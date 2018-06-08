'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var conn = require('./connection');
var ObjectId = require('mongodb').ObjectId;
var season = require('../utils/season');
var moment = require('moment');

var getActiveRosterMap = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(leagueId, userId) {
    var db, coll, map;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return conn.db;

          case 2:
            db = _context.sent;
            coll = db.collection('leagues');
            _context.next = 6;
            return coll.find({
              _id: ObjectId(leagueId),
              season: season.getSeason(moment())
            }).project({
              map: { $elemMatch: { user: userId } }
            });

          case 6:
            map = _context.sent;
            return _context.abrupt('return', map);

          case 8:
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

module.exports = {
  getActiveRosterMap: getActiveRosterMap
};
//# sourceMappingURL=rosterApi.js.map