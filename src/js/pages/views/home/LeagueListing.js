import React from 'react';
import PropTypes from 'prop-types';

const LeagueListing = ({league, leagueClicked}) => {
  return (
    <div className="league-listing"
      onClick={() => { leagueClicked(league); }}>
      {league.name}
    </div>
  );
};

LeagueListing.propTypes = {
  league: PropTypes.shape({
    name: PropTypes.string
  }).isRequired,
  leagueClicked: PropTypes.func.isRequired
};

export default LeagueListing;
