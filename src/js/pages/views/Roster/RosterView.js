import React from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';

import PlayerRow from './PlayerRow';

class RosterView extends React.Component {

  getRosterListView = (myRoster) => {
    if (isNil(myRoster)) {
      return [];
    }

    return myRoster
      .map( (player2, index2) => {
        return <PlayerRow
          key={index2}
          player={player2}
          add={false}
          remove={false}
          move={false}
        />;
      });
  }

  render() {

    const { team } = this.props;

    return (
      <div className="roster-lists">

        <div className="roster-list">
          <div className="title">
            My Roster
          </div>
          <div className="body">
            {this.getRosterListView(team.currentRoster)}
          </div>
        </div>
      </div>
    );
  }
}

RosterView.propTypes = {
  team: PropTypes.shape({
    user: PropTypes.string,
    name: PropTypes.string,
    currentRoster: PropTypes.array
  })
};

RosterView.defaultProps = {
  team: {
    user: '',
    name: 'None',
    currentRoster: []
  }
};

export default RosterView;
