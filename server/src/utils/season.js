const moment = require('moment');
const isNil = require('lodash/isNil');

const getSeason = (date = moment()) => {
  if (date.month() >= 9 && date.month() < 11) {
    return date.year() + 1;
  }

  return date.year();
};

module.exports = {
  getSeason
};
