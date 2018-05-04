import React from 'react';
import PropTypes from 'prop-types';

import isNil from 'lodash/isNil';
import inject from '../../../services/inject';
import { observer } from 'mobx-react';

import PreDraft from './PreDraft';

@inject('LeagueService')
@observer
class LeagueRosters extends React.Component {

  getContent(
    availablePlayers = [],
    myDraftList = []) {

    const { selectedLeague } = this.props.LeagueService;

    if (isNil(selectedLeague)) {
      return;
    }

    if (selectedLeague.draft.state === 'PREDRAFT') {
      return <PreDraft
        availablePlayers={ availablePlayers }
        myDraftList={ myDraftList }
        addPlayerToMyList={this.addPlayerToMyList}
        removePlayerFromMyList={this.removePlayerFromMyList}
      />;
    }

    return <div>Not Implemented</div>;
  }

  addPlayerToMyList = (player) => {
    this.props.LeagueService.addPlayerToMyList(player);
  }

  removePlayerFromMyList = (player) => {
    this.props.LeagueService.removePlayerFromMyList(player);
  }

  componentWillReact() {
    const ls = this.props.LeagueService;

    if (!isNil(ls.selectedLeague)) {
      ls.getAvailablePlayers();

      if (ls.selectedLeague.draft.state === 'PREDRAFT' ||
        ls.selectedLeague.draft.state === 'INPROGRESS') {
        ls.getMyDraftList();
      }
    }
  }

  render() {
    //eslint-disable-next-line
    const {selectedLeague} = this.props.LeagueService;
    const ap = this.props.LeagueService.availablePlayers;
    const draftList = this.props.LeagueService.myDraftList;

    return (
      <div className="rosters">
        { this.getContent(ap, draftList) }
      </div>
    );
  }
}

LeagueRosters.propTypes = {
  LeagueService: PropTypes.object
};

export default LeagueRosters;
