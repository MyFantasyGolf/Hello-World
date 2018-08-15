'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isNil = require('lodash/isNil');
var conn = require('./connection');
var moment = require('moment');

var lastPlayerUpdate = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(season) {
    var db, coll, roster, lastDate;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return conn.db;

          case 2:
            db = _context.sent;
            coll = db.collection('players');
            _context.next = 6;
            return coll.findOne({
              year: season
            }, {
              updated: 1
            });

          case 6:
            roster = _context.sent;
            lastDate = isNil(roster) || isNil(roster.updated) ? moment('12-01-1970', 'MM-DD-YYYY') : moment(roster.updated, 'MM-DD-YYYY HH:mm');
            return _context.abrupt('return', lastDate);

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function lastPlayerUpdate(_x) {
    return _ref.apply(this, arguments);
  };
}();

var lastScheduleUpdate = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(season) {
    var db, coll, updated, lastDate;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return conn.db;

          case 2:
            db = _context2.sent;
            coll = db.collection('schedule_update');
            _context2.next = 6;
            return coll.findOne({
              year: season
            });

          case 6:
            updated = _context2.sent;
            lastDate = isNil(updated) || isNil(updated.updated) ? moment('12-01-1970', 'MM-DD-YYYY') : moment(updated.updated, 'MM-DD-YYYY HH:mm');
            return _context2.abrupt('return', lastDate);

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function lastScheduleUpdate(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var schedulesUpdated = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(season) {
    var db, coll;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return conn.db;

          case 2:
            db = _context3.sent;
            coll = db.collection('schedule_update');


            coll.findOneAndUpdate({
              year: season
            }, {
              $set: {
                updated: moment().format('MM-DD-YYYY HH:mm'),
                year: season
              }
            }, { upsert: true });

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function schedulesUpdated(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var saveTourSchedule = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(schedule) {
    var startDate, db, coll;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            startDate = moment(schedule.date.start, 'MM/DD/YYYY');
            _context4.next = 3;
            return conn.db;

          case 3:
            db = _context4.sent;
            coll = db.collection('schedules');


            try {
              coll.findOneAndUpdate({ year: schedule.year, title: schedule.title }, { $set: {
                  ...schedule,
                  key: schedule.title.toLowerCase().replace(/ /g, '').replace(/\./g, '_')
                }
              }, { upsert: true });
            } catch (err) {
              console.log(err.stack);
            }

          case 6:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function saveTourSchedule(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

var getSchedules = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(season) {
    var truncate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var db, coll, scheduleList;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return conn.db;

          case 2:
            db = _context5.sent;
            coll = db.collection('schedules');

            if (!(truncate === false)) {
              _context5.next = 8;
              break;
            }

            _context5.next = 7;
            return coll.find({ year: season }).toArray();

          case 7:
            return _context5.abrupt('return', _context5.sent);

          case 8:
            _context5.next = 10;
            return coll.find({ year: season }, { results: 0 }).toArray();

          case 10:
            scheduleList = _context5.sent;


            scheduleList.sort(function (a, b) {
              var aEnd = moment(a.date.end, 'MM/DD/YYYY');
              var bEnd = moment(b.date.end, 'MM/DD/YYYY');

              if (aEnd.isBefore(bEnd)) {
                return 1;
              }

              return -1;
            });

            return _context5.abrupt('return', scheduleList);

          case 13:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function getSchedules(_x6) {
    return _ref5.apply(this, arguments);
  };
}();

var getRoster = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(season) {
    var db, coll, results;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return conn.db;

          case 2:
            db = _context6.sent;
            coll = db.collection('players');
            _context6.next = 6;
            return coll.find({ year: parseInt(season) }).toArray();

          case 6:
            results = _context6.sent;
            return _context6.abrupt('return', isNil(results[0]) ? [] : results[0].players);

          case 8:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function getRoster(_x7) {
    return _ref6.apply(this, arguments);
  };
}();

var saveRoster = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(season, roster) {
    var db, coll;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return conn.db;

          case 2:
            db = _context7.sent;
            coll = db.collection('players');


            try {
              coll.findOneAndUpdate({ year: season }, { $set: {
                  ...roster,
                  year: season,
                  updated: moment().format('MM-DD-YYYY HH:mm')
                }
              }, { upsert: true });
            } catch (err) {
              console.log(err.stack);
            }

          case 5:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function saveRoster(_x8, _x9) {
    return _ref7.apply(this, arguments);
  };
}();

var saveResults = function () {
  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(schedule, results) {
    var db, coll, globalResultObject, outcome;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return conn.db;

          case 2:
            db = _context9.sent;
            coll = db.collection('schedules');
            _context9.prev = 4;
            globalResultObject = {};

            results.forEach(function () {
              var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(result) {
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        globalResultObject[result.key] = result;

                      case 1:
                      case 'end':
                        return _context8.stop();
                    }
                  }
                }, _callee8, undefined);
              }));

              return function (_x12) {
                return _ref9.apply(this, arguments);
              };
            }());

            if (moment(schedule.date.end, 'MM/DD/YYYY').isBefore(moment())) {
              schedule.complete = true;
              console.log(schedule.title + ' is complete.');
            }

            _context9.next = 10;
            return coll.findOneAndUpdate({ year: schedule.year, key: schedule.key }, { $set: { 'results': globalResultObject, 'complete': schedule.complete } }, { upsert: true, w: 1 });

          case 10:
            outcome = _context9.sent;


            console.log('Saved: ' + schedule.key);
            _context9.next = 17;
            break;

          case 14:
            _context9.prev = 14;
            _context9.t0 = _context9['catch'](4);

            console.log(_context9.t0.stack);

          case 17:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined, [[4, 14]]);
  }));

  return function saveResults(_x10, _x11) {
    return _ref8.apply(this, arguments);
  };
}();

module.exports = {
  saveTourSchedule: saveTourSchedule,
  getSchedules: getSchedules,
  saveResults: saveResults,
  getRoster: getRoster,
  saveRoster: saveRoster,
  lastPlayerUpdate: lastPlayerUpdate,
  lastScheduleUpdate: lastScheduleUpdate,
  schedulesUpdated: schedulesUpdated
};
//# sourceMappingURL=resultsApi.js.map