const isNil = require('lodash/isNil');
const conn = require('./connection');
const moment = require('moment');

const saveTourSchedule = async (schedule) => {
  const startDate = moment(schedule.date.start, 'MM/DD/YYYY');

  const db = await conn.db;
  const coll = db.collection('schedules');

  try {
    coll.findOneAndUpdate(
      { year: schedule.year, title: schedule.title },
      { ...schedule, key: schedule.title.toLowerCase().replace(/ /g, '') },
      { upsert: true }
    );
  }
  catch(err) {
    console.log(err.stack);
  }
};

const getSchedules = async (season) => {
  const db = await conn.db;
  const coll = db.collection('schedules');
  const results = await coll.find({year: season}).toArray();

  return results;
};

const saveResults = async (schedule, results) => {
  const db = await conn.db;
  const coll = db.collection('schedules');

  try {
    results.forEach( (result) => {

      coll.findOneAndUpdate(
        { year: schedule.year, key: schedule.key },
        { $set: { [`results.${result.key}`]: { ...result } }},
        { upsert: true }
      );
    });
  }
  catch(err) {
    console.log(err.stack);
  }
};

module.exports = {
  saveTourSchedule,
  getSchedules,
  saveResults
};