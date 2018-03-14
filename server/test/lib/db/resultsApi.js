'use strict';

var isNil = require('lodash/isNil');
var conn = require('./connection');

var saveTourSchedule = function saveTourSchedule(yearObj, schedule) {};

var getSchedules = function getSchedules() {

  return new Promise(function (resolve, reject) {
    conn.db.then(function (db) {
      var coll = db.collection('schedules');

      coll.find({}).toArray(function (err, results) {

        if (!isNil(err)) {
          reject(err);
        }

        resolve(results);
      });
    });
  });
};

module.exports = {
  saveTourSchedule: saveTourSchedule,
  getSchedules: getSchedules
};
//# sourceMappingURL=resultsApi.js.map