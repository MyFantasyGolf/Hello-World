const isNil = require('lodash/isNil');
const resultsApi = require('../db/resultsApi');
const season = require('../utils/season');
const moment = require('moment');

const getGolfers = async (request, response) => {
  const season = isNil(request.params.season) ?
    season.getSeason(moment()) :
    request.params.season;

  const golfers = await resultsApi.getRoster(season);

  response.send(golfers);
};

const getSchedule = async (request, response) => {
  const season = isNil(request.params.season) ?
    season.getSeason(moment()) :
    request.params.season;

  const schedule = await resultsApi.getSchedules(season);

  response.send(schedule);
};

module.exports = {
  getGolfers,
  getSchedule
};
