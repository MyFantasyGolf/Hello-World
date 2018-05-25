import React from 'react';
import PropTypes from 'prop-types';

import inject from '../../../services/inject';
import { observer } from 'mobx-react';

import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import LeagueListing from './LeagueListing';
import InviteListing from './InviteListing';
import OkCancelDialog from '../../../widgets/OkCancelDialog';
import TeamNameDialog from './TeamNameDialog';

import {
  withRouter
} from 'react-router-dom';

@inject('LeagueService')
@observer
class HomeView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      confirmOpen: false,
      invitationSelected: {name: ''},
      acceptOpen: false,
      teamName: ''
    };
  }

  getLeagueList() {
    return this.props.LeagueService.myLeagues.map( (league) => {
      return (
        <LeagueListing
          key={league._id}
          league={league}
          leagueClicked={this.leagueSelected}
        />
      );

    });
  }

  getInviteList() {
    return this.props.LeagueService.myInvites.map( (invite, index) => {
      return (
        <InviteListing
          key={index}
          invite={invite}
          acceptInvitation={this.acceptInvitation}
          declineInvitation={this.declineInvitation}
        />
      );
    });
  }

  acceptInvitation = (invite) => {
    this.setState({
      ...this.state,
      acceptOpen: true,
      invitationSelected: invite
    });
  }

  teamNameChanged = ($event) => {
    this.setState({
      ...this.state,
      teamName: $event.target.value
    });
  }

  declineInvitation = (invite) => {
    this.setState({
      ...this.state,
      confirmOpen: true,
      invitationSelected: invite
    });
  }

  declineConfirmation = async ( decline ) => {
    if (decline === true) {
      await this.props.LeagueService.declineInvitation(
        this.state.invitationSelected);
    }

    this.setState({
      ...this.state,
      confirmOpen: false
    });
  }

  acceptConfirmation = async (accept) => {
    if (accept === true) {
      await this.props.LeagueService.acceptInvitation(
        this.state.invitationSelected,
        this.state.teamName
      );
    }

    this.setState({
      ...this.state,
      teamName: '',
      acceptOpen: false
    });
  }

  leagueSelected = (league) => {
    this.props.LeagueService.selectLeague(league);

    this.props.history.push(`/mfg/myleagues/${league._id}`);
  }

  createLeague = () => {
    this.props.history.push('/mfg/league_creation');
  }

  getCreateMessage() {
    return (
      <div className="no-leagues">
        <span>You are not currently involved in any leagues. </span>
        <span>Why not&nbsp;
          <a onClick={this.createLeague}>create one</a>
           &nbsp;now and get started!</span>
      </div>
    );
  }

  getContent() {
    return this.props.LeagueService.myLeagues.length === 0 ?
      this.getCreateMessage() :
      this.getLeagueList();
  }

  render() {
    return (
      <div className="home-view">

        <OkCancelDialog
          text={`Are you sure you want to decline the invititation to
          join ${this.state.invitationSelected.name}?  There is no 'undo'
          for this choice.`}
          title="Decline Invitation"
          callback={this.declineConfirmation}
          open={this.state.confirmOpen}
        >
        </OkCancelDialog>

        <TeamNameDialog
          open={this.state.acceptOpen}
          callback={this.acceptConfirmation}
          teamName={this.state.teamName}
          teamNameChanged={this.teamNameChanged}
          invitation={this.state.invitationSelected}
        />


        <div className="home">
          <Icon className="icon golf-icons-home" />
          <div className="location">Home</div>
        </div>

        <div className="my-leagues">
          <div className="title shadow">
            <div>My Leagues</div>
            <div>
              <IconButton
                className="small-button"
                color="secondary"
                onClick={this.createLeague}>
                <Icon className="golf-icons-plus" />
              </IconButton>
            </div>
          </div>
          <div className="league-list">
            { this.getContent() }
          </div>
        </div>

        <div className="my-invitations">
          <div className="shadow title">
            <div>My Invitations</div>
          </div>

          <div className="invite-list">
            { this.getInviteList() }
          </div>

        </div>
      </div>
    );
  }
}

HomeView.propTypes = {
  LeagueService: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(HomeView);
