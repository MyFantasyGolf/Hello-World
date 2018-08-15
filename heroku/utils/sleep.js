"use strict";

var sleep = function sleep(seconds) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve();
    }, seconds * 1000);
  });
};

module.exports = {
  sleep: sleep
};
//# sourceMappingURL=sleep.js.map