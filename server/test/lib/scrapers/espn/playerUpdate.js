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
var isNil = require('lodash/isNil');

var season = require('../../utils/season');
var resultsApi = require('../../db/resultsApi');

var EspnPlayerUpdater = function () {
  function EspnPlayerUpdater() {
    _classCallCheck(this, EspnPlayerUpdater);
  }

  _createClass(EspnPlayerUpdater, [{
    key: 'updatePlayers',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var htmlFile = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
        var year, savedRoster, html, roster;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                year = season.getSeason(moment());
                _context.next = 3;
                return resultsApi.getRoster(year);

              case 3:
                savedRoster = _context.sent;

                if (!(!isNil(savedRoster) && savedRoster.length > 0)) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt('return');

              case 6:
                _context.next = 8;
                return isNil(htmlFile);

              case 8:
                if (!_context.sent) {
                  _context.next = 12;
                  break;
                }

                _context.t0 = this.downloadPlayerList();
                _context.next = 13;
                break;

              case 12:
                _context.t0 = fs.readFileSync(htmlFile);

              case 13:
                html = _context.t0;
                roster = this.parseHtml(html);

                roster.year = year;

                resultsApi.saveRoster(year, roster);

                return _context.abrupt('return', roster);

              case 18:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function updatePlayers() {
        return _ref.apply(this, arguments);
      }

      return updatePlayers;
    }()
  }, {
    key: 'downloadPlayerList',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return asyncRequest('http://www.espn.com/golf/players');

              case 2:
                return _context2.abrupt('return', _context2.sent);

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function downloadPlayerList() {
        return _ref2.apply(this, arguments);
      }

      return downloadPlayerList;
    }()
  }, {
    key: 'parsePlayer',
    value: function parsePlayer($, row) {
      var tds = $('td', '', row);
      var name = $('a', '', tds[0]).text().split(', ');
      var origin = $(tds[1]).text();

      var firstName = name[1];
      var lastName = name[0];
      var key = firstName.toLowerCase() + '+' + lastName.toLowerCase();

      return {
        key: key,
        firstName: firstName,
        lastName: lastName
      };
    }
  }, {
    key: 'parseHtml',
    value: function parseHtml(html) {
      var _this = this;

      var $ = cheerio.load(html);

      var oddrows = $('tr.oddrow');
      var evenrows = $('tr.evenrow');

      var oddPlayers = oddrows.map(function (index, row) {
        return _this.parsePlayer($, row);
      }).get();
      var evenPlayers = evenrows.map(function (index, row) {
        return _this.parsePlayer($, row);
      }).get();

      var players = oddPlayers.concat(evenPlayers);

      return {
        players: players
      };
    }
  }]);

  return EspnPlayerUpdater;
}();

module.exports = {
  EspnPlayerUpdater: EspnPlayerUpdater
};
//# sourceMappingURL=playerUpdate.js.map