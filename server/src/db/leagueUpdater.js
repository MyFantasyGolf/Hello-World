const conn = require('./connection');
const moment = require('moment');
const isNil = require('lodash/isNil');
const season = require('../utils/season');
const leagueApi = require('./leagueApi');
const resultApi = require('./resultsApi');

const getLeaguesToUpdate = async (userId) => {
  const userLeagues = await leagueApi.getLeaguesForUser(userId);
  const leaguesToUpdate = userLeagues.filter( (league) => {
    const lastUpdate = isNil(league.updated) ?
      moment('12-01-1970', 'MM-DD-YYYY') :
      moment(league.updated, 'MM-DD-YYYY');

    return moment().diff(lastUpdated, 'hours') > 23;
  });

  return leaguesToUpdate;
};

const getSchedulesThatApply = async (leagueStarted) => {
  const schedules = await resultsApi.getSchedule(season.getSeason(moment()));

  const schedulesThatApply = schedules.filter( (schedule) => {
    const scheduleEnd = moment(schedule.dates.end, 'MM/DD/YYYY');

    return scheduleEnd.isAfter(leagueStarted) &&
      !isNil(schedule.results);
  });

  return schedulesThatApply;
};

const updateTeam = async (team, league, schedules) => {
  let lastRoster = null;

  schedules.forEach( (schedule) => {
    let activeRoster = team.activeMap[schedule.key];

    if (isNil(activeRoster) {
      if (!isNil(lastRoster)) {
        activeRoster = lastRoster;
      }
      else {
        activeRoster = [];
        for (let i = 0; i < league.activeGolfers && i < team.currentRoster.length; i++) {
          activeRoster.push({ key: team.currentRoster[i].key });
        }
      }
    }

    lastRoster = activeRoster;

    activeRoster.forEach( (golfer) => {
      golfer.score = schedule.results[golfer.key].relativeScore;
    });
  });
};

const updateLeague = async (league, schedules) => {
  league.teams.forEach( (team) => {
    await updateTeam(team, league,schedules);
  });
};

const update = async (userId) => {
  const db = await conn.db;
  const coll = db.collection('leagues');

  const leaguesToUpdate = getLeaguesToUpdate(userId);

  const leagueStarted = isNil(league.draft) ||
    isNil(league.draft.completed) ?
    moment() : moment(league.draft.completed, 'MM-DD-YYYY');

  const schedulesThatApply = getSchedulesThatApply(leagueStarted);
  schedulesThatApply.sort( (s1, s2) => {
    const s1Start = moment(s1.date.end, 'MM/DD/YYYY');
    const s2Start = moment(s1.data.end, 'MM/DD/YYYY');

    if (s1Start.isBefore(s2Start)) {
      return 1;
    }
    else if (s2Start.isBefore(s1Start)) {
      return -1;
    }

    return 0;
  });

  leaguesToUpdate.forEach( (league) => {
    await updateLeague(league, schedulesThatApply);
  });
};

module.exports = {
  update
};
