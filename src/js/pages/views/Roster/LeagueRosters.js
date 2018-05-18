import React from 'react';
import PropTypes from 'prop-types';

import isNil from 'lodash/isNil';
import inject from '../../../services/inject';
import { observer } from 'mobx-react';

import PreDraft from './PreDraft';
import Draft from './Draft';
import RosterView from './RosterView';

@inject('LeagueService', 'RosterService', 'AuthService')
@observer
class LeagueRosters extends React.Component {

  initializing = false;

  constructor(props) {
    super(props);
    this.state = {
      lastSelectedLeague: undefined
    };
  }

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

    const { RosterService, LeagueService, AuthService } = this.props;
    const { draftStatus } = RosterService;

    if (isNil(draftStatus) || isNil(draftStatus.draft)) {
      return;
    }

    if (draftStatus.draft.state === 'PREDRAFT') {
      return this.getPredraft(availablePlayers, myDraftList);
    }

    const myTeam = RosterService.getRoster(
      LeagueService.selectedLeague._id,
      AuthService.me._id
    );


    if (draftStatus.draft.state === 'INPROGRESS') {

      return <Draft
        leagueId={LeagueService.selectedLeague._id}
        teamName={LeagueService.getTeamNameFromIdForSelectedLeague}
        roster={myTeam.currentRoster.toJS()}
        me={this.props.AuthService.me._id}
      />;
    }

    return <RosterView team={myTeam} />;
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

  async reinit() {
    const ls = this.props.LeagueService;
    const rs = this.props.RosterService;

    if (isNil(ls.selectedLeague)) {
      return;
    }

    await rs.getAvailablePlayers(ls.selectedLeague, true);
    await rs.getDraftStatus(ls.selectedLeague);

    if (!isNil(rs.draft) && (rs.draft.state === 'PREDRAFT' ||
      rs.draft.state === 'INPROGRESS')) {
      rs.getMyDraftList(ls.selectedLeague, true);
    }

    this.setState({
      ...this.state,
      lastSelectedLeague: ls.selectedLeague
    });
  }

  componentDidMount() {
    if (!isNil(this.props.LeagueService.selectedLeague._id)) {
      this.reinit();
    }
  }

  async componentWillReact() {
    if (!isNil(this.state) &&
      this.state.lastSelectedLeague !==
      this.props.LeagueService.selectedLeague &&
      this.initializing === false) {
      this.initializing = true;
      await this.reinit();
      this.initializing = false;
    }
  }

  render() {
    //eslint-disable-next-line
    const {selectedLeague} = this.props.LeagueService;

    //eslint-disable-next-line
    const {availablePlayers, myDraftList, draft} = this.props.RosterService;

    return (
      <div className="rosters">
        { this.getContent(availablePlayers, myDraftList) }
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
