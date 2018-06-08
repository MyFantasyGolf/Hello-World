'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var isNil = require('lodash/isNil');
var conn = require('./connection');
var moment = require('moment');

var saveTourSchedule = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(schedule) {
    var startDate, db, coll;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            startDate = moment(schedule.date.start, 'MM/DD/YYYY');
            _context.next = 3;
            return conn.db;

          case 3:
            db = _context.sent;
            coll = db.collection('schedules');


            try {
              coll.findOneAndUpdate({ year: schedule.year, title: schedule.title }, { ...schedule, key: schedule.title.toLowerCase().replace(/ /g, '') }, { upsert: true });
            } catch (err) {
              console.log(err.stack);
            }

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function saveTourSchedule(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getSchedules = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(season) {
    var db, coll, results;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return conn.db;

          case 2:
            db = _context2.sent;
            coll = db.collection('schedules');
            _context2.next = 6;
            return coll.find({ year: season }).toArray();

          case 6:
            results = _context2.sent;
            return _context2.abrupt('return', results);

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function getSchedules(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var getRoster = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(season) {
    var db, coll, results;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return conn.db;

          case 2:
            db = _context3.sent;
            coll = db.collection('players');
            _context3.next = 6;
            return coll.find({ year: parseInt(season) }).toArray();

          case 6:
            results = _context3.sent;
            return _context3.abrupt('return', results[0].players);

          case 8:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function getRoster(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var saveRoster = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(season, roster) {
    var db, coll;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return conn.db;

          case 2:
            db = _context4.sent;
            coll = db.collection('players');


            try {
              coll.findOneAndUpdate({ year: season }, { ...roster, year: season }, { upsert: true });
            } catch (err) {
              console.log(err.stack);
            }

          case 5:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function saveRoster(_x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();

var saveResults = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(schedule, results) {
    var db, coll;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return conn.db;

          case 2:
            db = _context5.sent;
            coll = db.collection('schedules');


            try {
              results.forEach(function (result) {

                coll.findOneAndUpdate({ year: schedule.year, key: schedule.key }, { $set: _defineProperty({}, 'results.' + result.key, { ...result }) }, { upsert: true });
              });
            } catch (err) {
              console.log(err.stack);
            }

          case 5:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function saveResults(_x6, _x7) {
    return _ref5.apply(this, arguments);
  };
}();

module.exports = {
  saveTourSchedule: saveTourSchedule,
  getSchedules: getSchedules,
  saveResults: saveResults,
  getRoster: getRoster,
  saveRoster: saveRoster
};
//# sourceMappingURL=resultsApi.js.map