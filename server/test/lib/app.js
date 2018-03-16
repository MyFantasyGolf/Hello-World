'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var path = require('path');
var express = require('express');
var espn = require('./scrapers/espn/update');
var fs = require('fs');
var bodyParser = require('body-parser');
var session = require('express-session');

var user_service = require('./services/userManagement');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(session({
  secret: 'UniqueFantasyGolf',
  resave: true,
  saveUninitialized: false
}));

app.get('/update', function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, response) {
    var updater, file;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:

            // try espn first
            updater = new espn.EspnUpdater();
            _context.next = 3;
            return updater.update(path.resolve(__dirname, '..', 'test', 'files', 'espn-schedule.html'));

          case 3:

            //now do the players
            file = path.resolve(__dirname, '..', 'test', 'files', 'results.html');
            _context.next = 6;
            return updater.updateResults(file);

          case 6:

            response.send();

          case 7:
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

app.get('/updateResults', function () {
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
            response.send();

          case 4:
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

app.get('/scoreUpdate', function (request, response) {
  var file = path.resolve(__dirname, '..', 'test', 'files', 'schedule.html');
  var data = fs.readFileSync(file).toString();
  var playerResults = espn.scrapeScheduleResults(data);
  response.send(playerResults);
});

app.post('/register', user_service.registerUser);
app.post('/login', user_service.login);

app.listen(3000, function () {
  return console.log('MyFantasyGolf app listening on port 3000!');
});
//# sourceMappingURL=app.js.map