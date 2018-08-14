'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var conn = require('./connection');
var season = require('../utils/season');
var moment = require('moment');
var isNil = require('lodash/isNil');
var shuffle = require('lodash/shuffle');
var ObjectId = require('mongodb').ObjectId;
var Cache = require('timed-cache');

var leagueApi = require('./leagueApi');

var draftCache = new Cache({ defaultTtl: 10 * 60 * 1000 });

var getDraft = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(leagueId) {
    var db, coll, draft;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return conn.db;

          case 2:
            db = _context.sent;
            coll = db.collection('leagues');
            _context.prev = 4;
            _context.next = 7;
            return coll.find({
              '_id': ObjectId(leagueId),
              'season': season.getSeason(moment())
            }, {
              projection: { draft: 1 }
            }).toArray();

          case 7:
            draft = _context.sent;
            return _context.abrupt('return', draft[0].draft);

          case 11:
            _context.prev = 11;
            _context.t0 = _context['catch'](4);

            console.log('Error get the draft for ' + leagueId + ': ' + _context.t0);

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[4, 11]]);
  }));

  return function getDraft(_x) {
    return _ref.apply(this, arguments);
  };
}();

var updateDraft = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(leagueId, draft) {
    var db, coll;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return conn.db;

          case 2:
            db = _context2.sent;
            coll = db.collection('leagues');
            _context2.prev = 4;
            _context2.next = 7;
            return coll.findOneAndUpdate({
              '_id': ObjectId(leagueId),
              'season': season.getSeason(moment())
            }, { $set: { 'draft': draft } });

          case 7:
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2['catch'](4);

            console.log('Error saving draft for league ' + legaueId);

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[4, 9]]);
  }));

  return function updateDraft(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var getDraftList = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(leagueId, userId) {
    var db, coll, list, availablePlayers, filteredList;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return conn.db;

          case 2:
            db = _context3.sent;
            coll = db.collection('leagues');
            _context3.prev = 4;
            _context3.next = 7;
            return coll.find({
              '_id': ObjectId(leagueId),
              'season': season.getSeason(moment())
            }).project({
              teams: { $elemMatch: { "user": userId } }
            }).toArray();

          case 7:
            list = _context3.sent;
            _context3.next = 10;
            return leagueApi.getAvailablePlayers(leagueId);

          case 10:
            availablePlayers = _context3.sent;
            filteredList = list[0].teams[0].draftList.filter(function (player) {
              var index = availablePlayers.findIndex(function (ap) {
                return ap.key === player.key;
              });

              return index !== -1;
            });
            return _context3.abrupt('return', filteredList);

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3['catch'](4);

            console.log('Error getting draft list for ' + userId + ': ' + _context3.t0);

          case 18:
            return _context3.abrupt('return', []);

          case 19:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[4, 15]]);
  }));

  return function getDraftList(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

var updateDraftList = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(leagueId, userId, draftList) {
    var db, coll;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return conn.db;

          case 2:
            db = _context4.sent;
            coll = db.collection('leagues');
            _context4.next = 6;
            return coll.update({
              '_id': ObjectId(leagueId),
              'season': season.getSeason(moment()),
              'teams.user': userId
            }, {
              '$set': {
                'teams.$.draftList': draftList
              }
            });

          case 6:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function updateDraftList(_x6, _x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var buildRounds = function buildRounds(draftOptions) {

  var rounds = [];

  for (var i = 0; i < draftOptions.numberOfRounds; i++) {
    var order = [];

    if (draftOptions.draftOrderType === 'normal') {
      order = draftOptions.draftOrder;
    } else if (draftOptions.draftOrderType === 'serpentine') {
      if (i !== 0) {
        draftOptions.draftOrder.reverse();
      }

      order = draftOptions.draftOrder;
    } else {
      order = shuffle(draftOptions.draftOrder);
    }

    var picks = order.map(function (team) {
      return {
        team: team.user,
        pick: null
      };
    });

    rounds.push(picks);
  }

  return rounds;
};

var startDraft = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(leagueId, draftOptions) {
    var db, coll, rounds;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return conn.db;

          case 2:
            db = _context5.sent;
            coll = db.collection('leagues');
            rounds = buildRounds(draftOptions);
            _context5.next = 7;
            return coll.update({
              '_id': ObjectId(leagueId),
              'season': season.getSeason(moment())
            }, { '$set': {
                draft: {
                  settings: draftOptions,
                  state: 'INPROGRESS',
                  rounds: rounds
                }
              }
            });

          case 7:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function startDraft(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

var draftStatus = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(leagueId) {
    var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var myDraftStatus, draft, roundIndex, whosUpIndex, newStatus;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            // is it in Cache
            myDraftStatus = draftCache.get(leagueId);

            if (!(!isNil(myDraftStatus) && force === false)) {
              _context6.next = 3;
              break;
            }

            return _context6.abrupt('return', myDraftStatus);

          case 3:
            _context6.next = 5;
            return getDraft(leagueId);

          case 5:
            draft = _context6.sent;

            if (!(isNil(draft) || draft.state === 'PREDRAFT' || draft.state === 'FINISHED')) {
              _context6.next = 8;
              break;
            }

            return _context6.abrupt('return', { draft: draft });

          case 8:
            roundIndex = draft.rounds.findIndex(function (round) {
              var hasEmptyPick = round.find(function (pick) {
                return isNil(pick.pick);
              });

              return !isNil(hasEmptyPick);
            });

            // draft is over

            if (!(roundIndex === -1)) {
              _context6.next = 16;
              break;
            }

            draft.state = 'FINISHED';
            draft.completed = moment().format('MM-DD-YYYY');
            draftCache.remove(leagueId);
            _context6.next = 15;
            return updateDraft(leagueId, draft);

          case 15:
            return _context6.abrupt('return', { draft: draft });

          case 16:
            whosUpIndex = draft.rounds[roundIndex].findIndex(function (picks) {
              return isNil(picks.pick);
            });
            newStatus = {
              round: roundIndex + 1,
              pick: whosUpIndex + 1,
              currentPick: draft.rounds[roundIndex][whosUpIndex].team,
              draft: draft
            };


            draftCache.put(leagueId, newStatus);
            return _context6.abrupt('return', newStatus);

          case 20:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function draftStatus(_x12) {
    return _ref6.apply(this, arguments);
  };
}();

var makePick = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(leagueId, round, pick, selection) {
    var draft, league, teamIndex, currentStatus;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return getDraft(leagueId);

          case 2:
            draft = _context7.sent;

            draft.rounds[round][pick].pick = selection;

            _context7.next = 6;
            return updateDraft(leagueId, draft);

          case 6:
            _context7.next = 8;
            return leagueApi.getLeague(leagueId);

          case 8:
            league = _context7.sent;
            teamIndex = league.teams.findIndex(function (team) {
              return team.user === draft.rounds[round][pick].team;
            });


            league.teams[teamIndex].currentRoster.push(selection);

            _context7.next = 13;
            return leagueApi.saveLeague(league);

          case 13:
            _context7.next = 15;
            return draftStatus(leagueId, true);

          case 15:
            currentStatus = _context7.sent;

            draftCache.put(leagueId, currentStatus);

          case 17:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function makePick(_x13, _x14, _x15, _x16) {
    return _ref7.apply(this, arguments);
  };
}();

module.exports = {
  getDraftList: getDraftList,
  getDraft: getDraft,
  updateDraftList: updateDraftList,
  startDraft: startDraft,
  makePick: makePick,
  draftStatus: draftStatus
};
//# sourceMappingURL=draftApi.js.map