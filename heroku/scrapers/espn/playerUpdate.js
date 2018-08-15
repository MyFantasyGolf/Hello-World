'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    (0, _classCallCheck3.default)(this, EspnPlayerUpdater);
  }

  (0, _createClass3.default)(EspnPlayerUpdater, [{
    key: 'shouldIUpdate',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var year, lastUpdated;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                year = season.getSeason(moment());
                _context.next = 3;
                return resultsApi.lastPlayerUpdate(year);

              case 3:
                lastUpdated = _context.sent;
                return _context.abrupt('return', moment().diff(lastUpdated, 'hours') > 23);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function shouldIUpdate() {
        return _ref.apply(this, arguments);
      }

      return shouldIUpdate;
    }()
  }, {
    key: 'updatePlayers',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var htmlFile = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
        var shouldUpdate, year, savedRoster, html, roster;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.shouldIUpdate();

              case 2:
                shouldUpdate = _context2.sent;

                if (!(shouldUpdate === false)) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt('return');

              case 5:
                year = season.getSeason(moment());
                _context2.next = 8;
                return resultsApi.getRoster(year);

              case 8:
                savedRoster = _context2.sent;

                if (!(!isNil(savedRoster) && savedRoster.length > 0)) {
                  _context2.next = 11;
                  break;
                }

                return _context2.abrupt('return');

              case 11:
                if (!isNil(htmlFile)) {
                  _context2.next = 17;
                  break;
                }

                _context2.next = 14;
                return this.downloadPlayerList();

              case 14:
                _context2.t0 = _context2.sent;
                _context2.next = 20;
                break;

              case 17:
                _context2.next = 19;
                return fs.readFileSync(htmlFile);

              case 19:
                _context2.t0 = _context2.sent;

              case 20:
                html = _context2.t0;
                roster = this.parseHtml(html);

                roster.year = year;

                resultsApi.saveRoster(year, roster);

                return _context2.abrupt('return', roster);

              case 25:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function updatePlayers() {
        return _ref2.apply(this, arguments);
      }

      return updatePlayers;
    }()
  }, {
    key: 'downloadPlayerList',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return asyncRequest('http://www.espn.com/golf/players');

              case 2:
                return _context3.abrupt('return', _context3.sent);

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function downloadPlayerList() {
        return _ref3.apply(this, arguments);
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