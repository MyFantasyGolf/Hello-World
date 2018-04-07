import React from 'react';
import PropTypes from 'prop-types';
import inject from '../services/inject';

import { observer } from 'mobx-react';

@inject('LeagueService')
@observer
class MainPage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.LeagueService.loadMyLeagues();
  }

  render() {
    return (
      <div className="main-area"></div>
    );
  }
}

MainPage.propTypes = {
  LeagueService: PropTypes.object
};

export default MainPage;
