import {expect} from 'chai';
import cheerio from 'cheerio';
import sinon from 'sinon';
import moment from 'moment';

// import EspnUpdater from '../../../src/scrapers/espn/update';
import { EspnUpdater } from '../../lib/scrapers/espn/update';

describe('Testing the ESPN scraper', () => {
  const sandbox = sinon.sandbox.create();

  afterEach(() => {
    sandbox.reset();
  });

  it ('should turn row into score object', () => {
    const row = cheerio.load(`
      <div>
        <div class="full-name">Don Finklestein</div>
        <div class="position">T6</div>
        <div class="totalScore">423</div>
        <div class="officialAmount">$34,563.01</div>
        <div class="cupPoints">14</div>
        <div class="round1">72</div>
        <div class="round2">62</div>
        <div class="round3">81</div>
        <div class="relativeScore">-3</div>
      </div>
    `);

    const result = (new EspnUpdater()).parseResultRow(row, row);

    expect(result.firstName).to.equal('Don');
    expect(result.lastName).to.equal('Finklestein');
    expect(result.position.pos).to.equal(6);
    expect(result.position.tied).to.be.true;
    expect(result.cupPoints).to.equal(14);
    expect(result.officialAmount).to.equal(34563.01);
    expect(result.rounds.length).to.equal(3);
    expect(result.rounds[2]).to.equal(81);
  });

  it('should find each row in the results', () => {
    const html = `
      <div>
        <div class="player-overview" />
        <div class="player-overview" />
        <div class="player-overview" />
        <div class="player-overview" />
        <div class="player-overview" />
        <div class="players-overview" />
        <div class="player-overview" />
      </div>
    `;

    const updater = new EspnUpdater();
    const parseStub = sinon.stub(updater, 'parseResultRow');
    parseStub.returns(true);

    const results = updater.scrapeScheduleResults(html);
    expect(results.length).to.equal(6);
  });

  it ('should parse the date correctly', () => {
    const espn = new EspnUpdater();

    const fullDate = espn.parseDate('Mar 30', 2015, 2016);
    expect(fullDate.format('MM/DD/YYYY')).to.equal('03/30/2016');

    const oldDate = espn.parseDate('Oct 21', 2017, 2018);
    expect(oldDate.format('MM/DD/YYYY')).to.equal('10/21/2017');

    const midDate = espn.parseDate('Dec 3', 2017, 2018);
    expect(midDate.format('MM/DD/YYYY')).to.equal('12/03/2017');

    const newDate = espn.parseDate('Jan 1', 2017, 2018);
    expect(newDate.format('MM/DD/YYYY')).to.equal('01/01/2018');
  });

  it('should sanitize the date range correctly', () => {
    const seasonText = '2017-2018';
    const espn = new EspnUpdater();

    const firstRange = 'Dec 12 - Feb 3';
    const firstResult = espn.sanitizeDate(seasonText, firstRange);
    expect(firstResult.start).to.equal('12/12/2017');
    expect(firstResult.end).to.equal('02/03/2018');
  });
});
