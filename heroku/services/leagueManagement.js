'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isNil = require('lodash/isNil');
var leagueApi = require('../db/leagueApi');
var draftApi = require('../db/draftApi');

var getMyLeagues = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request, response) {
    var userId, leagues;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            userId = request.session.userId;
            _context.next = 3;
            return leagueApi.getLeaguesForUser(userId);

          case 3:
            leagues = _context.sent;


            response.send({ leagues: leagues });

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getMyLeagues(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var getLeagueSchedules = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(request, response) {
    var leagueId, schedules;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            leagueId = request.params.leagueId;
            _context2.next = 3;
            return leagueApi.getLeagueSchedules(leagueId);

          case 3:
            schedules = _context2.sent;

            response.send({ schedules: schedules });

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function getLeagueSchedules(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var getMyInvitations = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(request, response) {
    var userId, invites;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            userId = request.session.userId;
            _context3.next = 3;
            return leagueApi.getLeagueInvitations(userId);

          case 3:
            invites = _context3.sent;

            response.send({ leagues: invites });

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function getMyInvitations(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var acceptInvitation = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(request, response) {
    var userId, leagueId, teamName;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            userId = request.session.userId;
            leagueId = request.params.leagueId;
            teamName = request.params.teamName;
            _context4.next = 5;
            return leagueApi.acceptInvitation(userId, leagueId, teamName);

          case 5:
            response.send({ 'status': 'success' });

          case 6:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function acceptInvitation(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var declineInvitation = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(request, response) {
    var userId, leagueId;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            userId = request.session.userId;
            leagueId = request.params.leagueId;
            _context5.next = 4;
            return leagueApi.declineInvitation(userId, leagueId);

          case 4:
            response.send({ 'status': 'success' });

          case 5:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function declineInvitation(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

var getLeague = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(request, response) {
    var leagueId, league;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            leagueId = request.params.leagueId;
            _context6.next = 3;
            return leagueApi.getLeague(leagueId);

          case 3:
            league = _context6.sent;


            response.send({ league: league });

          case 5:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function getLeague(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

var createLeague = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(request, response) {
    var league;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            league = request.body;

            if (!(isNil(league.name) || isNil(league.commissioner))) {
              _context7.next = 4;
              break;
            }

            response.status(500).send('A league name and commissioner are required.');
            return _context7.abrupt('return');

          case 4:
            _context7.next = 6;
            return leagueApi.saveLeague(league);

          case 6:
            response.send({ status: 'success' });

          case 7:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function createLeague(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

var getAvailablePlayers = function () {
  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(request, response) {
    var leagueId, players;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            leagueId = request.params.leagueId;

            if (!isNil(leagueId)) {
              _context8.next = 4;
              break;
            }

            response.status(500).send('Invalid league ID.');
            return _context8.abrupt('return');

          case 4:
            _context8.next = 6;
            return leagueApi.getAvailablePlayers(leagueId);

          case 6:
            players = _context8.sent;

            response.send({ players: players });

          case 8:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  }));

  return function getAvailablePlayers(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

var getDraft = function () {
  var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(request, response) {
    var leagueId, draft;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            leagueId = request.params.leagueId;

            if (!isNil(leagueId)) {
              _context9.next = 4;
              break;
            }

            response.status(500).send('League ID required');
            return _context9.abrupt('return');

          case 4:
            _context9.next = 6;
            return draftApi.getDraft(leagueId);

          case 6:
            draft = _context9.sent;

            response.send(draft);

          case 8:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  }));

  return function getDraft(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

var getDraftList = function () {
  var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(request, response) {
    var leagueId, teamId, players;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            leagueId = request.params.leagueId;
            teamId = request.session.userId;

            if (!(isNil(leagueId) || isNil(teamId) || leagueId === 'undefined')) {
              _context10.next = 5;
              break;
            }

            response.status(500).send('Insufficient information provided.');
            return _context10.abrupt('return');

          case 5:
            _context10.next = 7;
            return draftApi.getDraftList(leagueId, teamId);

          case 7:
            players = _context10.sent;

            response.send({ players: players });

          case 9:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, undefined);
  }));

  return function getDraftList(_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();

var updateDraftList = function () {
  var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(request, response) {
    var newList, leagueId, userId;
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            newList = request.body.draftList;
            leagueId = request.params.leagueId;
            userId = request.session.userId;

            if (!(isNil(userId) || isNil(leagueId))) {
              _context11.next = 6;
              break;
            }

            response.send(500).send('Insufficient information provided.');
            return _context11.abrupt('return');

          case 6:
            _context11.next = 8;
            return draftApi.updateDraftList(leagueId, userId, newList);

          case 8:
            response.send({ 'status': 'Success' });

          case 9:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, undefined);
  }));

  return function updateDraftList(_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}();

var startDraft = function () {
  var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(request, response) {
    var leagueId, draftOptions;
    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            leagueId = request.params.leagueId;
            draftOptions = request.body.draftOptions;

            if (!(isNil(draftOptions) || isNil(leagueId))) {
              _context12.next = 5;
              break;
            }

            response.status(500).send('Not enough information to start draft');
            return _context12.abrupt('return');

          case 5:
            _context12.next = 7;
            return draftApi.startDraft(leagueId, draftOptions);

          case 7:
            response.send({ 'status': 'Success' });

          case 8:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, undefined);
  }));

  return function startDraft(_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}();

var getDraftStatus = function () {
  var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(request, response) {
    var leagueId, status;
    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            leagueId = request.params.leagueId;

            if (!isNil(leagueId)) {
              _context13.next = 4;
              break;
            }

            response.status(500).send('Not a valid league ID');
            return _context13.abrupt('return');

          case 4:
            _context13.next = 6;
            return draftApi.draftStatus(leagueId);

          case 6:
            status = _context13.sent;

            response.send(status);
            return _context13.abrupt('return');

          case 9:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, undefined);
  }));

  return function getDraftStatus(_x25, _x26) {
    return _ref13.apply(this, arguments);
  };
}();

var makeDraftPick = function () {
  var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(request, response) {
    var leagueId, round, pick, selection;
    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            leagueId = request.params.leagueId;
            round = request.params.round;
            pick = request.params.pick;
            selection = request.body;

            if (!(isNil(leagueId) || isNil(round) || isNil(pick) || isNil(selection))) {
              _context14.next = 7;
              break;
            }

            response.status(500).send('Not enough information to make a valid pick.');
            return _context14.abrupt('return');

          case 7:
            _context14.next = 9;
            return draftApi.makePick(leagueId, parseInt(round) - 1, parseInt(pick) - 1, selection);

          case 9:
            response.send({ 'status': 'success' });

          case 10:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, undefined);
  }));

  return function makeDraftPick(_x27, _x28) {
    return _ref14.apply(this, arguments);
  };
}();

module.exports = {
  getMyLeagues: getMyLeagues,
  getAvailablePlayers: getAvailablePlayers,
  getLeague: getLeague,
  createLeague: createLeague,
  getDraftList: getDraftList,
  updateDraftList: updateDraftList,
  startDraft: startDraft,
  getDraft: getDraft,
  getDraftStatus: getDraftStatus,
  makeDraftPick: makeDraftPick,
  getMyInvitations: getMyInvitations,
  acceptInvitation: acceptInvitation,
  declineInvitation: declineInvitation,
  getLeagueSchedules: getLeagueSchedules
};
//# sourceMappingURL=leagueManagement.js.map