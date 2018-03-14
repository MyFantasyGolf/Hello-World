'use strict';

var path = require('path');
var express = require('express');
var espn = require('./scrapers/espn/update');
var fs = require('fs');

var app = express();

app.get('/update', function (request, response) {

  // try espn first
  var updater = new espn.EspnUpdater();
  updater.update(path.resolve(__dirname, '..', 'test', 'files', 'espn-schedule.html')).then(function () {
    response.send();
  });
});

app.get('/scoreUpdate', function (request, response) {
  var file = path.resolve(__dirname, '..', 'test', 'files', 'schedule.html');
  var data = fs.readFileSync(file).toString();
  var playerResults = espn.scrapeScheduleResults(data);
  response.send(playerResults);
});

app.listen(3000, function () {
  return console.log('MyFantasyGolf app listening on port 3000!');
});
//# sourceMappingURL=app.js.map