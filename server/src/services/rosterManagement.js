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
  const activeMap = map.activeMap;
  response.send({activeMap});
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

const releasePlayer = async (request, response) => {

  const leagueId = request.params.leagueId;
  const golferKey = request.params.golferId;
  const userId = request.session.userId;

  if (isNil(leagueId) || isNil(golferKey)) {
    response.status(500).send('Must have a vaild league and golfer id.');
    return;
  }

  await rosterApi.releasePlayer(leagueId, userId, golferKey);
  response.send({status: 'OK'});
};

const addPlayer = async (request, response) => {

  const leagueId = request.params.leagueId;
  const golfer = request.body;
  const userId = request.session.userId;

  if (isNil(leagueId) || isNil(golfer)) {
    response.status(500).send('Must have a vaild league and golfer.');
    return;
  }

  await rosterApi.addPlayer(leagueId, userId, golfer);
  response.send({status: 'OK'});
};

module.exports = {
  getActiveRoster,
  setActiveRoster,
  releasePlayer,
  addPlayer
};
