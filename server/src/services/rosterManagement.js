const isNil = require('lodash/isNil');
const pgaService = require('./pgaService');
const draftApi = require('../db/draftApi');
const rosterApi = require('../db/rosterApi');

const getActiveRoster = async (request, response) => {

  const leagueId = request.params.leagueId;
  const userId = request.session.userId;

  if (isNil(leagueId) || isNil(userId)) {
    response.status(500).send('League and User session must both be vaild.');
    return;
  }

  const map = await rosterApi.getActiveRosterMap(leagueId, userId);

  response.send({map});
};

const setActiveRoster = async (request, response) => {

  const leagueId = request.params.leagueId;
  const userId = request.session.userId;
  const map = request.body;

  if (isNil(leagueId) || isNil(userId) || isNil(map)) {
    response.status(500).send('League, active settings and User session must both be vaild.');
    return;
  }

  const newMap = await rosterApi.setActiveRosterMap(leagueId, userId, map);
  response.send(newMap);
};

module.exports = {
  getActiveRoster,
  setActiveRoster
};
