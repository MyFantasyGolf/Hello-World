const isNil = require('lodash/isNil');
const leagueApi = require('../db/leagueApi');

const getMyLeagues = (request, response) => {
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

module.exports = {
  getMyLeagues,
  getLeague,
  createLeague
};
