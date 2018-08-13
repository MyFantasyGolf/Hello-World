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
const roster_service = require('./services/rosterManagement');
const pga_service = require('./services/pgaService');
const resultsApi = require('./db/resultsApi');
const season = require('./utils/season');
const moment = require('moment');

const leagueUpdater = require('./db/leagueUpdater');

const app = express();
let updating = false;

app.use(session({
  secret: 'UniqueFantasyGolf',
  resave: true,
  saveUninitialized: false
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(async (request, response, next) => {
  if (
    !request.path.startsWith('/api') ||
    isNil(request.session) ||
    isNil(request.session.userId) ||
    updating === true)
  {
    next();
    return;
  }

  console.log('Updating...');
  updating = true;
  const update = new espn.EspnUpdater();
  await update.update();
  await update.updateResults();
  const pup = new espnPlayers.EspnPlayerUpdater();
  await pup.updatePlayers();
  updating = false;

  leagueUpdater.update(request.session.userId);
  console.log('Done updating');

  await resultsApi.schedulesUpdated(season.getSeason(moment()));

  next();
});

app.get('/isUpdating', async (request, response) => {
  response.send({ updating });
});

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

app.listen(3000, () => console.log('MyFantasyGolf app listening on port 3000!'))
