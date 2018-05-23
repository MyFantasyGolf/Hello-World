import React from 'react';
import PropTypes from 'prop-types';

import inject from '../../../services/inject';
import { observer } from 'mobx-react';

import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import LeagueListing from './LeagueListing';

import {
  withRouter
} from 'react-router-dom';

@inject('LeagueService')
@observer
class HomeView extends React.Component {

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

  leagueSelected = (league) => {
    this.props.LeagueService.selectLeague(league);

    this.props.history.push(`/mfg/myleagues/${league._id}`);
  }

  createLeague = () => {
    this.props.history.push('/mfg/league_creation');
  }

  getCreateMessage() {
    return (
      <div>
        <span>You are not currently involved in any leagues. </span>
        <span>Why not
          <a onClick={this.createLeague}>create one</a>
           now and get started!</span>
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
            My Invitations
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
