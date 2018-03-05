const path = require('path');
const express = require('express');
const espn = require('./scrapers/espn/update.js');
const fs = require('fs');

const app = express();

app.get('/update', (request, response) => {

  // try espn first
  espn.update(path.resolve(__dirname, '..', 'test', 'files', 'espn-schedule.html'));
  response.send();
});

app.get('/scoreUpdate', (request, response) => {
  const file = path.resolve(__dirname, '..', 'test', 'files', 'schedule.html');
  const data = fs.readFileSync(file).toString();
  const playerResults = espn.scrapeScheduleResults(data);
  response.send(playerResults);
});

app.listen(3000, () => console.log('MyFantasyGolf app listening on port 3000!'))
