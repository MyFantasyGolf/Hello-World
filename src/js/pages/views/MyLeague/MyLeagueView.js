import React from 'react';
import PropTypes from 'prop-types';

import LeagueStandings from '../LeagueStandings';
import LeagueRosters from '../Roster/LeagueRosters';
import LeagueTransactions from '../LeagueTransactions';
import LeagueNotes from '../LeagueNotes';
import LeagueAdmin from '../LeagueAdmin';

import PhoneNav from './PhoneNav';
import RouteButton from '../../../widgets/RouteButton';
import LeagueSelect from './LeagueSelect';

import {
  withRouter,
  Route,
  Switch
} from 'react-router-dom';

class MyLeagueView extends React.Component {

  componentWillMount() {
    this.navigate(null, '/standings');
  }

  navigate = ($event, value) => {
    this.props.history.push(`/myleagues${value}`);
  }

  render() {
    return (
      <div className="my-league-view">
        <div className="top-bar">
          <PhoneNav navigate={ this.navigate } />
          <LeagueSelect />
        </div>

        <div className="content-parent">
          <div className="expanded">
            <RouteButton
              title="Standings"
              iconClass="golf-icons-list-numbered"
              route="/myleagues/standings"
              onClick={ () => {
                this.navigate(null, '/standings');
              }}
            />
            <RouteButton
              title="Rosters"
              iconClass="golf-icons-user"
              route="/myleagues/rosters"
              onClick={ () => {
                this.navigate(null, '/rosters');
              }}
            />
            <RouteButton
              title="Transactions"
              iconClass="golf-icons-tree"
              route="/myleagues/transactions"
              onClick={ () => {
                this.navigate(null, '/transactions');
              }}
            />
            <RouteButton
              title="Notes"
              iconClass="golf-icons-bubbles"
              route="/myleagues/notes"
              onClick={ () => {
                this.navigate(null, '/notes');
              }}
            />
            <RouteButton
              title="Administration"
              iconClass="golf-icons-cog"
              route="/myleagues/leagueadmin"
              onClick={ () => {
                this.navigate(null, '/leagueadmin');
              }}
            />
          </div>

          <div className="content">
            <Switch>
              <Route
                path="/myleagues/standings"
                component={ LeagueStandings } />
              <Route path="/myleagues/rosters" component={ LeagueRosters } />
              <Route path="/myleagues/transactions"
                component={ LeagueTransactions } />
              <Route path="/myleagues/notes" component={ LeagueNotes } />
              <Route path="/myleagues/leagueadmin" component={ LeagueAdmin } />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

MyLeagueView.propTypes = {
  history: PropTypes.object
};

export default withRouter(MyLeagueView);
