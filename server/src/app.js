const path = require('path');
const express = require('express');
const espn = require('./scrapers/espn/update.js');

const app = express();

app.get('/update', (request, response) => {

  // try espn first
  espn.update(path.resolve(__dirname, '..', 'test', 'files', 'espn-schedule.html'));
  response.send();
});

app.listen(3000, () => console.log('MyFantasyGolf app listening on port 3000!'))
