const isNil = require('lodash/isNil');
const conn = require('./connection');
const moment = require('moment');

const lastPlayerUpdate = async (season) => {
  const db = await conn.db;
  const coll = db.collection('players');

  const roster = await coll.findOne({
    year: season
  }, {
    updated: 1
  });

  const lastDate = isNil(roster) || isNil(roster.updated) ?
    moment('12-01-1970', 'MM-DD-YYYY') :
    moment(roster.updated, 'MM-DD-YYYY HH:mm');

  return lastDate;
};

const lastScheduleUpdate = async (season) => {
  const db = await conn.db;
  const coll = db.collection('schedule_update');

  const updated = await coll.findOne({
    year: season
  });

  const lastDate = isNil(updated) || isNil(updated.updated) ?
    moment('12-01-1970', 'MM-DD-YYYY') :
    moment(updated.updated, 'MM-DD-YYYY HH:mm');

  return lastDate;
};

const schedulesUpdated = async (season) => {
  const db = await conn.db;
  const coll = db.collection('schedule_update');

  coll.findOneAndUpdate({
    year: season
  }, {
    updated: moment().format('MM-DD-YYYY HH:mm'),
    year: season
  },
  { upsert: true });

};

const saveTourSchedule = async (schedule) => {
  const startDate = moment(schedule.date.start, 'MM/DD/YYYY');

  const db = await conn.db;
  const coll = db.collection('schedules');

  try {
    coll.findOneAndUpdate(
      { year: schedule.year, title: schedule.title },
      { ...schedule,
        key: schedule.title.toLowerCase().replace(/ /g, '').replace(/\./g, '_')
      },
      { upsert: true }
    );
  }
  catch(err) {
    console.log(err.stack);
  }
};

const getSchedules = async (season, truncate = false) => {
  const db = await conn.db;
  const coll = db.collection('schedules');
  if (truncate === false) {
    return await coll.find({year: season}).toArray();
  }

  return await coll.find(
    {year: season},
    {results: 0}).toArray();
};

const getRoster = async (season) => {
  const db = await conn.db;
  const coll = db.collection('players');
  const results = await coll.find({year: parseInt(season)}).toArray();

  return isNil(results[0]) ? [] : results[0].players;
};

const saveRoster = async (season, roster) => {
  const db = await conn.db;
  const coll = db.collection('players');

  try {
    coll.findOneAndUpdate(
      { year: season },
      { ...roster,
        year: season,
        updated: moment().format('MM-DD-YYYY HH:mm')
      },
      { upsert: true }
    );
  }
  catch( err ) {
    console.log(err.stack);
  }
};

const saveResults = async (schedule, results) => {
  const db = await conn.db;
  const coll = db.collection('schedules');

  try {
    const globalResultObject = {};
    results.forEach( async (result) => {
      globalResultObject[result.key] = result;
    });

    if (moment(schedule.date.end, 'MM/DD/YYYY').isBefore(moment())) {
      schedule.complete = true;
      console.log(`${schedule.title} is complete.`);
    }

    const outcome = await coll.findOneAndUpdate(
      { year: schedule.year, key: schedule.key },
      { $set: { 'results': globalResultObject, 'complete': schedule.complete }},
      { upsert: true, w: 1 }
    );

    console.log(`Saved: ${schedule.key}`);
  }
  catch(err) {
    console.log(err.stack);
  }
};

module.exports = {
  saveTourSchedule,
  getSchedules,
  saveResults,
  getRoster,
  saveRoster,
  lastPlayerUpdate,
  lastScheduleUpdate,
  schedulesUpdated
};
