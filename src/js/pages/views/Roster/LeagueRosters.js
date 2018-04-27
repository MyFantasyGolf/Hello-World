import React from 'react';
import PropTypes from 'prop-types';

import inject from '../../../services/inject';
import { observer } from 'mobx-react';

import PreDraft from './PreDraft';

@inject('LeagueService')
@observer
class LeagueRosters extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      availablePlayers: [],
      loading: true
    };
  }

  getContent() {

    if (this.state.loading === true) {
      return;
    }

    if (this.props.LeagueService.selectedLeague.draft.complete === false) {
      return <PreDraft
        availablePlayers={ this.state.availablePlayers }
      />;
    }

    return <div>Not Implemented</div>;
  }

  async componentWillMount() {
    this.setState({
      ...this.state,
      loading: true
    });

    if (this.props.LeagueService.selectedLeague.draft.complete === false) {
      const availablePlayers =
        await this.props.LeagueService.getAvailablePlayers();
      this.setState({
        ...this.state,
        availablePlayers
      });
    }

    this.setState({
      ...this.state,
      loading: false
    });
  }

  render() {
    return (
      <div>
        <div>League Rosters</div>
        { this.getContent() }
      </div>
    );
  }
}

LeagueRosters.propTypes = {
  LeagueService: PropTypes.object
};

export default LeagueRosters;
