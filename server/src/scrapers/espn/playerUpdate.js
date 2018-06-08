const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const request = require('request');
const asyncRequest = require('request-promise');
const moment = require('moment');
const isNil = require('lodash/isNil');


const season = require('../../utils/season');
const resultsApi = require('../../db/resultsApi');

class EspnPlayerUpdater {

  async shouldIUpdate() {
    const year = season.getSeason(moment());
    const lastUpdated = await resultsApi.lastPlayerUpdate(year);
    return moment().diff(lastUpdated, 'hours') > 23;
  }

  async updatePlayers(htmlFile = undefined) {
    const shouldUpdate = await this.shouldIUpdate();

    if (shouldUpdate === false) {
      return;
    }

    const year = season.getSeason(moment());

    const savedRoster = await resultsApi.getRoster(year);

    if (!isNil(savedRoster) && savedRoster.length > 0){
      return;
    }

    const html = await isNil(htmlFile) ?
      this.downloadPlayerList() :
      fs.readFileSync(htmlFile);

    const roster = this.parseHtml(html);
    roster.year = year;

    resultsApi.saveRoster(year, roster);

    return roster;
  }

  async downloadPlayerList() {
    return await asyncRequest('http://www.espn.com/golf/players');
  }

  parsePlayer($, row) {
    const tds = $('td', '', row);
    const name = $('a', '', tds[0]).text().split(', ');
    const origin = $(tds[1]).text();

    const firstName = name[1];
    const lastName = name[0];
    const key = `${firstName.toLowerCase()}+${lastName.toLowerCase()}`;

    return {
      key,
      firstName,
      lastName
    };
  }

  parseHtml(html) {
    const $ = cheerio.load(html);

    const oddrows = $('tr.oddrow');
    const evenrows = $('tr.evenrow');

    const oddPlayers = oddrows.map( (index, row) => {
      return this.parsePlayer($, row);
    }).get();
    const evenPlayers = evenrows.map( (index, row) => {
      return this.parsePlayer($, row);
    }).get();

    const players = oddPlayers.concat(evenPlayers);

    return {
      players
    };
  }
}

module.exports = {
  EspnPlayerUpdater
};
