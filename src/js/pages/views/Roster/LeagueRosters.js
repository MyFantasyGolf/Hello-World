import React from 'react';
import PropTypes from 'prop-types';

import isNil from 'lodash/isNil';
import inject from '../../../services/inject';
import { observer } from 'mobx-react';

import PreDraft from './PreDraft';
import Draft from './Draft';
import RosterView from './RosterView';

import OkCancelDialog from '../../../widgets/OkCancelDialog';

@inject('LeagueService', 'RosterService', 'AuthService', 'LoadingService')
@observer
class LeagueRosters extends React.Component {

  initializing = false;

  constructor(props) {
    super(props);
    this.state = {
      lastSelectedLeague: undefined,
      team: {},
      activeGolferDialog: false
    };
  }

  getPredraft(availablePlayers, myDraftList) {
    return <PreDraft
      refreshTeams={this.props.LeagueService.refreshSelectedLeague}
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

  loadMyTeam = async () => {
    const {
      LeagueService,
      LoadingService,
      AuthService,
      RosterService
    } = this.props;

    LoadingService.startLoading('leagueRosters');
    await LeagueService.refreshSelectedLeague();

    const team = await RosterService.getRoster(
      LeagueService.selectedLeague._id,
      AuthService.me._id
    );
    const schedules =
      await LeagueService.getSchedulesForSelectedLeague();

    this.setState({
      ...this.state,
      team: team,
      schedules
    });

    LoadingService.stopLoading('leagueRosters');
  }

  getContent(
    availablePlayers = [],
    myDraftList = []) {

    const { RosterService, LeagueService } = this.props;
    const { draftStatus } = RosterService;

    if (isNil(draftStatus) || isNil(draftStatus.draft)) {
      return;
    }

    if (draftStatus.draft.state === 'PREDRAFT') {
      return this.getPredraft(availablePlayers, myDraftList);
    }

    if (draftStatus.draft.state === 'INPROGRESS') {

      const roster = isNil(this.state.team.currentRoster) ?
        [] : this.state.team.currentRoster.toJS();

      return <Draft
        leagueId={LeagueService.selectedLeague._id}
        teamName={LeagueService.getTeamNameFromIdForSelectedLeague}
        roster={roster}
        me={this.props.AuthService.me._id}
      />;
    }

    return (
      <RosterView
        team={this.state.team}
        schedules={this.state.schedules}
        activeChange={this.activeChange}
        releasePlayer={this.releasePlayer}
      />);
  }

  releasePlayer = async (golfer) => {

    const { LoadingService, RosterService, LeagueService } = this.props;

    LoadingService.startLoading('leagueRosters');

    await RosterService.releasePlayer(
      LeagueService.selectedLeague._id,
      golfer
    );
    await this.loadMyTeam();

    LoadingService.stopLoading('leagueRosters');
  }

  activeChange = async (golfer, schedule) => {
    const {
      LeagueService,
      RosterService,
      LoadingService
    } = this.props;

    const map = await RosterService.getMyActiveRosterMap(
      LeagueService.selectedLeague._id
    );

    const { activeGolfers } = LeagueService.selectedLeague;

    const currentActiveGolfers = isNil(map[schedule]) ?
      0 : map[schedule].length;

    if (
      golfer.active === true ||
      isNil(map) ||
      isNil(map[schedule]) ||
      currentActiveGolfers < parseInt(activeGolfers)
    ) {

      const newMap = isNil(map) ? {} : map;

      if (isNil(newMap[schedule])) {
        newMap[schedule] = [];
      }

      const newActiveList = newMap[schedule];

      const changedList = (golfer.active) ?
        newActiveList.filter( (g) => {
          return g.key !== golfer.key;
        }) :
        newActiveList;

      if (!golfer.active) {
        newActiveList.push({
          key: golfer.key,
          score: null
        });
      }

      newMap[schedule] = changedList;

      LoadingService.startLoading('leagueRosters');

      await RosterService.setActiveRoster(
        LeagueService.selectedLeague._id,
        newMap,
        this.state.team.user
      );

      await this.loadMyTeam();

      LoadingService.stopLoading('leagueRosters');
      return;
    }

    this.setState({
      ...this.state,
      activeGolferDialog: true
    });
  }

  clearActiveError = () => {
    this.setState({
      ...this.state,
      activeGolferDialog: false
    });
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

  reinit = async () => {
    const ls = this.props.LeagueService;
    const rs = this.props.RosterService;
    const { LoadingService } = this.props;

    if (isNil(ls.selectedLeague)) {
      return;
    }

    LoadingService.startLoading('leagueRosters');

    await this.loadMyTeam();
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

    LoadingService.stopLoading('leagueRosters');
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

    const {LeagueService, RosterService} = this.props;

    //eslint-disable-next-line
    const {selectedLeague} = LeagueService;

    //eslint-disable-next-line
    const {availablePlayers, myDraftList, draft} = RosterService;

    const activeErrorText = `You cannot have more than ${activeGolfers} ` +
      'active golfers. De-activate someone else first.';
    const { activeGolfers } = LeagueService.selectedLeague;

    return (
      <div className="rosters">
        <OkCancelDialog
          text={activeErrorText}
          title="Error"
          callback={this.clearActiveError}
          open={this.state.activeGolferDialog}
        />
        { this.getContent(availablePlayers, myDraftList) }
      </div>
    );
  }
}

LeagueRosters.propTypes = {
  LoadingService: PropTypes.object,
  LeagueService: PropTypes.object,
  RosterService: PropTypes.object,
  AuthService: PropTypes.object
};

export default LeagueRosters;
