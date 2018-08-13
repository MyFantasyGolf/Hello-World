import React from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';

import Icon from '@material-ui/core/Icon';

import LeagueStandings from '../Standings/LeagueStandings';
import LeagueRosters from '../Roster/LeagueRosters';
import LeagueTransactions from '../LeagueTransactions';
import LeagueNotes from '../LeagueNotes';
import LeagueAdmin from '../LeagueAdmin';

import PhoneNav from './PhoneNav';
import RouteButton from '../../../widgets/RouteButton';

import {
  withRouter,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import { observer } from 'mobx-react';
import inject from '../../../services/inject';

@inject('LeagueService')
@observer
class MyLeagueView extends React.Component {

  navigate = (value) => {
    this.props.history.push(
      `/mfg/myleagues/${this.props.LeagueService.selectedLeague._id}` +
      `${value}`);
  }

  returnHome = () => {
    this.props.history.push('/mfg/home');
  }

  getLeagueId = () => {
    const leagueId = this.props.LeagueService.selectedLeague._id;

    if (!isNil(leagueId)) {
      return leagueId;
    }

    const uriParts = window.location.pathname.split('/');
    return uriParts[3];
  }

  render() {

    const leagueId = this.getLeagueId();

    return (
      <div className="my-league-view">
        <div className="top-bar">
          <PhoneNav navigate={ this.navigate } />

          <div className="back-home" onClick={this.returnHome}>
            <Icon className="icon golf-icons-home" />
            <a>Return home</a>

            <div className="league-name">
              {this.props.LeagueService.selectedLeague.name}
            </div>
          </div>

          <div className="league-name-phone">
            {this.props.LeagueService.selectedLeague.name}
          </div>

        </div>

        <div className="content-parent">
          <div className="expanded">
            <RouteButton
              title="Standings"
              iconClass="golf-icons-list-numbered"
              route="/standings"
              onClick={ () => {
                this.navigate('/standings');
              }}
            />
            <RouteButton
              title="Rosters"
              iconClass="golf-icons-user"
              route="/rosters"
              onClick={ () => {
                this.navigate('/rosters');
              }}
            />
            <RouteButton
              title="Transactions"
              iconClass="golf-icons-tree"
              route="/transactions"
              onClick={ () => {
                this.navigate('/transactions');
              }}
            />
            <RouteButton
              title="Notes"
              iconClass="golf-icons-bubbles"
              route="/notes"
              onClick={ () => {
                this.navigate('/notes');
              }}
            />
            <RouteButton
              title="Administration"
              iconClass="golf-icons-cog"
              route="/leagueadmin"
              onClick={ () => {
                this.navigate('/leagueadmin');
              }}
            />
          </div>

          <div className="content">
            <Switch>
              <Route
                path={`/mfg/myleagues/${leagueId}/standings`}
                component={ LeagueStandings } />
              <Route
                path={`/mfg/myleagues/${leagueId}/rosters`}
                component={ LeagueRosters } />
              <Route
                path={`/mfg/myleagues/${leagueId}/transactions`}
                component={ LeagueTransactions } />
              <Route
                path={`/mfg/myleagues/${leagueId}/notes`}
                component={ LeagueNotes } />
              <Route
                path={`/mfg/myleagues/${leagueId}/leagueadmin`}
                component={ LeagueAdmin } />
              <Redirect to={`/mfg/myleagues/${leagueId}/standings`} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

MyLeagueView.propTypes = {
  history: PropTypes.object,
  LeagueService: PropTypes.object
};

export default withRouter(MyLeagueView);
