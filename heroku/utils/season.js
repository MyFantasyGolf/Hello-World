'use strict';

var moment = require('moment');
var isNil = require('lodash/isNil');

var getSeason = function getSeason() {
  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : moment();

  if (date.month() >= 9 && date.month() < 11) {
    return date.year() + 1;
  }

  return date.year();
};

module.exports = {
  getSeason: getSeason
};
//# sourceMappingURL=season.js.map