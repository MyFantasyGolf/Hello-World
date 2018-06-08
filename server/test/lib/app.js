'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var path = require('path');
var express = require('express');
var espn = require('./scrapers/espn/update');
var espnPlayers = require('./scrapers/espn/playerUpdate');
var fs = require('fs');
var bodyParser = require('body-parser');
var session = require('express-session');

var isNil = require('lodash/isNil');
var user_service = require('./services/userManagement');
var league_service = require('./services/leagueManagement');
var roster_service = require('./services/rosterManagement');
var pga_service = require('./services/pgaService');

var app = express();

app.use(session({
  secret: 'UniqueFantasyGolf',
  resave: true,
  saveUninitialized: false
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/update', function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, response) {
    var updater;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:

            // try espn first
            updater = new espn.EspnUpdater();
            //
            // await updater.update(path.resolve(__dirname, '..', 'test', 'files', 'espn-schedule.html'));
            //
            // //now do the players
            // const file = path.resolve(__dirname, '..', 'test', 'files', 'results.html');
            // await updater.updateResults(file);

            updater.update();

            response.send();

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

app.get('/api/updateResults', function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(request, response) {
    var updater;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            updater = new espn.EspnUpdater();
            _context2.next = 3;
            return updater.updateResults();

          case 3:
            console.log('Done.');
            response.send();

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

app.get('/api/scoreUpdate', function (request, response) {
  var file = path.resolve(__dirname, '..', 'test', 'files', 'schedule.html');
  var data = fs.readFileSync(file).toString();
  var playerResults = espn.scrapeScheduleResults(data);
  response.send(playerResults);
});

app.get('/api/updateRoster', function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(request, response) {
    var file, pup, players;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            file = path.resolve(__dirname, '..', 'test', 'files', 'players.html');
            pup = new espnPlayers.EspnPlayerUpdater();
            _context3.next = 4;
            return pup.updatePlayers(file);

          case 4:
            players = _context3.sent;

            response.send(players);

          case 6:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());

app.post('/api/register', user_service.registerUser);
app.post('/api/login', user_service.login);
app.post('/api/logout', user_service.logout);
app.get('/api/currentUser', user_service.getUser);
app.get('/api/users', user_service.getUsers);

// players
app.get('/api/golfers/:season', pga_service.getGolfers);

// leagues
app.get('/api/myleagues', league_service.getMyLeagues);

app.get('/api/league/:leagueId', league_service.getLeague);
app.post('/api/league', league_service.createLeague);
app.get('/api/league/:leagueId/myActiveRoster', roster_service.getActiveRoster);

app.get('/api/league/:leagueId/availablePlayers', league_service.getAvailablePlayers);
app.get('/api/league/:leagueId/draftList', league_service.getDraftList);
app.put('/api/league/:leagueId/draftList', league_service.updateDraftList);

app.post('/api/league/:leagueId/draft', league_service.startDraft);
app.get('/api/league/:leagueId/draft', league_service.getDraft);
app.get('/api/league/:leagueId/draft/status', league_service.getDraftStatus);
app.put('/api/league/:leagueId/draft/:round/:pick', league_service.makeDraftPick);

app.get('/api/invites', league_service.getMyInvitations);
app.put('/api/invite/accept/:leagueId/:teamName', league_service.acceptInvitation);
app.delete('/api/invite/decline/:leagueId', league_service.declineInvitation);

app.listen(3000, function () {
  return console.log('MyFantasyGolf app listening on port 3000!');
});
//# sourceMappingURL=app.js.map