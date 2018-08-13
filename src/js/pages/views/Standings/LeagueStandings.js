import React from 'react';
import PropTypes from 'prop-types';

import { observer } from 'mobx-react';
import inject from '../../../services/inject';

@inject('LeagueService')
@observer
class LeagueStandings extends React.Component {
  render() {

    const standings = this.props.LeagueService.getStandings()
      .map( (result, index) => {
        return (
          <div
            key={result.team.user}
            className={`flex row ${(index % 2 === 0) ? 'even' : 'odd'}`}>

            <div className="ordinal">
              {index + 1}
            </div>

            <div className="team-name">
              {result.team.name}
            </div>
            <div className="score">
              {result.score > 0 ? '+' : ''}{result.score}
            </div>
          </div>
        );
      });

    return (
      <div className="standings">
        <div className="page-title">League Standings</div>
        <div className="standing-list">
          {standings}
        </div>
      </div>
    );
  }
}

LeagueStandings.propTypes = {
  LeagueService: PropTypes.object
};

export default LeagueStandings;
