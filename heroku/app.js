'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var resultsApi = require('./db/resultsApi');
var season = require('./utils/season');
var moment = require('moment');

var leagueUpdater = require('./db/leagueUpdater');

var app = express();
var updating = false;

app.use(express.static('./public'));

app.use(session({
  secret: 'UniqueFantasyGolf',
  resave: true,
  saveUninitialized: false
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request, response, next) {
    var update, pup;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(!request.path.startsWith('/api') || isNil(request.session) || isNil(request.session.userId) || updating === true)) {
              _context.next = 3;
              break;
            }

            next();
            return _context.abrupt('return');

          case 3:

            console.log('Updating...');
            updating = true;
            update = new espn.EspnUpdater();
            _context.next = 8;
            return update.update();

          case 8:
            _context.next = 10;
            return update.updateResults();

          case 10:
            pup = new espnPlayers.EspnPlayerUpdater();
            _context.next = 13;
            return pup.updatePlayers();

          case 13:
            updating = false;

            leagueUpdater.update(request.session.userId);
            console.log('Done updating');

            _context.next = 18;
            return resultsApi.schedulesUpdated(season.getSeason(moment()));

          case 18:

            next();

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

app.get('/isUpdating', function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(request, response) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            response.send({ updating: updating });

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}());

app.get('/update', function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(request, response) {
    var updater;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
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
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}());

app.get('/api/updateResults', function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(request, response) {
    var updater;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            updater = new espn.EspnUpdater();
            _context4.next = 3;
            return updater.updateResults();

          case 3:
            console.log('Done.');
            response.send();

          case 5:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}());

// app.get('/api/scoreUpdate', (request, response) => {
//   const file = path.resolve(__dirname, '..', 'test', 'files', 'schedule.html');
//   const data = fs.readFileSync(file).toString();
//   const playerResults = espn.scrapeScheduleResults(data);
//   response.send(playerResults);
// });

// app.get('/api/updateRoster', async (request, response) => {
//   const file = path.resolve(__dirname, '..', 'test', 'files', 'players.html');
//   const pup = new espnPlayers.EspnPlayerUpdater();
//   const players = await pup.updatePlayers(file);
//   response.send(players);
// });

app.get('/api/schedule', pga_service.getSchedule);

app.post('/api/register', user_service.registerUser);
app.post('/api/login', user_service.login);
app.post('/api/logout', user_service.logout);
app.get('/api/currentUser', user_service.getUser);
app.get('/api/users', user_service.getUsers);

// players
app.get('/api/golfers/:season', pga_service.getGolfers);
app.get('/api/golfer/:key', pga_service.getGolfer);

// leagues
app.get('/api/myleagues', league_service.getMyLeagues);

app.get('/api/league/:leagueId', league_service.getLeague);
app.post('/api/league', league_service.createLeague);
app.put('/api/league/:leagueId/setActiveRoster', roster_service.setActiveRoster);
app.get('/api/league/:leagueId/myActiveRoster', roster_service.getActiveRoster);
app.get('/api/league/:leagueId/schedules', league_service.getLeagueSchedules);

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

app.get('*', function (request, response) {
  response.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(3000, function () {
  return console.log('MyFantasyGolf app listening on port 3000!');
});
//# sourceMappingURL=app.js.map