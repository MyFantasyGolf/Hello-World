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

module.exports = {
  getActiveRoster
};
