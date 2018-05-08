import React from 'react';
import PropTypes from 'prop-types';

import isFunction from 'lodash/isFunction';
import isNil from 'lodash/isNil';

import PlayerRow from './PlayerRow';
import DraftSetup from './DraftSetup';

import RaisedButton from 'material-ui/RaisedButton';

class PreDraft extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      showDraftOptions: false
    };
  }

  getAvailablePlayers() {
    if (this.state.loading === true) {
      return;
    }

    return this.props.availablePlayers
      .filter( (player) => {
        const match = isNil(this.props.myDraftList) ?
          false :
          this.props.myDraftList.find( (wPlayer) => {
            return wPlayer.key === player.key;
          });

        return isNil(match);
      })
      .map( (player, index) => {
        return (
          <PlayerRow
            key={index}
            drag={true}
            player={player}
            add={true}
            remove={false}
            move={false}
            addClicked={this.props.addPlayerToMyList}
          />
        );
      });
  }

  getMyDraftList() {
    if (this.state.loading === true) {
      return;
    }

    if (isNil(this.props.myDraftList) || this.props.myDraftList.length === 0) {
      return (
        <p>
          Add a player from the available list to begin
          creating your draft list.
        </p>
      );
    }

    return this.props.myDraftList.map( (player, index) => {

      return (
        <PlayerRow
          key={index}
          drag={true}
          player={player}
          add={false}
          remove={true}
          move={true}
          removeClicked={this.props.removePlayerFromMyList}
          moveUpClicked={this.props.movePlayerUp}
          moveDownClicked={this.props.movePlayerDown}
        />
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

  showDraftOptions = () => {
    this.setState({
      ...this.state,
      showDraftOptions: true
    });
  }

  getStartDraftOption() {
    return this.props.isCommisioner ?
      (<div className="start-draft">
        <RaisedButton
          label="Start Draft"
          primary={true}
          onClick={this.showDraftOptions}
        />
      </div>) :
      <span></span>;
  }

  getMainContent() {
    return this.state.showDraftOptions ?
      <DraftSetup
        startDraft={this.props.startDraft}
        teams={this.props.teams}
      />
      :
      <div className="roster-lists">

        <div className="roster-list">
          <div className="title">My Draft Sheet</div>
          <div className="body">
            { this.getMyDraftList() }
          </div>
        </div>

        <div className="roster-list">
          <div className="title">Available Players</div>
          <div className="body">
            { this.getAvailablePlayers() }
          </div>
        </div>

      </div>;
  }

  getDescriptionBlock() {
    return this.state.showDraftOptions ?
      <div />
      :
      <div>
        <div className="page-title">Pre-Draft</div>
        {this.getStartDraftOption()}
        <p>
          Before the draft officially begins, use this list
          to create your own rankings to help on draft night.
        </p>
      </div>;
  }

  render() {
    return (
      <div>

        { this.getDescriptionBlock() }

        {this.getMainContent()}

      </div>
    );
  }
}

PreDraft.propTypes = {
  availablePlayers: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  myDraftList: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  addPlayerToMyList: PropTypes.func,
  removePlayerFromMyList: PropTypes.func,
  movePlayerUp: PropTypes.func,
  movePlayerDown: PropTypes.func,
  startDraft: PropTypes.func,
  teams: PropTypes.array,
  isCommisioner: PropTypes.bool
};

PreDraft.defaultProps = {
  availablePlayers: [],
  myDraftList: [],
  addPlayerToMyList: () => {},
  removePlayerFromMyList: () => {},
  movePlayerUp: () => {},
  movePlayerDown: () => {},
  isCommisioner: false
};

export default PreDraft;
