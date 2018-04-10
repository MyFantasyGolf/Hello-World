import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import LeagueStandings from './LeagueStandings';
import LeagueRosters from './LeagueRosters';
import LeagueTransactions from './LeagueTransactions';
import LeagueNotes from './LeagueNotes';
import LeagueAdmin from './LeagueAdmin';

import {
  withRouter,
  Route,
  Switch
} from 'react-router-dom';

class MyLeagueView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      navPopver: false,
      anchorEl: null
    };
  }

  handleRequestClose = () => {
    this.setState({
      ...this.state,
      navPopver: false
    });
  }

  toggleNavMenu = ($event) => {
    this.setState({
      ...this.state,
      anchorEl: $event.currentTarget,
      navPopover: !this.state.navPopver
    });
  }

  navigate = ($event, value) => {
    this.setState({
      ...this.state,
      navPopver: false
    });
    
    this.props.history.push(`/myleagues${value}`);
  }

  render() {
    return (
      <div className="my-league-view">
        <div className="condensed">
          <IconButton
            iconClassName="golf-icons-equalizer"
            onClick={ this.toggleNavMenu }/>
          <Popover
            open={ this.state.navPopover }
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={ this.handleRequestClose }
          >
            <Menu onChange={ this.navigate }>
              <MenuItem primaryText="Standings"
                leftIcon={
                  <FontIcon className="golf-icons-list-numbered" />
                } value="/standings"/>
              <MenuItem primaryText="Rosters"
                leftIcon={
                  <FontIcon className="golf-icons-user" />
                } value="/rosters"/>
              <MenuItem primaryText="Transactions"
                leftIcon={
                  <FontIcon className="golf-icons-tree" />
                } value="/transactions"/>
              <MenuItem primaryText="Notes"
                leftIcon={
                  <FontIcon className="golf-icons-bubbles" />
                } value="/notes"/>
              <MenuItem primaryText="Admin"
                leftIcon={
                  <FontIcon className="golf-icons-cog" />
                } value="/leagueadmin"/>
            </Menu>
          </Popover>
        </div>

        <div className="expanded">
          <div className="navItem">
            <IconButton iconClassName="golf-icons-list-numbered"
              onClick={ () => {
                this.navigate(null, '/standings');
              }}/>
            <div className="title">Standings</div>
          </div>
          <div className="navItem">
            <IconButton iconClassName="golf-icons-user"
              onClick={ () => {
                this.navigate(null, '/rosters');
              }}/>
            <div className="title">Rosters</div>
          </div>
          <div className="navItem">
            <IconButton iconClassName="golf-icons-tree"
              onClick={ () => {
                this.navigate(null, '/transactions');
              }}/>
            <div className="title">Transactions</div>
          </div>
          <div className="navItem">
            <IconButton iconClassName="golf-icons-bubbles"
              onClick={ () => {
                this.navigate(null, '/notes');
              }}/>
            <div className="title">Notes</div>
          </div>
          <div className="navItem">
            <IconButton iconClassName="golf-icons-cog"
              onClick={ () => {
                this.navigate(null, '/leagueadmin');
              }}/>
            <div className="title">Administration</div>
          </div>
        </div>

        <div className="content">
          <Switch>
            <Route path="/myleagues/standings" component={ LeagueStandings } />
            <Route path="/myleagues/rosters" component={ LeagueRosters } />
            <Route path="/myleagues/transactions"
              component={ LeagueTransactions } />
            <Route path="/myleagues/notes" component={ LeagueNotes } />
            <Route path="/myleagues/leagueadmin" component={ LeagueAdmin } />
          </Switch>
        </div>
      </div>
    );
  }
}

MyLeagueView.propTypes = {
  history: PropTypes.object
};

export default withRouter(MyLeagueView);
