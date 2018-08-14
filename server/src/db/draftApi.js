const conn = require('./connection');
const season = require('../utils/season');
const moment = require('moment');
const isNil = require('lodash/isNil');
const shuffle = require('lodash/shuffle');
const ObjectId = require('mongodb').ObjectId;
const Cache = require('timed-cache');

const leagueApi = require('./leagueApi');

const draftCache = new Cache({ defaultTtl: 10 * 60 * 1000 });

const getDraft = async (leagueId) => {
  const db = await conn.db;
  const coll = db.collection('leagues');

  try {
    const draft = await coll.find({
      '_id': ObjectId(leagueId),
      'season': season.getSeason(moment())
    }, {
      projection: {draft: 1}
    }).toArray();

    return draft[0].draft;
  }
  catch(err) {
    console.log(`Error get the draft for ${leagueId}: ${err}`);
  }
};

const updateDraft = async (leagueId, draft) => {
  const db = await conn.db;
  const coll = db.collection('leagues');

  try {
    await coll.findOneAndUpdate({
      '_id': ObjectId(leagueId),
      'season': season.getSeason(moment())
    },
    { $set: {'draft': draft }});
  }
  catch(err) {
    console.log(`Error saving draft for league ${legaueId}`);
  }
}

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

    const availablePlayers = await leagueApi.getAvailablePlayers(leagueId);

    const filteredList = list[0].teams[0].draftList.filter( (player) => {
      const index = availablePlayers.findIndex( (ap) => {
        return ap.key === player.key;
      });

      return index !== -1;
    });

    return filteredList;
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
        team: team.user,
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


const draftStatus = async (leagueId, force = false) => {
  // is it in Cache
  const myDraftStatus = draftCache.get(leagueId);

  if (!isNil(myDraftStatus) && force === false) {
    return myDraftStatus;
  }

  const draft = await getDraft(leagueId);

  if (isNil(draft) || draft.state === 'PREDRAFT' ||
    draft.state === 'FINISHED') {
    return { draft: draft };
  }

  const roundIndex = draft.rounds.findIndex( (round) => {
    const hasEmptyPick = round.find( (pick) => {
      return isNil(pick.pick);
    });

    return !isNil(hasEmptyPick);
  });

  // draft is over
  if (roundIndex === -1) {
    draft.state = 'FINISHED';
    draft.completed = moment().format('MM-DD-YYYY');
    draftCache.remove(leagueId);
    await updateDraft(leagueId, draft);
    return { draft: draft };
  }

  const whosUpIndex = draft.rounds[roundIndex].findIndex( (picks) => {
    return isNil(picks.pick);
  });

  const newStatus = {
    round: (roundIndex + 1),
    pick: (whosUpIndex + 1),
    currentPick: draft.rounds[roundIndex][whosUpIndex].team,
    draft: draft
  };

  draftCache.put(leagueId, newStatus);
  return newStatus;
}

const makePick = async (leagueId, round, pick, selection) => {

  const draft = await getDraft(leagueId);
  draft.rounds[round][pick].pick = selection;

  await updateDraft(leagueId, draft);

  const league = await leagueApi.getLeague(leagueId);

  const teamIndex = league.teams.findIndex( (team) => {
    return team.user === draft.rounds[round][pick].team;
  });

  league.teams[teamIndex].currentRoster.push(selection);

  await leagueApi.saveLeague(league);

  const currentStatus = await draftStatus(leagueId, true);
  draftCache.put(leagueId, currentStatus);
}

module.exports = {
  getDraftList,
  getDraft,
  updateDraftList,
  startDraft,
  makePick,
  draftStatus
};
