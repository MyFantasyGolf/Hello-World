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

module.exports = {
  getGolfers
};
