import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import isNil from 'lodash/isNil';
import inject from '../../../services/inject';
import { observer } from 'mobx-react';

import OkCancelDialog from '../../../widgets/OkCancelDialog';

@inject('RosterTableService')
@observer
class RosterTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      releaseDialog: false,
      chosenGolfer: null
    };
  }

  componentDidMount() {
    const { currentRoster, activeRosterMap } = this.props;
    this.props.RosterTableService.loadPlayerList(
      currentRoster, activeRosterMap
    );
  }

  componentDidUpdate(previousProps) {

    const { currentRoster, activeRosterMap } = this.props;

    if (previousProps.currentRoster === currentRoster &&
    previousProps.activeRosterMap === activeRosterMap) {
      return;
    }

    this.props.RosterTableService.loadPlayerList(
      currentRoster, activeRosterMap
    );
  }

  buildPlayerRows = (computedRoster) => {
    return computedRoster.map( (golfer) => {
      return(
        <div className="player" key={golfer.key}>
          <div
            style={{
              color:
                golfer.active === true ?
                  '#386331' : 'gray',
              textAlign: 'center'
            }}
          >
            <div
              className={`icon table-row ${golfer.active === true ?
                'golf-icons-star-full' : 'golf-icons-star-empty'}`}
              onClick={() => { this.activeClicked(golfer); }}
            />
          </div>
          <div className="name">
            {golfer.name}
          </div>
          <div className="score">
            {golfer.score}
          </div>
          <div className="actions">
            { golfer.current &&
              <span
                className="golf-icons-cross2"
                onClick={() => { this.release(golfer); }}/>
            }
          </div>
        </div>
      );
    });
  }

  activeClicked = (golfer) => {
    const { activeChange } = this.props;

    activeChange(golfer);
  }

  release = (golfer) => {
    this.setState({
      ...this.state,
      releaseDialog: true,
      chosenGolfer: golfer
    });
  }

  doRelease = async (doIt) => {
    if (doIt) {
      await this.props.releasePlayer(this.state.chosenGolfer);
    }

    this.setState({
      ...this.state,
      releaseDialog: false,
      chosenGolfer: null
    });
  }

  render() {

    const { RosterTableService } = this.props;
    const computedRoster = RosterTableService.playerList;

    const playerRows = this.buildPlayerRows(computedRoster);
    const golferName = isNil(this.state.chosenGolfer) ?
      '' : this.state.chosenGolfer.name;

    return (
      <div className="roster-table-container">

        <OkCancelDialog
          open={this.state.releaseDialog}
          callback={this.doRelease}
          title="Are you sure?"
          text={`Do you really want to drop ${golferName}?`}
        />

        <div className="roster-table">
          <div className="roster-lists">
            <div className="roster-list">
              <div className="title">
                <div>My Roster</div>
                {this.props.buttonPanel}
              </div>
              <div className="body">
                {playerRows}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RosterTable.propTypes = {
  currentRoster: PropTypes.any,
  activeRosterMap: PropTypes.any,
  RosterTableService: PropTypes.object,
  activeChange: PropTypes.func,
  releasePlayer: PropTypes.func,
  buttonPanel: PropTypes.object
};

export default RosterTable;
