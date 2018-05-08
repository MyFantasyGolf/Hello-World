const isNil = require('lodash/isNil');
const leagueApi = require('../db/leagueApi');

const getMyLeagues = async (request, response) => {

  const userId = request.session.userId;

  const leagues = await leagueApi.getLeaguesForUser(userId);

  response.send({leagues: leagues});
};

const getLeague = (request, response) => {

};

const createLeague = async (request, response) => {
  const league = request.body;
  league.owner = request.session.userId;

  if (isNil(league.name) ||
    isNil(league.owner)) {
    response.status(500).send('A league name and owner are required.');
    return;
  }

  if (isNil(league.manager)) {
    league.manager = [league.owner];
  }

  await leagueApi.saveLeague(league);
  response.send();
};

const getAvailablePlayers = async (request, response) => {
  const leagueId = request.params.leagueId;

  if (isNil(leagueId)) {
    response.status(500).send('Invalid league ID.');
    return;
  }

  const players = await leagueApi.getAvailablePlayers(leagueId);
  response.send({players: players});
};

const getDraftList = async (request, response) => {
  const leagueId = request.params.leagueId;
  const teamId = request.session.userId;

  if (isNil(leagueId) || isNil(teamId)) {
    response.status(500).send('Insufficient information provided.');
    return;
  }

  const players = await leagueApi.getDraftList(leagueId, teamId);
  response.send({players: players});
};

const updateDraftList = async (request, response) => {
  const newList = request.body.draftList;
  const leagueId = request.params.leagueId;
  const userId = request.session.userId;

  if (isNil(userId) || isNil(leagueId)) {
    response.send(500).send('Insufficient information provided.');
    return;
  }

  await leagueApi.updateDraftList(leagueId, userId, newList);
  response.send({'status': 'Success'});
};

const startDraft = async (request, response) => {
  const leagueId = request.params.leagueId;
  const draftOptions = request.body.draftOptions;

  if (isNil(draftOptions) || isNil(leagueId)) {
    response.status(500).send('Not enough information to start draft');
    return;
  }

  await leagueApi.startDraft(leagueId, draftOptions);
  response.send();
};

module.exports = {
  getMyLeagues,
  getAvailablePlayers,
  getLeague,
  createLeague,
  getDraftList,
  updateDraftList,
  startDraft
};
