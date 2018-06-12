const isNil = require('lodash/isNil');
const leagueApi = require('../db/leagueApi');
const draftApi = require('../db/draftApi');

const getMyLeagues = async (request, response) => {

  const userId = request.session.userId;

  const leagues = await leagueApi.getLeaguesForUser(userId);

  response.send({leagues: leagues});
};

const getLeagueSchedules = async(request, response) => {
  const leagueId = request.params.leagueId;

  const schedules = await leagueApi.getLeagueSchedules(leagueId);
  response.send({schedules});
}

const getMyInvitations = async (request, response) => {
  const userId = request.session.userId;

  const invites = await leagueApi.getLeagueInvitations(userId);
  response.send({leagues: invites});
};

const acceptInvitation = async (request, response) => {
  const userId = request.session.userId;
  const leagueId = request.params.leagueId;
  const teamName = request.params.teamName;

  await leagueApi.acceptInvitation(userId, leagueId, teamName)
  response.send({'status': 'success'});
};

const declineInvitation = async (request, response) => {
  const userId = request.session.userId;
  const leagueId = request.params.leagueId;

  await leagueApi.declineInvitation(userId, leagueId)
  response.send({'status': 'success'});
};

const getLeague = async (request, response) => {
  const leagueId = request.params.leagueId;

  const league = await leagueApi.getLeague(leagueId);

  response.send({league});
};

const createLeague = async (request, response) => {
  const league = request.body;

  if (isNil(league.name) ||
    isNil(league.commissioner)) {
    response.status(500).send('A league name and commissioner are required.');
    return;
  }

  await leagueApi.saveLeague(league);
  response.send({status: 'success'});
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

const getDraft = async (request, response) => {
  const leagueId = request.params.leagueId;

  if (isNil(leagueId)) {
    response.status(500).send('League ID required');
    return;
  }

  const draft = await draftApi.getDraft(leagueId);
  response.send(draft);
};

const getDraftList = async (request, response) => {
  const leagueId = request.params.leagueId;
  const teamId = request.session.userId;

  if (isNil(leagueId) || isNil(teamId) || leagueId === 'undefined') {
    response.status(500).send('Insufficient information provided.');
    return;
  }

  const players = await draftApi.getDraftList(leagueId, teamId);
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

  await draftApi.updateDraftList(leagueId, userId, newList);
  response.send({'status': 'Success'});
};

const startDraft = async (request, response) => {
  const leagueId = request.params.leagueId;
  const draftOptions = request.body.draftOptions;

  if (isNil(draftOptions) || isNil(leagueId)) {
    response.status(500).send('Not enough information to start draft');
    return;
  }

  await draftApi.startDraft(leagueId, draftOptions);
  response.send({'status': 'Success'});
};

const getDraftStatus = async (request, response) => {
  const leagueId = request.params.leagueId;

  if (isNil(leagueId)) {
    response.status(500).send('Not a valid league ID');
    return;
  }

  const status = await draftApi.draftStatus(leagueId);
  response.send(status);
  return;
};

const makeDraftPick = async (request, response) => {
  const leagueId = request.params.leagueId;
  const round = request.params.round;
  const pick = request.params.pick;
  const selection = request.body;

  if (isNil(leagueId) || isNil(round) || isNil(pick) || isNil(selection)) {
    response.status(500).send('Not enough information to make a valid pick.');
    return;
  }

  await draftApi.makePick(leagueId,
    parseInt(round) - 1,
    parseInt(pick) - 1,
    selection);
  response.send({ 'status': 'success'});
}

module.exports = {
  getMyLeagues,
  getAvailablePlayers,
  getLeague,
  createLeague,
  getDraftList,
  updateDraftList,
  startDraft,
  getDraft,
  getDraftStatus,
  makeDraftPick,
  getMyInvitations,
  acceptInvitation,
  declineInvitation,
  getLeagueSchedules
};
