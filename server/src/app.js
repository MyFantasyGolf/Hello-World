const path = require('path');
const express = require('express');
const espn = require('./scrapers/espn/update');
const espnPlayers = require('./scrapers/espn/playerUpdate');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');

const isNil = require('lodash/isNil');
const user_service = require('./services/userManagement');
const league_service = require('./services/leagueManagement');
const pga_service = require('./services/pgaService');

const app = express();

app.use(session({
  secret: 'UniqueFantasyGolf',
  resave: true,
  saveUninitialized: false
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/update', async (request, response) => {

  // try espn first
  const updater = new espn.EspnUpdater();
  //
  // await updater.update(path.resolve(__dirname, '..', 'test', 'files', 'espn-schedule.html'));
  //
  // //now do the players
  // const file = path.resolve(__dirname, '..', 'test', 'files', 'results.html');
  // await updater.updateResults(file);
  updater.update();

  response.send();
});

app.get('/api/updateResults', async (request, response) => {
  const updater = new espn.EspnUpdater();

  await updater.updateResults();
  console.log('Done.');
  response.send();
});

app.get('/api/scoreUpdate', (request, response) => {
  const file = path.resolve(__dirname, '..', 'test', 'files', 'schedule.html');
  const data = fs.readFileSync(file).toString();
  const playerResults = espn.scrapeScheduleResults(data);
  response.send(playerResults);
});

app.get('/api/updateRoster', async (request, response) => {
  const file = path.resolve(__dirname, '..', 'test', 'files', 'players.html');
  const pup = new espnPlayers.EspnPlayerUpdater();
  const players = await pup.updatePlayers(file);
  response.send(players);
});

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

app.get('/api/league/:leagueId/availablePlayers', league_service.getAvailablePlayers);
app.get('/api/league/:leagueId/draftList', league_service.getDraftList);
app.put('/api/league/:leagueId/draftList', league_service.updateDraftList);

app.post('/api/league/:leagueId/draft', league_service.startDraft);
app.get('/api/league/:leagueId/draft', league_service.getDraft);
app.get('/api/league/:leagueId/draft/status', league_service.getDraftStatus);
app.put('/api/league/:leagueId/draft/:round/:pick', league_service.makeDraftPick);

app.listen(3000, () => console.log('MyFantasyGolf app listening on port 3000!'))
