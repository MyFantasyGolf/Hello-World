'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var conn = require('./connection');
var season = require('../utils/season');
var userApi = require('./userApi');
var moment = require('moment');
var isNil = require('lodash/isNil');
var isString = require('lodash/isNil');
var ObjectId = require('mongodb').ObjectId;

var updateLeague = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(league) {
    var db, coll, leagueId;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return conn.db;

          case 2:
            db = _context.sent;
            coll = db.collection('leagues');
            leagueId = isString(league) ? league : league._id;
            _context.prev = 5;
            _context.next = 8;
            return coll.findOneAndUpdate({
              '_id': ObjectId(leagueId),
              'season': season.getSeason(moment())
            }, league);

          case 8:
            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context['catch'](5);

            console.log('Error saving league ' + legaueId);

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[5, 10]]);
  }));

  return function updateLeague(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getLeaguesForUser = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(userId) {
    var db, coll, leagues;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
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
            return coll.find({ teams: {
                $elemMatch: {
                  user: userId
                }
              }
            }, {
              fields: { draft: 0 }
            }).toArray();

          case 7:
            leagues = _context2.sent;
            return _context2.abrupt('return', leagues);

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2['catch'](4);

            console.log('Error saving league: ' + _context2.t0);

          case 14:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[4, 11]]);
  }));

  return function getLeaguesForUser(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var getLeagueInvitations = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(userId) {
    var db, coll, user, leagues;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
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
            return userApi.getUserById(userId);

          case 7:
            user = _context3.sent;
            _context3.next = 10;
            return coll.find({ invitations: {
                $elemMatch: {
                  email: user.email
                }
              }
            }, {
              fields: { name: 1, commissioner: 1, _id: 1 }
            }).toArray();

          case 10:
            leagues = _context3.sent;
            return _context3.abrupt('return', leagues);

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3['catch'](4);

            console.log('Error saving league: ' + _context3.t0);

          case 17:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[4, 14]]);
  }));

  return function getLeagueInvitations(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var acceptInvitation = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(userId, leagueId, teamName) {
    var db, coll, invitations, user, newInvitations;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return conn.db;

          case 2:
            db = _context4.sent;
            coll = db.collection('leagues');
            _context4.next = 6;
            return coll.findOne({
              '_id': ObjectId(leagueId)
            }, {
              fields: { invitations: 1, teams: 1 }
            });

          case 6:
            invitations = _context4.sent;
            _context4.next = 9;
            return userApi.getUserById(userId);

          case 9:
            user = _context4.sent;
            newInvitations = invitations.invitations.filter(function (invite) {
              return invite.email !== user.email;
            });


            invitations.teams.push({
              name: teamName,
              user: userId,
              draftList: [],
              currentRoster: []
            });

            _context4.next = 14;
            return coll.findOneAndUpdate({
              '_id': ObjectId(leagueId)
            }, {
              $set: {
                invitations: newInvitations,
                teams: invitations.teams
              }
            });

          case 14:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function acceptInvitation(_x4, _x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();

var declineInvitation = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(userId, leagueId) {
    var db, coll, invitations, newInvitations;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return conn.db;

          case 2:
            db = _context5.sent;
            coll = db.collection('leagues');
            _context5.next = 6;
            return coll.findOne({
              '_id': ObjectId(leagueId)
            }, {
              fields: { invitations: 1 }
            });

          case 6:
            invitations = _context5.sent;
            newInvitations = invitations.invitations.filter(function (invite) {
              return invite.id !== userId;
            });
            _context5.next = 10;
            return coll.findOneAndUpdate({
              '_id': ObjectId(leagueId)
            }, {
              $set: {
                invitations: newInvitations
              }
            });

          case 10:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function declineInvitation(_x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}();

var getLeague = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(leagueId) {
    var db, coll, league;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return conn.db;

          case 2:
            db = _context6.sent;
            coll = db.collection('leagues');
            _context6.next = 6;
            return coll.findOne({
              '_id': ObjectId(leagueId),
              'season': season.getSeason(moment())
            });

          case 6:
            league = _context6.sent;
            return _context6.abrupt('return', league);

          case 8:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function getLeague(_x9) {
    return _ref6.apply(this, arguments);
  };
}();

var createLeague = function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(league) {
    var db, coll, unregisteredUsers;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return conn.db;

          case 2:
            db = _context7.sent;
            coll = db.collection('leagues');
            _context7.prev = 4;

            league.season = season.getSeason(moment());
            league.draft = {
              state: 'PREDRAFT',
              settings: {},
              rounds: []
            };

            _context7.next = 9;
            return coll.insertOne({ ...league });

          case 9:

            // now create users that aren't registered
            unregisteredUsers = league.invitations.filter(function (invite) {
              return isNil(invite.id);
            });


            unregisteredUsers.forEach(function (user) {
              user.email = user.email.trim();
              userApi.registerUser(user, false);
            });
            _context7.next = 16;
            break;

          case 13:
            _context7.prev = 13;
            _context7.t0 = _context7['catch'](4);

            console.log('Error saving league: ' + _context7.t0);

          case 16:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined, [[4, 13]]);
  }));

  return function createLeague(_x10) {
    return _ref7.apply(this, arguments);
  };
}();

var saveLeague = function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(league) {
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            if (isNil(league._id)) {
              _context8.next = 2;
              break;
            }

            return _context8.abrupt('return', updateLeague(league));

          case 2:
            return _context8.abrupt('return', createLeague(league));

          case 3:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  }));

  return function saveLeague(_x11) {
    return _ref8.apply(this, arguments);
  };
}();

var getAvailablePlayers = function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(leagueId) {
    var db, coll, megaMatch, league, signedPlayers, filteredList;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return conn.db;

          case 2:
            db = _context9.sent;
            coll = db.collection('leagues');
            _context9.prev = 4;
            _context9.next = 7;
            return coll.aggregate([{ "$match": { "_id": ObjectId(leagueId) } }, { "$lookup": {
                "from": "players",
                "localField": "season",
                "foreignField": "year",
                "as": "players"
              }
            }]).toArray();

          case 7:
            megaMatch = _context9.sent;
            _context9.next = 10;
            return getLeague(leagueId);

          case 10:
            league = _context9.sent;
            signedPlayers = [];


            league.teams.forEach(function (team) {
              if (isNil(team.currentRoster)) {
                return;
              }

              team.currentRoster.forEach(function (player) {
                signedPlayers.push(player);
              });
            });

            filteredList = megaMatch[0].players[0].players.filter(function (player) {
              var index = signedPlayers.findIndex(function (sp) {
                return sp.key === player.key;
              });

              return index === -1;
            });
            return _context9.abrupt('return', filteredList);

          case 17:
            _context9.prev = 17;
            _context9.t0 = _context9['catch'](4);

            console.log('Error getting player list ' + _context9.t0);

          case 20:
            return _context9.abrupt('return', []);

          case 21:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined, [[4, 17]]);
  }));

  return function getAvailablePlayers(_x12) {
    return _ref9.apply(this, arguments);
  };
}();

module.exports = {
  saveLeague: saveLeague,
  getLeaguesForUser: getLeaguesForUser,
  getAvailablePlayers: getAvailablePlayers,
  getLeague: getLeague,
  getLeagueInvitations: getLeagueInvitations,
  acceptInvitation: acceptInvitation,
  declineInvitation: declineInvitation
};
//# sourceMappingURL=leagueApi.js.map