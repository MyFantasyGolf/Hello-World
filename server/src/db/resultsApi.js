const isNil = require('lodash/isNil');
const conn = require('./connection');

const saveTourSchedule = (yearObj, schedule) => {
  const coll = conn.db.db.collection('tour_years');
  const year = await coll.findOne({year: yearObj.year});

  if (isNil(year)) {
    coll.insertOne({year: yearObj.year, tournaments: schedule});
  }
  else {
      schedule.forEach( (newTournament) => {
        const tournamentIndex = year.tournaments.findIndex((tournament) => tournament.name == newTournament.name);

        if (tournamentIndex === -1) {
          year.tournaments.push(newTournament);
          return;
        }

        year.tournaments[tournamentIndex] = newTournament;
      });

      await coll.save(year);
  }

  coll.close();
};

module.exports = {
  saveTourSchedule
};
