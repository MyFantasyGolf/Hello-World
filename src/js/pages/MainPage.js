import React from 'react';
import PropTypes from 'prop-types';
import inject from '../services/inject';

import HomeView from './views/home/HomeView';
import MyLeagueView from './views/MyLeague/MyLeagueView';
import AdminView from './views/AdminView';
import CreateLeague from './views/home/CreateLeague';

import Icon from '@material-ui/core/Icon';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import { observer } from 'mobx-react';

import {
  withRouter,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

@inject('LeagueService')
@observer
class MainPage extends React.Component {

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const leagueService = this.props.LeagueService;
    await leagueService.loadMyLeagues();
    await leagueService.loadMyInvites();
    leagueService.selectLeague( leagueService.myLeagues[0] );
  }

  navigate = (path) => {
    this.props.history.push(path);
  }

  render() {
    return (
      <div className="main-area">

        <div className="center-panel">
          <Switch>
            <Route path="/mfg/home" component={HomeView} />
            <Route path="/mfg/myleagues" render={() => {
              return (
                <MyLeagueView/>
              );
            }}
            />
            <Route path="/mfg/admin" component={AdminView} />
            <Route path="/mfg/league_creation" component={CreateLeague} />
            <Redirect to="/mfg/home" />
          </Switch>
        </div>
        <div className="bottom-nav-bar">
          <BottomNavigation>
            <BottomNavigationAction
              label="Home"
              icon={<Icon className="golf-icons-home" />}
              onClick={ () => {
                this.navigate('/mfg/home');
              }}
            />
          </BottomNavigation>
        </div>
      </div>
    );
  }
}

MainPage.propTypes = {
  LeagueService: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(MainPage);
