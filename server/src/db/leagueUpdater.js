const conn = require('./connection');
const moment = require('moment');
const isNil = require('lodash/isNil');
const isNumber = require('lodash/isNumber');
const cloneDeep = require('lodash/cloneDeep');
const season = require('../utils/season');
const leagueApi = require('./leagueApi');
const resultsApi = require('./resultsApi');
const ObjectId = require('mongodb').ObjectId;

const getLeaguesToUpdate = async (userId) => {
  const userLeagues = await leagueApi.getLeaguesForUser(userId);
  const leaguesToUpdate = userLeagues.filter( (league) => {
    const lastUpdate = isNil(league.updated) ?
      moment('12-01-1970', 'MM-DD-YYYY') :
      moment(league.updated, 'MM-DD-YYYY');

    return moment().diff(lastUpdate, 'hours') > 23;
  });

  return leaguesToUpdate;
};

const getSchedulesThatApply = (leagueStarted, schedules) => {

  const schedulesThatApply = schedules.filter( (schedule) => {
    const scheduleEnd = moment(schedule.date.end, 'MM/DD/YYYY');

    return scheduleEnd.isAfter(leagueStarted) &&
      !isNil(schedule.results);
  });

  return schedulesThatApply;
};

const getScore = (lowestCut, golferResult) => {

  if (isNil(golferResult) ||
    isNil(golferResult.relativeScore) ||
    isNaN(golferResult.relativeScore) ||
    !isNumber(golferResult.relativeScore)) {
    return lowestCut + 1;
  }
  return golferResult.relativeScore;
};

const updateTeam = async (team, league, schedules) => {
  let lastRoster = null;

  schedules.forEach( (schedule) => {

    if (isNil(team.activeMap)) {
      team.activeMap = {};
    }

    let activeRoster = team.activeMap[schedule.key];

    if (isNil(activeRoster)) {
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

    const lowestScore = schedule.complete === false ?
      0
      :
      Object.keys(schedule.results).reduce( (min, key) => {
      const golferResult = schedule.results[key];

      if ( !isNumber(golferResult.relativeScore)) {
        return min;
      }

      return golferResult.relativeScore > min ?
        golferResult.relativeScore : min;
    }, -100);

    activeRoster.forEach( (golfer) => {
      const golfer_results = !isNil(schedule) && !isNil(schedule.results) ?
        schedule.results[golfer.key] : null;

      golfer.score = getScore(lowestScore, golfer_results);
    });

    team.activeMap[schedule.key] = cloneDeep(activeRoster);
  });

  return team;
};

const updateLeague = async (league, schedules) => {
  league.teams.forEach( async (team, index) => {
    const newTeam = await updateTeam(team, league,schedules);
    league.teams[index] = newTeam;
  });

  return league;
};

const update = async (userId) => {
  const db = await conn.db;
  const coll = db.collection('leagues');

  const leaguesToUpdate = await getLeaguesToUpdate(userId);
  const schedules = await resultsApi.getSchedules(season.getSeason(moment()));

  leaguesToUpdate.forEach( async (empty_league) => {

    const league = await leagueApi.getLeague(empty_league._id);

    const leagueStarted = isNil(league.draft) ||
      isNil(league.draft.completed) ?
      moment() : moment(league.draft.completed, 'MM-DD-YYYY');

    const schedulesThatApply =
      getSchedulesThatApply(leagueStarted, schedules);

    schedulesThatApply.sort( (s1, s2) => {
      const s1Start = moment(s1.date.end, 'MM/DD/YYYY');
      const s2Start = moment(s1.date.end, 'MM/DD/YYYY');

      if (s1Start.isBefore(s2Start)) {
        return 1;
      }
      else if (s2Start.isBefore(s1Start)) {
        return -1;
      }

      return 0;
    });

    const newLeague = await updateLeague(league, schedulesThatApply);

    console.log('O leagueUpdater: 142');
    await coll.findOneAndUpdate({
      '_id': ObjectId(league._id)
    }, {
      $set: {'teams': newLeague.teams, updated: moment().format('MM-DD-YYYY')}
    });
    console.log('D leagueUpdater: 142');

    console.log(`finished updating league. ${league.name}`);
  });
};

module.exports = {
  update
};
