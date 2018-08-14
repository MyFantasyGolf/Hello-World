'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var conn = require('./connection');
var moment = require('moment');
var isNil = require('lodash/isNil');
var isNumber = require('lodash/isNumber');
var cloneDeep = require('lodash/cloneDeep');
var season = require('../utils/season');
var leagueApi = require('./leagueApi');
var resultsApi = require('./resultsApi');
var ObjectId = require('mongodb').ObjectId;

var getLeaguesToUpdate = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(userId) {
    var userLeagues, leaguesToUpdate;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return leagueApi.getLeaguesForUser(userId);

          case 2:
            userLeagues = _context.sent;
            leaguesToUpdate = userLeagues.filter(function (league) {
              var lastUpdate = isNil(league.updated) ? moment('12-01-1970', 'MM-DD-YYYY') : moment(league.updated, 'MM-DD-YYYY');

              return moment().diff(lastUpdate, 'hours') > 23;
            });
            return _context.abrupt('return', leaguesToUpdate);

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getLeaguesToUpdate(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getSchedulesThatApply = function getSchedulesThatApply(leagueStarted, schedules) {

  var schedulesThatApply = schedules.filter(function (schedule) {
    var scheduleEnd = moment(schedule.date.end, 'MM/DD/YYYY');

    return scheduleEnd.isAfter(leagueStarted) && !isNil(schedule.results);
  });

  return schedulesThatApply;
};

var getScore = function getScore(lowestCut, golferResult) {

  if (isNil(golferResult) || isNil(golferResult.relativeScore) || isNaN(golferResult.relativeScore) || !isNumber(golferResult.relativeScore)) {
    return lowestCut + 1;
  }
  return golferResult.relativeScore;
};

var updateTeam = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(team, league, schedules) {
    var lastRoster;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            lastRoster = null;


            schedules.forEach(function (schedule) {

              if (isNil(team.activeMap)) {
                team.activeMap = {};
              }

              var activeRoster = team.activeMap[schedule.key];

              if (isNil(activeRoster)) {
                if (!isNil(lastRoster)) {
                  activeRoster = lastRoster;
                } else {
                  activeRoster = [];
                  for (var i = 0; i < league.activeGolfers && i < team.currentRoster.length; i++) {
                    activeRoster.push({ key: team.currentRoster[i].key });
                  }
                }
              }

              lastRoster = activeRoster;

              var lowestScore = schedule.complete === false ? 0 : Object.keys(schedule.results).reduce(function (min, key) {
                var golferResult = schedule.results[key];

                if (!isNumber(golferResult.relativeScore)) {
                  return min;
                }

                return golferResult.relativeScore > min ? golferResult.relativeScore : min;
              }, -100);

              activeRoster.forEach(function (golfer) {
                var golfer_results = !isNil(schedule) && !isNil(schedule.results) ? schedule.results[golfer.key] : null;

                golfer.score = getScore(lowestScore, golfer_results);
              });

              team.activeMap[schedule.key] = cloneDeep(activeRoster);
            });

            return _context2.abrupt('return', team);

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function updateTeam(_x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var updateLeague = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(league, schedules) {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            league.teams.forEach(function () {
              var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(team, index) {
                var newTeam;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return updateTeam(team, league, schedules);

                      case 2:
                        newTeam = _context3.sent;

                        league.teams[index] = newTeam;

                      case 4:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, undefined);
              }));

              return function (_x7, _x8) {
                return _ref4.apply(this, arguments);
              };
            }());

            return _context4.abrupt('return', league);

          case 2:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function updateLeague(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var update = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(userId) {
    var db, coll, leaguesToUpdate, schedules;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return conn.db;

          case 2:
            db = _context6.sent;
            coll = db.collection('leagues');
            _context6.next = 6;
            return getLeaguesToUpdate(userId);

          case 6:
            leaguesToUpdate = _context6.sent;
            _context6.next = 9;
            return resultsApi.getSchedules(season.getSeason(moment()));

          case 9:
            schedules = _context6.sent;


            leaguesToUpdate.forEach(function () {
              var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(empty_league) {
                var league, leagueStarted, schedulesThatApply, newLeague;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return leagueApi.getLeague(empty_league._id);

                      case 2:
                        league = _context5.sent;
                        leagueStarted = isNil(league.draft) || isNil(league.draft.completed) ? moment() : moment(league.draft.completed, 'MM-DD-YYYY');
                        schedulesThatApply = getSchedulesThatApply(leagueStarted, schedules);


                        schedulesThatApply.sort(function (s1, s2) {
                          var s1Start = moment(s1.date.end, 'MM/DD/YYYY');
                          var s2Start = moment(s1.date.end, 'MM/DD/YYYY');

                          if (s1Start.isBefore(s2Start)) {
                            return 1;
                          } else if (s2Start.isBefore(s1Start)) {
                            return -1;
                          }

                          return 0;
                        });

                        _context5.next = 8;
                        return updateLeague(league, schedulesThatApply);

                      case 8:
                        newLeague = _context5.sent;


                        console.log('O leagueUpdater: 142');
                        _context5.next = 12;
                        return coll.findOneAndUpdate({
                          '_id': ObjectId(league._id)
                        }, {
                          $set: { 'teams': newLeague.teams, updated: moment().format('MM-DD-YYYY') }
                        });

                      case 12:
                        console.log('D leagueUpdater: 142');

                        console.log('finished updating league. ' + league.name);

                      case 14:
                      case 'end':
                        return _context5.stop();
                    }
                  }
                }, _callee5, undefined);
              }));

              return function (_x10) {
                return _ref6.apply(this, arguments);
              };
            }());

          case 11:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function update(_x9) {
    return _ref5.apply(this, arguments);
  };
}();

module.exports = {
  update: update
};
//# sourceMappingURL=leagueUpdater.js.map