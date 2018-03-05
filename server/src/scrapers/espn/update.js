const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const request = require('request');
const isNil = require('lodash/isNil');

const conn = require('../../db/connection');

const loadHtmlFromFile = (db, htmlFile) => {

};

const update = (htmlFile) => {

  updateSchedules(htmlFile).then(updateScheduleDetails);
  // for each schedule fill in the details
}

const updateSchedules = (htmlFile) => {
  const promise = new Promise( (resolve, reject) => {
    const webSchedules = getSchedule(htmlFile);

    const savedSchedules = conn.db.getSchedules().then( (err, schedules) => {
      const schedulesToFix = webSchedules.filter( (ws) => {
        if (isNil(schedules)) {
          return true;
        }

        const found = schedules.find( (ss) => {
          if (ss.date === ws.date) {
            return ss.complete;
          }

          return false;
        });
      });

      // save these new schedules

      resolve(schedulesToFix);
    });
  });

  return promise;
};

const updateScheduleDetails = (schedules) => {
  schedules.forEach( (schedule) => {
    const results = getScheduleResults(schedule);

  });
};

const getSchedule = (htmlFile) => {
  let html;

  if (!isNil(htmlFile)) {
    const data = fs.readFileSync(htmlFile).toString();
    return scrapeSchdule(data);
  }
  else {
    request.get('http://www.espn.com/golf/schedule', (err, response, body) => {
      return scrapeSchdule(body);
    });
  }
};

const getScheduleResults = (schedule) => {
  request.get(schedule.espnUrl, (err, response, body) => {
    return scrapeScheduleResults(body);
  });
};

const scrapeSchdule = (html) => {
  const $ = cheerio.load(html);
  const rows = $('tr');

  const entries = [];

  rows.each( (index, row) => {
    const tds = $('td', '', row);

    const texts = tds.map( (index, td) => {

      let elm = td;

      if (td.children.length > 0 && td.children[0].name === 'b') {
        elm = td.children[0];
      }

      const a = $('a', '', elm);
      const arr = [];

      if (!isNil(a)) {
        arr.push(a.attr('href'));
      }

      if (elm.children.length > 1) {
        arr.push($(elm.children[0]).text());
        arr.push($(elm.children[2]).text());
      }
      else {
        arr.push($(td).text());
      }

      return arr;
    }).get();

    entries.push(texts);
  }).get();

  const tournaments = entries.filter( (entry) => {
    if (entry.length < 10) {
      return false;
    }

    if (entry[1] === 'DATE') {
      return false;
    }

    return true;
  }).map( (tourney) => {
    if (tourney.length === 10 || tourney.length === 11) {
      const t = {
        date: tourney[1],
        espnUrl: tourney[2],
        title: tourney[3],
        course: tourney[4],
        winner: tourney[6],
        score: tourney[8],
        purse: tourney[9]
      };

      if (tourney.length === 11) {
        t.winner = tourney[8];
        t.purse = tourney[10];
        t.score = ''
      }

      return t;
    }

    return {
      espnUrl: null,
      date: tourney[1],
      title: tourney[4],
      course: tourney[5],
      lastWinner: tourney[9],
      purse: tourney[11]
    };
  });

  return tournaments;
};

const scrapeScheduleResults = (resultsPage) => {
  const $ = cheerio.load(resultsPage);
  const rows = $('.player-overview');
  const results = [];

  rows.each( (index, row) => {
    results.push(parseResultRow($, row));
  });

  return results;
};

const parseResultRow = ($, row) => {
  const name = $('.full-name', '', row).text();
  const positionStr = $('.position', '', row).text();
  const totalScore = $('.totalScore', '', row).text();
  let officialAmountStr = $('.officialAmount', '', row).text();
  const cupPoints = $('.cupPoints', '', row).text();
  const round1 = $('.round1', '', row).text();
  const round2 = $('.round2', '', row).text();
  const round3 = $('.round3', '', row).text();
  const round4 = $('.round4', '', row).text();
  const relativeScore = $('.relativeScore', '', row).text();

  const nameArray = name.split(' ');
  const lastName = nameArray.pop();
  const firstName = nameArray.join(' ');
  const position = {
    tied: positionStr.startsWith('T'),
    pos: (positionStr.startsWith('T')) ? parseInt(positionStr.substr(1)) : positionStr
  };
  const rounds = [];

  (!isNil(round1)) ? rounds.push(parseInt(round1)) : null;
  (!isNil(round2)) ? rounds.push(parseInt(round2)) : null;
  (!isNil(round3)) ? rounds.push(parseInt(round3)) : null;
  (!isNil(round4)) ? rounds.push(parseInt(round4)) : null;

  officialAmountStr = officialAmountStr.replace(/,/g, '');
  officialAmountStr = officialAmountStr.replace(/\$/g, '');
  const officialAmount = parseFloat(officialAmountStr);

  return {
    firstName,
    lastName,
    totalScore: parseInt(totalScore),
    cupPoints: parseInt(cupPoints),
    relativeScore: parseInt(relativeScore),
    rounds,
    position,
    officialAmount
  };
};

module.exports = {
  update,
  scrapeScheduleResults
};
