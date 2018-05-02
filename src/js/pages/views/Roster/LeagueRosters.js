import React from 'react';
import PropTypes from 'prop-types';

import isNil from 'lodash/isNil';
import inject from '../../../services/inject';
import { observer } from 'mobx-react';

import PreDraft from './PreDraft';

@inject('LeagueService')
@observer
class LeagueRosters extends React.Component {

  getContent(availablePlayers = []) {

    const { selectedLeague } = this.props.LeagueService;

    if (isNil(selectedLeague)) {
      return;
    }

    if (selectedLeague.draft.complete === false) {
      return <PreDraft
        availablePlayers={ availablePlayers }
      />;
    }

    return <div>Not Implemented</div>;
  }

  componentWillReact() {
    const ls = this.props.LeagueService;

    if (!isNil(ls.selectedLeague)) {
      ls.getAvailablePlayers();
    }
  }

  render() {
    const {selectedLeague} = this.props.LeagueService;
    const ap = this.props.LeagueService.availablePlayers;

    return (
      <div className="rosters">
        { this.getContent(ap) }
      </div>
    );
  }
}

LeagueRosters.propTypes = {
  LeagueService: PropTypes.object
};

export default LeagueRosters;
