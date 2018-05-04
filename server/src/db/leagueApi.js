const conn = require('./connection');
const season = require('../utils/season');
const moment = require('moment');
const isNil = require('lodash/isNil');
const ObjectId = require('mongodb').ObjectId;

const updateLeague = async (league) => {

};

const getLeaguesForUser = async (userId) => {
  const db = await conn.db;
  const coll = db.collection('leagues');

  try {
    const leagues = await coll.find({ teams:
      {
        $elemMatch: {
          user: userId
        }
      }
    }).toArray();

    return leagues;
  }
  catch(err) {
    console.log(`Error saving league: ${err}`);
  }
};

const getLeague = async( leagueId ) => {
  const db = await conn.db;
  const coll = db.collection('leagues');
};

const createLeague = async (league) => {
  const db = await conn.db;
  const coll = db.collection('leagues');

  try {
    league.season = season.getSeason(moment());
    league.draft = {
      complete: false,
      settings: {},
      picks: []
    };

    league.teams = [];
    await coll.insertOne({ ...league });
  }
  catch(err) {
    console.log(`Error saving league: ${err}`);
  }
};

const saveLeague = async(league) => {
  if (!isNil(league._id)) {
    return updateLeague(league)
  }

  return createLeague(league);
}

const getAvailablePlayers = async (leagueId) => {
  const db = await conn.db;
  const coll = db.collection('leagues');

  try {
    const megaMatch = await coll.aggregate([
      { "$match": {"_id": ObjectId(leagueId)}},
      { "$lookup":
        {
          "from": "players",
          "localField":
          "season",
          "foreignField": "year",
          "as": "players"
        }
      }]).toArray();

    return megaMatch[0].players[0].players;
  }
  catch(err) {
    console.log(`Error getting player list ${err}`);
  }

  return [];
};

const getDraftList = async (leagueId, userId) => {
  const db = await conn.db;
  const coll = db.collection('leagues');

  try {
    const list = await coll.find({
      '_id': ObjectId(leagueId),
      'season': season.getSeason(moment())
    })
    .project({
      teams: { $elemMatch: {"user": userId}}
    }).toArray();

    return list[0].teams[0].draftList;
  }
  catch(err) {
    console.log(`Error getting draft list for ${userId}: ${err}`);
  }

  return [];
};

const updateDraftList = async (leagueId, userId, draftList) => {
  const db = await conn.db;
  const coll = db.collection('leagues');

  await coll.update({
    '_id': ObjectId(leagueId),
    'season': season.getSeason(moment()),
    'teams.user': userId
  }, {
    '$set': {
      'teams.$.draftList': draftList
    }
  });
};

module.exports = {
  saveLeague,
  getLeaguesForUser,
  getAvailablePlayers,
  getDraftList,
  updateDraftList
};
