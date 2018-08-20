import React from 'react';
import PropTypes from 'prop-types';

import inject from '../services/inject';
import { observer } from 'mobx-react';

import Banner from './Banner';
import MainPage from './MainPage';
import Loading from '../widgets/Loading';

@inject('LoadingService')
@observer
class HomePage extends React.Component {
  render() {

    const {loading} = this.props.LoadingService;

    return (
      <div className="main-page">
        { loading &&
          <Loading />
        }
        <Banner />
        <MainPage />
      </div>
    );
  }
}

HomePage.propTypes = {
  LoadingService: PropTypes.object
};

export default HomePage;
