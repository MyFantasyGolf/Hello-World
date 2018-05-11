const conn = require('./connection');
const season = require('../utils/season');
const moment = require('moment');
const isNil = require('lodash/isNil');
const shuffle = require('lodash/shuffle');
const ObjectId = require('mongodb').ObjectId;

const getDraft = async (leagueId) => {
  const db = await conn.db;
  const coll = db.collection('leagues');

  try {
    const draft = await coll.find({
      '_id': ObjectId(leagueId),
      'season': season.getSeason(moment())
    }, {
      fields: {draft: 1}
    }).toArray();

    return draft[0];
  }
  catch(err) {
    console.log(`Error get the draft for ${leagueId}: ${err}`);
  }
};

const getDraftList = async (leagueId, userId) => {
  const db = await conn.db;
  const coll = db.collection('leagues');

  try {
    const list = await coll.find({
      '_id': ObjectId(leagueId),
      'season': season.getSeason(moment())
    })
    .project({
      teams: { $elemMatch: {"user": userId}}
    }).toArray();

    return list[0].teams[0].draftList;
  }
  catch(err) {
    console.log(`Error getting draft list for ${userId}: ${err}`);
  }

  return [];
};

const updateDraftList = async (leagueId, userId, draftList) => {
  const db = await conn.db;
  const coll = db.collection('leagues');

  await coll.update({
    '_id': ObjectId(leagueId),
    'season': season.getSeason(moment()),
    'teams.user': userId
  }, {
    '$set': {
      'teams.$.draftList': draftList
    }
  });
};

const buildRounds = (draftOptions) => {

  const rounds = [];

  for (let i = 0; i < draftOptions.numberOfRounds; i++) {
    let order = [];

    if (draftOptions.draftOrderType === 'normal') {
      order = draftOptions.draftOrder;
    }
    else if (draftOptions.draftOrderType === 'serpentine') {
      if (i !== 0) {
        draftOptions.draftOrder.reverse();
      }

      order = draftOptions.draftOrder;
    }
    else {
      order = shuffle(draftOptions.draftOrder);
    }

    const picks = order.map( (team) => {
      return {
        team: team._id,
        pick: null
      };
    });

    rounds.push(picks);
  }

  return rounds;
};

const startDraft = async (leagueId, draftOptions) => {
  const db = await conn.db;
  const coll = db.collection('leagues');

  const rounds = buildRounds(draftOptions);

  await coll.update({
    '_id': ObjectId(leagueId),
    'season': season.getSeason(moment())
  },
  { '$set':
    {
      draft: {
        settings: draftOptions,
        state: 'INPROGRESS',
        rounds: rounds
      }
    }
  });
};

module.exports = {
  getDraftList,
  getDraft,
  updateDraftList,
  startDraft
};
