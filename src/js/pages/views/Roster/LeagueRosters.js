import React from 'react';
import PropTypes from 'prop-types';

import isNil from 'lodash/isNil';
import inject from '../../../services/inject';
import { observer } from 'mobx-react';

import PreDraft from './PreDraft';

@inject('LeagueService', 'RosterService', 'AuthService')
@observer
class LeagueRosters extends React.Component {

  getPredraft(availablePlayers, myDraftList) {
    return <PreDraft
      availablePlayers={ availablePlayers }
      myDraftList={ myDraftList }
      addPlayerToMyList={this.addPlayerToMyList}
      removePlayerFromMyList={this.removePlayerFromMyList}
      movePlayerUp={this.movePlayerUp}
      movePlayerDown={this.movePlayerDown}
      isCommisioner={this.props.LeagueService.isCommisioner(
        this.props.AuthService.me._id)}
      startDraft={this.startDraft}
      teams={this.props.LeagueService.selectedLeague.teams.toJS()}
    />;
  }

  getContent(
    availablePlayers = [],
    myDraftList = []) {

    const { selectedLeague } = this.props.LeagueService;

    if (isNil(selectedLeague)) {
      return;
    }

    if (selectedLeague.draft.state === 'PREDRAFT') {
      return this.getPredraft(availablePlayers, myDraftList);
    }

    return <div>Not Implemented</div>;
  }

  addPlayerToMyList = (player) => {
    this.props.RosterService.addPlayerToMyList(
      this.props.LeagueService.selectedLeague, player);
  }

  removePlayerFromMyList = (player) => {
    this.props.RosterService.removePlayerFromMyList(
      this.props.LeagueService.selectedLeague, player);
  }

  movePlayerUp = (player) => {
    this.movePlayer(player, true);
  }

  movePlayerDown = (player) => {
    this.movePlayer(player, false);
  }

  movePlayer = (player, up = true) => {
    this.props.RosterService.movePlayer(
      this.props.LeagueService.selectedLeague, player, up);
  }

  startDraft = (draftOptions) => {
    this.props.RosterService.startDraft(
      this.props.LeagueService.selectedLeague, draftOptions);
  }

  componentDidMount() {
    this.componentWillReact();
  }

  componentWillReact() {
    const ls = this.props.LeagueService;
    const rs = this.props.RosterService;

    if (!isNil(ls.selectedLeague)) {
      rs.getAvailablePlayers(ls.selectedLeague);

      if (ls.selectedLeague.draft.state === 'PREDRAFT' ||
        ls.selectedLeague.draft.state === 'INPROGRESS') {
        rs.getMyDraftList(ls.selectedLeague);
      }
    }
  }

  render() {
    //eslint-disable-next-line
    const {selectedLeague} = this.props.LeagueService;
    const ap = this.props.RosterService.availablePlayers;
    const draftList = this.props.RosterService.myDraftList;

    return (
      <div className="rosters">
        { this.getContent(ap, draftList) }
      </div>
    );
  }
}

LeagueRosters.propTypes = {
  LeagueService: PropTypes.object,
  RosterService: PropTypes.object,
  AuthService: PropTypes.object
};

export default LeagueRosters;
