import React from 'react';
import PropTypes from 'prop-types';

import inject from '../../../services/inject';
import { observer } from 'mobx-react';

@inject('RosterService', 'LeagueService')
@observer
class AvailablePlayerTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      availablePlayers: []
    };
  }

  componentDidMount() {
    const { LeagueService, RosterService } = this.props;
    RosterService.getAvailablePlayers(
      LeagueService.selectedLeague
    ).then( (availablePlayers) => {
      this.setState({
        availablePlayers
      });
    });
  }

  buildPlayerRows = () => {
    const { availablePlayers } = this.state;

    const playerElements = availablePlayers.map( (player, index) => {
      return (
        <div className="player" key={`${player.key}-${index}`}>
          <div className="add-player">
            <span
              className="golf-icons-plus"
              onClick={() => { this.props.addPlayer(player); }}
            />
          </div>
          <div className="name">
            {`${player.firstName} ${player.lastName}`}
          </div>
        </div>
      );
    });

    return playerElements;
  }

  render() {
    return (
      <div className="roster-table available-player-table">
        <div className="roster-lists">
          <div className="roster-list">
            <div className="title">
              Available Golfers
            </div>
            <div className="body">
              {this.buildPlayerRows()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AvailablePlayerTable.propTypes = {
  LeagueService: PropTypes.object,
  RosterService: PropTypes.object,
  addPlayer: PropTypes.func
};

export default AvailablePlayerTable;
