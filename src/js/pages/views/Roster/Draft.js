import React from 'react';
import PropTypes from 'prop-types';

import isNil from 'lodash/isNil';

const Draft = ({draft, availablePlayers, myDraftList}) => {

  const roundIndex = draft.rounds.findIndex( (round) => {
    const hasEmptyPick = round.find( (pick) => {
      return isNil(pick.pick);
    });

    return !isNil(hasEmptyPick);
  });

  const whosUp = draft.rounds[roundIndex].find( (picks) => {
    return isNil(picks.pick);
  });

  const myList = myDraftList.slice(0,2);

  return (
    <div>
      <div>{`Round ${roundIndex + 1}`}</div>
      <div>{`${whosUp.team} is up`}</div>
      <div>Recommendations</div>
      <div>
        {
          myList.map( (p, index) => {
            return <div key={index}>{p.key}</div>;
          })
        }
      </div>
      <div>Available Players</div>
      <div>
        {
          availablePlayers.map( (p, index) => {
            return <div key={index}>{p.key}</div>;
          })
        }
      </div>
    </div>
  );
};

Draft.propTypes = {
  draft: PropTypes.object,
  availablePlayers: PropTypes.any,
  myDraftList: PropTypes.any
};

Draft.defaultProps = {
  availablePlayers: [],
  myDraftList: []
};

export default Draft;
