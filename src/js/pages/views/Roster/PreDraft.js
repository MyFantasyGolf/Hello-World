import React from 'react';
import PropTypes from 'prop-types';

import isFunction from 'lodash/isFunction';
class PreDraft extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  getAvailablePlayers() {
    if (this.state.loading === true) {
      return;
    }

    return this.props.availablePlayers.map( (player, index) => {
      return (
        <div draggable="true" key={`${player.key}-${index}`} className="player">
          <div>{`${player.lastName}, ${player.firstName}`}</div>
        </div>
      );
    });
  }

  componentWillReceiveProps(props) {
    if (isFunction(props.availablePlayers.toJs)) {
      this.setState({
        ...this.state,
        loading: true
      });

      return;
    }

    this.setState({
      ...this.state,
      loading: false
    });
  }

  render() {
    return (
      <div>
        <div className="page-title">Pre-Draft</div>

        <div className="roster-lists">

          <div className="roster-list">
            <div className="title">My Wish List</div>
            <div className="body">
            </div>
          </div>

          <div className="roster-list">
            <div className="title">Available Players</div>
            <div className="body">
              { this.getAvailablePlayers() }
            </div>
          </div>

        </div>
      </div>
    );
  }
}

PreDraft.propTypes = {
  availablePlayers: PropTypes.object
};

export default PreDraft;
