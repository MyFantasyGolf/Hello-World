import React from 'react';
import PropTypes from 'prop-types';

class PreDraft extends React.Component {

  getAvailablePlayers() {
    return this.props.availablePlayers.map( (player, index) => {
      return (
        <div key={`${player.key}-${index}`} className="player">
          <div>{`${player.lastName}, ${player.firstName}`}</div>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <div>Pre-Draft</div>
        <div>Available Players</div>
        { this.getAvailablePlayers() }
      </div>
    );
  }
}

PreDraft.propTypes = {
  availablePlayers: PropTypes.object
};

export default PreDraft;
