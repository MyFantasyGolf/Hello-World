'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var isNil = require('lodash/isNil');
var rosterApi = require('../db/rosterApi');

var getActiveRoster = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, response) {
    var leagueId, userId, map;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            leagueId = request.params.leagueId;
            userId = request.session.userId;

            if (!(isNil(leagueId) || isNil(userId))) {
              _context.next = 5;
              break;
            }

            response.status(500).send('League and User session must both be vaild.');
            return _context.abrupt('return');

          case 5:
            _context.next = 7;
            return rosterApi.getActiveRosterMap(leagueId, userId);

          case 7:
            map = _context.sent;


            response.send({ map: map });

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getActiveRoster(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = {
  getActiveRoster: getActiveRoster
};
//# sourceMappingURL=rosterManagement.js.map