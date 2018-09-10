const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const request = require('request');
const asyncRequest = require('request-promise');
const moment = require('moment');
const sleep = require('../../utils/sleep');
const isNil = require('lodash/isNil');

const season = require('../../utils/season');
const resultsApi = require('../../db/resultsApi');

class EspnUpdater {

  async shouldIUpdate() {
    const year = season.getSeason(moment());
    const lastUpdated = await resultsApi.lastScheduleUpdate(year);
    return moment().diff(lastUpdated, 'hours') > 23;
  }

  async update() {

    const shouldUpdate = await this.shouldIUpdate();

    if ( shouldUpdate === false) {
      return;
    }

    const html = await asyncRequest('http://www.espn.com/golf/schedule');
    const schedulez = await this.updateSchedules(html);
  }

  async updateSchedules(html) {
    const webSchedules = this.scrapeSchdule(html);

    const schedules = await resultsApi.getSchedules(webSchedules[0].year);
    const schedulesToFix = webSchedules.filter( (ws) => {
      if (isNil(schedules)) {
        return true;
      }

      const found = schedules.find( (ss) => {
        if (ss.key === ws.title.toLowerCase().replace(/ /g, '')) {
          return ss.complete;
        }

        return false;
      });

      return true;
    });

    // save these new schedules
    schedulesToFix.forEach( (schedule) => {
      schedule.complete = false;
      resultsApi.saveTourSchedule(schedule)
    });

    return schedulesToFix;
  }

  /**
  Run through the schedules and try to fill in results for
  tournaments that have them.
  **/
  async updateResults() {

    const shouldIUpdate = await this.shouldIUpdate();

    if (shouldIUpdate === false) {
      return;
    }

    const year = season.getSeason();

    const schedules = await resultsApi.getSchedules(year);

    for (let i = 0; i < schedules.length; i++ ) {
    // schedules.forEach( async (schedule) => {
      const schedule = schedules[i];

      if (schedule.complete === true || isNil(schedule.espnUrl)) {
        console.log(`Skipping ${schedule.title}`);
        continue;
      }

      console.log(`Retrieving results for ${schedule.title}`);

      const html = await asyncRequest(`http://espn.com${schedule.espnUrl}`);
      if (!isNil(html)) {
        const results = this.scrapeScheduleResults(html);
        await resultsApi.saveResults(schedule, results);
      }

      const sleeper = parseInt((Math.random() * 3) + 1);
      console.log(`Sleeping for ${sleeper} seconds.\n`);
      await sleep.sleep(sleeper);
    }
  }

  scrapeSchdule(html) {
    const $ = cheerio.load(html);
    const rows = $('tr');

    const firstSeasonString = $($('select option')[1]).text();
    const secondSeasonString = $($('select option')[2]).text();
    const thisYear = season.getSeason();
    const testString = `${this.Year - 1}-${thisYear-2000}`;

    const seasonString = firstSeasonString.indexOf(testString) !== -1 ?
      firstSeasonString : secondSeasonString;

    console.log(`${firstSeasonString} ${secondSeasonString} ${seasonString}`);

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

      const date = this.sanitizeDate(seasonString, tourney[1]);
      const year = season.getSeason(moment(date.start, 'MM/DD/YYYY'));

      if (tourney.length === 10 || tourney.length === 11) {

        const t = {
          date: date,
          year,
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
        year,
        date: date,
        title: tourney[4],
        course: tourney[5],
        lastWinner: tourney[9],
        purse: tourney[11]
      };
    });

    return tournaments;
  }

  sanitizeDate(seasonText, dateString) {
    const years = seasonText.split('-');
    const startYear = parseInt(years[0]);
    let endYear = parseInt(years[1]);

    if (endYear < 2000) {
      endYear = endYear + 2000;
    }

    const days = dateString.split('-');

    const start = this.parseDate(days[0].trim(), startYear, endYear).format('MM/DD/YYYY');
    const end = this.parseDate(days[1].trim(), startYear, endYear).format('MM/DD/YYYY');

    return {
      start,
      end
    };
  }

  parseDate(dateString, startYear, endYear) {
    const mDate = moment(dateString, 'MMM DD');

    // if it's between october and december its last year
    if (mDate.month() >= 9 && mDate.month() < 12) {
      mDate.year(startYear);
    }
    else {
      mDate.year(endYear);
    }

    return mDate;
  }

  /**
  This is where we look for the results of everything
  **/
  scrapeScheduleResults(resultsPage) {
    const $ = cheerio.load(resultsPage);
    const rows = $('.player-overview');
    const results = [];

    rows.each( (index, row) => {
      results.push(this.parseResultRow($, row));
    });

    return results;
  }

  parseResultRow($, row) {
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

    // const name = row('.full-name').text();
    // const positionStr = row('.position').text();
    // const totalScore = row('.totalScore').text();
    // let officialAmountStr = row('.officialAmount').text();
    // const cupPoints = row('.cupPoints').text();
    // const round1 = row('.round1').text();
    // const round2 = row('.round2').text();
    // const round3 = row('.round3').text();
    // const round4 = row('.round4').text();
    // const relativeScore = row('.relativeScore').text();


    const nameArray = name.split(' ');
    const lastName = nameArray.pop();
    const firstName = nameArray.join(' ');
    const position = {
      tied: positionStr.startsWith('T'),
      pos: (positionStr.startsWith('T')) ? parseInt(positionStr.substr(1)) : positionStr
    };
    const rounds = [];

    (!isNil(round1) && round1.trim().length !== 0) ? rounds.push(parseInt(round1)) : null;
    (!isNil(round2) && round2.trim().length !== 0) ? rounds.push(parseInt(round2)) : null;
    (!isNil(round3) && round3.trim().length !== 0) ? rounds.push(parseInt(round3)) : null;
    (!isNil(round4) && round4.trim().length !== 0) ? rounds.push(parseInt(round4)) : null;

    officialAmountStr = officialAmountStr.replace(/,/g, '');
    officialAmountStr = officialAmountStr.replace(/\$/g, '');
    const officialAmount = parseFloat(officialAmountStr);

    return {
      firstName,
      lastName,
      key: `${firstName.toLowerCase().replace(/[\. ,:-]+/g, '')}+${lastName.toLowerCase().replace(/[\. ,:-]+/g, '')}`,
      totalScore: parseInt(totalScore),
      cupPoints: parseInt(cupPoints),
      relativeScore: parseInt(relativeScore),
      rounds,
      position,
      officialAmount
    };
  }
}

module.exports = {
  EspnUpdater
};
