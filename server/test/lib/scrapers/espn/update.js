'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path');
var request = require('request');
var moment = require('moment');
var isNil = require('lodash/isNil');

var resultsApi = require('../../db/resultsApi');

var EspnUpdater = function () {
  function EspnUpdater() {
    _classCallCheck(this, EspnUpdater);
  }

  _createClass(EspnUpdater, [{
    key: 'update',
    value: function update(htmlFile) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.updateSchedules(htmlFile).then(function (schedules) {
          _this.updateScheduleDetails(schedules);
          resolve();
        });
      });
      // for each schedule fill in the details
    }
  }, {
    key: 'updateSchedules',
    value: function updateSchedules(htmlFile) {
      var _this2 = this;

      var promise = new Promise(function (resolve, reject) {
        var webSchedules = _this2.getSchedule(htmlFile);

        var savedSchedules = resultsApi.getSchedules().then(function (err, schedules) {
          var schedulesToFix = webSchedules.filter(function (ws) {
            if (isNil(schedules)) {
              return true;
            }

            var found = schedules.find(function (ss) {
              if (ss.date === ws.date && !isNil(ss.espnUrl)) {
                return ss.complete;
              }

              return false;
            });
          });

          // save these new schedules
          resultsApi.saveTourSchedule({ year: 2018 }, schedulesToFix);

          resolve(schedulesToFix);
        });
      });

      return promise;
    }
  }, {
    key: 'updateScheduleDetails',
    value: function updateScheduleDetails(schedules) {
      var _this3 = this;

      schedules.forEach(function (schedule) {
        var results = _this3.getScheduleResults(schedule);
      });
    }
  }, {
    key: 'getSchedule',
    value: function getSchedule(htmlFile) {
      var _this4 = this;

      var html = void 0;

      if (!isNil(htmlFile)) {
        var data = fs.readFileSync(htmlFile).toString();
        return this.scrapeSchdule(data);
      } else {
        request.get('http://www.espn.com/golf/schedule', function (err, response, body) {
          return _this4.scrapeSchdule(body);
        });
      }
    }
  }, {
    key: 'getScheduleResults',
    value: function getScheduleResults(schedule) {
      // request.get(schedule.espnUrl, (err, response, body) => {
      //   return this.scrapeScheduleResults(body);
      // });
    }
  }, {
    key: 'scrapeSchdule',
    value: function scrapeSchdule(html) {
      var _this5 = this;

      var $ = cheerio.load(html);
      var rows = $('tr');

      var season = $($('select option')[1]).text();

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
        if (tourney.length === 10 || tourney.length === 11) {
          var _date = _this5.sanitizeDate(season, tourney[1]);

          var t = {
            date: _date,
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
  }, {
    key: 'scrapeScheduleResults',
    value: function scrapeScheduleResults(resultsPage) {
      var _this6 = this;

      var $ = cheerio.load(resultsPage);
      var rows = $('.player-overview');
      var results = [];

      rows.each(function (index, row) {
        results.push(_this6.parseResultRow($, row));
      });

      return results;
    }
  }, {
    key: 'parseResultRow',
    value: function parseResultRow($, row) {
      // const name = $('.full-name', '', row).text();
      // const positionStr = $('.position', '', row).text();
      // const totalScore = $('.totalScore', '', row).text();
      // let officialAmountStr = $('.officialAmount', '', row).text();
      // const cupPoints = $('.cupPoints', '', row).text();
      // const round1 = $('.round1', '', row).text();
      // const round2 = $('.round2', '', row).text();
      // const round3 = $('.round3', '', row).text();
      // const round4 = $('.round4', '', row).text();
      // const relativeScore = $('.relativeScore', '', row).text();

      var name = row('.full-name').text();
      var positionStr = row('.position').text();
      var totalScore = row('.totalScore').text();
      var officialAmountStr = row('.officialAmount').text();
      var cupPoints = row('.cupPoints').text();
      var round1 = row('.round1').text();
      var round2 = row('.round2').text();
      var round3 = row('.round3').text();
      var round4 = row('.round4').text();
      var relativeScore = row('.relativeScore').text();

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