const conn = require('./connection');
const ObjectId = require('mongodb').ObjectId;
const season = require('../utils/season');
const moment = require('moment');

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

module.exports = {
  getActiveRosterMap
};
