import React from 'react';
import PropTypes from 'prop-types';

import isNil from 'lodash/isNil';

import { withRouter } from 'react-router';
import inject from '../services/inject';
import { observer } from 'mobx-react';

import Banner from './Banner';
import MainPage from './MainPage';

@inject('LoadingService', 'AuthService')
@observer
class HomePage extends React.Component {

  componentWillMount() {
    this.initialize();
  }

  async initialize() {
    const { LoadingService, history, AuthService } = this.props;
    LoadingService.startLoading('homePage');
    await AuthService.getCurrentUser();
    LoadingService.stopLoading('homePage');

    if (isNil(AuthService.me)) {
      history.push('/login');
    }
  }

  render() {
    return (
      <div className="main-page">
        { !isNil(this.props.AuthService.me) &&
          <div>
            <Banner />
            <MainPage />
          </div>
        }
      </div>
    );
  }
}

HomePage.propTypes = {
  LoadingService: PropTypes.object,
  AuthService: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(HomePage);
