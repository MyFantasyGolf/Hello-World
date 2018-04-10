import React from 'react';
import PropTypes from 'prop-types';
import inject from '../services/inject';

import MainNavBar from './MainNavBar';
import HomeView from './views/HomeView';
import MyLeagueView from './views/MyLeagueView';
import AdminView from './views/AdminView';

import { observer } from 'mobx-react';

import {
  withRouter,
  Route,
  Switch
} from 'react-router-dom';

@inject('LeagueService')
@observer
class MainPage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.LeagueService.loadMyLeagues();
  }

  navigate = (path) => {
    this.props.history.push(path);
  }

  render() {
    return (
      <div className="main-area">
        <MainNavBar navSelected={ this.navigate }/>
        <Switch>
          <Route path="/home" component={HomeView} />
          <Route path="/myleagues" component={MyLeagueView} />
          <Route path="/admin" component={AdminView} />
        </Switch>
      </div>
    );
  }
}

MainPage.propTypes = {
  LeagueService: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(MainPage);
