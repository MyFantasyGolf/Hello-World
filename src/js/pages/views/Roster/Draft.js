import React from 'react';
import PropTypes from 'prop-types';

import inject from '../../../services/inject';
import { observer } from 'mobx-react';
import isNil from 'lodash/isNil';

import PlayerRow from './PlayerRow';

@inject('RosterService')
@observer
class Draft extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      interval: -1
    };
  }

  refreshView = async () => {
    this.props.RosterService.getDraftStatus(this.props.leagueId);
    this.props.RosterService.getAvailablePlayers(this.props.leagueId);
    this.props.RosterService.getMyDraftList(this.props.leagueId);
  }

  componentDidMount() {
    this.refreshView();
    const interval = setInterval( this.refreshView, 15000);

    this.setState({
      ...this.state,
      interval
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  choosePlayer = (player) => {

    const { draftStatus } = this.props.RosterService;

    this.props.RosterService.makePick(
      this.props.leagueId,
      draftStatus.round,
      draftStatus.pick,
      player
    );

    // this.refreshView();
  }

  getAvailablePlayersView(availablePlayers) {
    const { draftStatus } = this.props.RosterService;
    const pickable = (this.props.me === draftStatus.currentPick);

    return availablePlayers.map( (ap, index) => {
      return (
        <PlayerRow
          key={index}
          player={ap}
          add={pickable}
          remove={false}
          move={false}
          addClicked={this.choosePlayer}
        />
      );
    });
  }

  getMyDraftListView = (myDraftList) => {
    if (isNil(myDraftList)) {
      return [];
    }

    return myDraftList
      .filter( (player, index) => {
        return index < 5;
      })
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

  getMyRosterView = (roster) => {
    return roster.map( (player, index) => {
      return <PlayerRow
        key={index}
        player={player}
        add={false}
        remove={false}
        move={false}
      />;
    });
  }

  render() {

    const {
      myDraftList,
      availablePlayers,
      draftStatus
    } = this.props.RosterService;

    if ( draftStatus.draft.state !== 'INPROGRESS') {
      return <div/>;
    }

    const teamName =
      this.props.teamName(this.props.leagueId, draftStatus.currentPick);

    const clockClass = draftStatus.currentPick === this.props.me ?
      'mypick' : '';

    const { roster } = this.props;

    return (
      <div>
        <div className="pick-info">
          {`Round ${draftStatus.round} Pick ${draftStatus.pick}`}
        </div>
        <div className={`pick-info last ${clockClass}`}>
          <span>On the clock: </span>
          <span className="team">{`${teamName.name}`}</span>
        </div>

        <div className="roster-lists">

          <div className="roster-list">
            <div className="title">
              Available Golfers
            </div>
            <div className="body">
              {this.getAvailablePlayersView(availablePlayers)}
            </div>
          </div>

          <div className="roster-list">
            <div className="roster-list">
              <div className="title">
                My Top 5
              </div>
              <div className="body">
                {this.getMyDraftListView(myDraftList)}
              </div>
            </div>

            <div className="roster-list">
              <div className="title">
                My Roster
              </div>
              <div className="body">
                {this.getMyRosterView(roster)}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

Draft.propTypes = {
  RosterService: PropTypes.object,
  leagueId: PropTypes.string,
  teamName: PropTypes.func,
  me: PropTypes.string,
  roster: PropTypes.array
};

export default Draft;
