const conn = require('./connection');
const ObjectId = require('mongodb').ObjectId;
const season = require('../utils/season');
const moment = require('moment');
const isNil = require('lodash/isNil');

const getActiveRosterMap = async (leagueId, userId) => {
  const db = await conn.db;
  const coll = db.collection('leagues');
  console.log(`here with ${leagueId} and ${userId}`);

  const map = await coll.findOne({
    '_id': ObjectId(leagueId),
    'season': season.getSeason(moment())
  }, {
    'teams.user': 1,
    'teams.currentRoster': 1,
    'teams.activeMap': 1,
    'teams.draftList': 0
  });

  const myMap = map.teams.find( (team) => {
    return team.user === userId;
  });

  return myMap.activeMap;
};

const setActiveRosterMap = async (leagueId, userId, map) => {
  const db = await conn.db;
  const coll = db.collection('leagues');

  await coll.findOneAndUpdate({
    _id: ObjectId(leagueId),
    'teams.user': userId
  }, {
    $set: { 'teams.$.activeMap': map }
  });

  return map;
};

const getGolfer = async (key) => {

  const db = await conn.db;
  const coll = db.collection('players');
  const year = season.getSeason(moment());

  const player = await coll.find(
    {'year': year})
    .project({
      'players': {
        $elemMatch: {'key': key}
      }
    }).toArray();

  if (isNil(player) || player.length < 1) {
    return null;
  }

  return player[0].players[0];
};

module.exports = {
  getActiveRosterMap,
  getGolfer,
  setActiveRosterMap
};
