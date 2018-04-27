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

module.exports = {
  getMyLeagues,
  getAvailablePlayers,
  getLeague,
  createLeague
};
