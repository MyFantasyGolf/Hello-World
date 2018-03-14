const isNil = require('lodash/isNil');
const conn = require('./connection');
const moment = require('moment');

const saveTourSchedule = async (schedule) => {
  const startDate = moment(schedule.date.start, 'MM/DD/YYYY');

  const season = (startDate.month() >= 9 && startDate.month() < 12) ?
    startDate.year() + 1 : startDate.year();

  const db = await conn.db;

  const coll = db.collection('schedules');

  try {
    coll.findOneAndUpdate(
      { year: season},
      {$push: { schedule: schedule }},
      {
        upsert: true
      }
    );
  }
  catch(err) {
    console.log(err.stack);
  }
};

const getSchedules = () => {

  return new Promise( (resolve, reject) => {
    conn.db.then( (db) => {
      const coll = db.collection('schedules');

      coll.find({}).toArray((err, results) => {

        if (!isNil(err)) {
          reject(err);
        }

        resolve(results);
      });
    });
  });
};

module.exports = {
  saveTourSchedule,
  getSchedules
};
