'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path');
var request = require('request');
var asyncRequest = require('request-promise');
var moment = require('moment');
var sleep = require('sleep');
var isNil = require('lodash/isNil');

var season = require('../../utils/season');
var resultsApi = require('../../db/resultsApi');

var EspnUpdater = function () {
  function EspnUpdater() {
    _classCallCheck(this, EspnUpdater);
  }

  _createClass(EspnUpdater, [{
    key: 'update',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var html, schedulez;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return asyncRequest('http://www.espn.com/golf/schedule');

              case 2:
                html = _context.sent;
                _context.next = 5;
                return this.updateSchedules(html);

              case 5:
                schedulez = _context.sent;

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function update() {
        return _ref.apply(this, arguments);
      }

      return update;
    }()
  }, {
    key: 'updateSchedules',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(html) {
        var webSchedules, schedules, schedulesToFix;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                webSchedules = this.scrapeSchdule(html);
                _context2.next = 3;
                return resultsApi.getSchedules(webSchedules[0].year);

              case 3:
                schedules = _context2.sent;
                schedulesToFix = webSchedules.filter(function (ws) {
                  if (isNil(schedules)) {
                    return true;
                  }

                  var found = schedules.find(function (ss) {
                    if (ss.key === ws.title.toLowerCase().replace(/ /g, '')) {
                      return ss.complete;
                    }

                    return false;
                  });

                  return true;
                });

                // save these new schedules

                schedulesToFix.forEach(function (schedule) {
                  schedule.complete = false;
                  resultsApi.saveTourSchedule(schedule);
                });

                return _context2.abrupt('return', schedulesToFix);

              case 7:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function updateSchedules(_x) {
        return _ref2.apply(this, arguments);
      }

      return updateSchedules;
    }()

    /**
    Run through the schedules and try to fill in results for
    tournaments that have them.
    **/

  }, {
    key: 'updateResults',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var _this = this;

        var year, schedules;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                year = season.getSeason();
                _context4.next = 3;
                return resultsApi.getSchedules(year);

              case 3:
                schedules = _context4.sent;


                schedules.forEach(function () {
                  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(schedule) {
                    var html, results, sleeper;
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            if (!(schedule.complete === true || isNil(schedule.espnUrl))) {
                              _context3.next = 3;
                              break;
                            }

                            console.log('Skipping ' + schedule.title);
                            return _context3.abrupt('return');

                          case 3:

                            console.log('Retrieving results for ' + schedule.title);

                            _context3.next = 6;
                            return asyncRequest('http://espn.com' + schedule.espnUrl);

                          case 6:
                            html = _context3.sent;

                            if (isNil(html)) {
                              _context3.next = 16;
                              break;
                            }

                            results = _this.scrapeScheduleResults(html);
                            _context3.next = 11;
                            return resultsApi.saveResults(schedule, results);

                          case 11:
                            if (!moment(schedule.date.end, 'MM/DD/YYYY').isBefore(moment())) {
                              _context3.next = 16;
                              break;
                            }

                            schedule.complete = true;
                            _context3.next = 15;
                            return resultsApi.saveTourSchedule(schedule);

                          case 15:
                            console.log(schedule.title + ' successfully saved.');

                          case 16:
                            sleeper = parseInt(Math.random() * 3 + 1);

                            console.log('Sleeping for ' + sleeper + ' seconds.\n');
                            sleep.sleep(sleeper);

                          case 19:
                          case 'end':
                            return _context3.stop();
                        }
                      }
                    }, _callee3, _this);
                  }));

                  return function (_x2) {
                    return _ref4.apply(this, arguments);
                  };
                }());

              case 5:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function updateResults() {
        return _ref3.apply(this, arguments);
      }

      return updateResults;
    }()
  }, {
    key: 'scrapeSchdule',
    value: function scrapeSchdule(html) {
      var _this2 = this;

      var $ = cheerio.load(html);
      var rows = $('tr');

      var seasonString = $($('select option')[1]).text();

      var entries = [];

      rows.each(function (index, row) {
        var tds = $('td', '', row);

        var texts = tds.map(function (index, td) {

          var elm = td;

          if (td.children.length > 0 && td.children[0].name === 'b') {
            elm = td.children[0];
          }

          var a = $('a', '', elm);
          var arr = [];

          if (!isNil(a)) {
            arr.push(a.attr('href'));
          }

          if (elm.children.length > 1) {
            arr.push($(elm.children[0]).text());
            arr.push($(elm.children[2]).text());
          } else {
            arr.push($(td).text());
          }

          return arr;
        }).get();

        entries.push(texts);
      }).get();

      var tournaments = entries.filter(function (entry) {
        if (entry.length < 10) {
          return false;
        }

        if (entry[1] === 'DATE') {
          return false;
        }

        return true;
      }).map(function (tourney) {

        var date = _this2.sanitizeDate(seasonString, tourney[1]);
        var year = season.getSeason(moment(date.start, 'MM/DD/YYYY'));

        if (tourney.length === 10 || tourney.length === 11) {

          var t = {
            date: date,
            year: year,
            espnUrl: tourney[2],
            title: tourney[3],
            course: tourney[4],
            winner: tourney[6],
            score: tourney[8],
            purse: tourney[9]
          };

          if (tourney.length === 11) {
            t.winner = tourney[8];
            t.purse = tourney[10];
            t.score = '';
          }

          return t;
        }

        return {
          espnUrl: null,
          year: year,
          date: date,
          title: tourney[4],
          course: tourney[5],
          lastWinner: tourney[9],
          purse: tourney[11]
        };
      });

      return tournaments;
    }
  }, {
    key: 'sanitizeDate',
    value: function sanitizeDate(seasonText, dateString) {
      var years = seasonText.split('-');
      var startYear = parseInt(years[0]);
      var endYear = parseInt(years[1]);

      if (endYear < 2000) {
        endYear = endYear + 2000;
      }

      var days = dateString.split('-');

      var start = this.parseDate(days[0].trim(), startYear, endYear).format('MM/DD/YYYY');
      var end = this.parseDate(days[1].trim(), startYear, endYear).format('MM/DD/YYYY');

      return {
        start: start,
        end: end
      };
    }
  }, {
    key: 'parseDate',
    value: function parseDate(dateString, startYear, endYear) {
      var mDate = moment(dateString, 'MMM DD');

      // if it's between october and december its last year
      if (mDate.month() >= 9 && mDate.month() < 12) {
        mDate.year(startYear);
      } else {
        mDate.year(endYear);
      }

      return mDate;
    }

    /**
    This is where we look for the results of everything
    **/

  }, {
    key: 'scrapeScheduleResults',
    value: function scrapeScheduleResults(resultsPage) {
      var _this3 = this;

      var $ = cheerio.load(resultsPage);
      var rows = $('.player-overview');
      var results = [];

      rows.each(function (index, row) {
        results.push(_this3.parseResultRow($, row));
      });

      return results;
    }
  }, {
    key: 'parseResultRow',
    value: function parseResultRow($, row) {
      var name = $('.full-name', '', row).text();
      var positionStr = $('.position', '', row).text();
      var totalScore = $('.totalScore', '', row).text();
      var officialAmountStr = $('.officialAmount', '', row).text();
      var cupPoints = $('.cupPoints', '', row).text();
      var round1 = $('.round1', '', row).text();
      var round2 = $('.round2', '', row).text();
      var round3 = $('.round3', '', row).text();
      var round4 = $('.round4', '', row).text();
      var relativeScore = $('.relativeScore', '', row).text();

      // const name = row('.full-name').text();
      // const positionStr = row('.position').text();
      // const totalScore = row('.totalScore').text();
      // let officialAmountStr = row('.officialAmount').text();
      // const cupPoints = row('.cupPoints').text();
      // const round1 = row('.round1').text();
      // const round2 = row('.round2').text();
      // const round3 = row('.round3').text();
      // const round4 = row('.round4').text();
      // const relativeScore = row('.relativeScore').text();


      var nameArray = name.split(' ');
      var lastName = nameArray.pop();
      var firstName = nameArray.join(' ');
      var position = {
        tied: positionStr.startsWith('T'),
        pos: positionStr.startsWith('T') ? parseInt(positionStr.substr(1)) : positionStr
      };
      var rounds = [];

      !isNil(round1) && round1.trim().length !== 0 ? rounds.push(parseInt(round1)) : null;
      !isNil(round2) && round2.trim().length !== 0 ? rounds.push(parseInt(round2)) : null;
      !isNil(round3) && round3.trim().length !== 0 ? rounds.push(parseInt(round3)) : null;
      !isNil(round4) && round4.trim().length !== 0 ? rounds.push(parseInt(round4)) : null;

      officialAmountStr = officialAmountStr.replace(/,/g, '');
      officialAmountStr = officialAmountStr.replace(/\$/g, '');
      var officialAmount = parseFloat(officialAmountStr);

      return {
        firstName: firstName,
        lastName: lastName,
        key: firstName.toLowerCase().replace(/[\. ,:-]+/g, '') + '+' + lastName.toLowerCase().replace(/[\. ,:-]+/g, ''),
        totalScore: parseInt(totalScore),
        cupPoints: parseInt(cupPoints),
        relativeScore: parseInt(relativeScore),
        rounds: rounds,
        position: position,
        officialAmount: officialAmount
      };
    }
  }]);

  return EspnUpdater;
}();

module.exports = {
  EspnUpdater: EspnUpdater
};
//# sourceMappingURL=update.js.map