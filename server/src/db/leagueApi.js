const conn = require('./connection');
const season = require('../utils/season');
const moment = require('moment');
const isNil = require('lodash/isNil');
const ObjectId = require('mongodb').ObjectId;

const updateLeague = async (league) => {

};

const createLeague = async (league) => {
  const db = await conn.db;
  const coll = db.collection('leagues');

  try {
    league.season = season.getSeason(moment());
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

module.exports = {
  saveLeague
};
