const conn = require('./connection');
const season = require('../utils/season');
const moment = require('moment');
const isNil = require('lodash/isNil');
const isString = require('lodash/isNil');
const ObjectId = require('mongodb').ObjectId;

const updateLeague = async (league) => {
  const db = await conn.db;
  const coll = db.collection('leagues');

  const leagueId = isString(league) ?
    league : league._id;

  try {
    await coll.findOneAndUpdate({
      '_id': ObjectId(leagueId),
      'season': season.getSeason(moment())
    },
    league);
  }
  catch(err) {
    console.log(`Error saving league ${legaueId}`);
  }
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
    }, {
      fields: {draft: 0}
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

  const league = await coll.findOne({
    '_id': ObjectId(leagueId),
    'season': season.getSeason(moment())
  });

  return league;
};

const createLeague = async (league) => {
  const db = await conn.db;
  const coll = db.collection('leagues');

  try {
    league.season = season.getSeason(moment());
    league.draft = {
      state: 'PREDRAFT',
      settings: {},
      rounds: []
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

    const league = await getLeague(leagueId);
    const signedPlayers = [];

    league.teams.forEach( (team) => {
      team.currentRoster.forEach( (player) => {
        signedPlayers.push(player);
      });
    })

    const filteredList = megaMatch[0].players[0].players.filter( (player) => {
      const index = signedPlayers.findIndex( (sp) => {
        return sp.key === player.key;
      });

      return index === -1;
    });

    return filteredList;
  }
  catch(err) {
    console.log(`Error getting player list ${err}`);
  }

  return [];
};

module.exports = {
  saveLeague,
  getLeaguesForUser,
  getAvailablePlayers,
  getLeague
};
