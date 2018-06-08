'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var isNil = require('lodash/isNil');
var resultsApi = require('../db/resultsApi');
var season = require('../utils/season');
var moment = require('moment');

var getGolfers = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, response) {
    var season, golfers;
    return regeneratorRuntime.wrap(function _callee$(_context) {
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

module.exports = {
  getGolfers: getGolfers
};
//# sourceMappingURL=pgaService.js.map