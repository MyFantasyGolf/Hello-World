import React from 'react';
import PropTypes from 'prop-types';

import {
  RadioButtonGroup,
  RadioButton
} from 'material-ui/RadioButton';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import PlayerRow from './PlayerRow';

class DraftSetup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      draftType: 'live',
      draftOrderType: 'normal',
      numberOfRounds: 6,
      draftOrder: props.teams
    };
  }

  roundsChanged = ($e, newValue) => {
    this.setState({
      ...this.state,
      numberOfRounds: newValue
    });
  }

  draftTypeChanged = ($e, draftType) => {
    this.setState({
      ...this.state,
      draftType
    });
  }

  draftOrderTypeChanged = ($e, draftOrderType) => {
    this.setState({
      ...this.state,
      draftOrderType
    });
  }

  getTeamIndex = (team) => {
    return this.state.draftOrder.findIndex( (t) => {
      return team.firstName === t.name;
    });
  }

  moveTeamUp = (team) => {
    const {draftOrder} = this.state;
    const index = this.getTeamIndex(team);

    if (index === 0) {
      return;
    }

    const draftItem = draftOrder.splice(index, 1);
    draftOrder.splice(index - 1, 0, draftItem[0]);

    this.setState({
      ...this.state,
      draftOrder
    });
  }

  moveTeamDown = (team) => {
    const {draftOrder} = this.state;
    const index = this.getTeamIndex(team);

    if (index === draftOrder.length - 1) {
      return;
    }

    const draftItem = draftOrder.splice(index, 1);
    draftOrder.splice(index + 1, 0, draftItem[0]);

    this.setState({
      ...this.state,
      draftOrder
    });
  }

  buildTeamList() {
    return this.state.draftOrder.map( (team) => {
      return (
        <PlayerRow
          key={team.name}
          player={{ firstName: team.name, lastName: null}}
          move={true}
          add={false}
          remove={false}
          moveUpClicked={this.moveTeamUp}
          moveDownClicked={this.moveTeamDown}
        />
      );
    });
  }

  getOrderBox() {
    if (this.state.draftOrderType === 'random') {
      return <span></span>;
    }

    return (
      <div className="option-block">
        <div>Draft order</div>
        <div className="team-list">
          { this.buildTeamList() }
        </div>
      </div>
    );
  }

  startDraft = () => {
    const{
      draftType,
      draftOrderType,
      draftOrder,
      numberOfRounds
    } = this.state;

    const draftOptions = {
      draftType,
      draftOrderType,
      numberOfRounds
    };

    if (draftOrderType !== 'random') {
      draftOptions.draftOrder = draftOrder;
    }

    this.props.startDraft(draftOptions);
  }

  render() {
    return (
      <div className="draft-setup">
        <div className="page-title">Draft Setup</div>

        <div className="option-blocks">
          <div className="option-block">
            <div>Draft Type</div>
            <RadioButtonGroup
              className="radio-group"
              name="draftType"
              valueSelected={this.state.draftType}
              onChange={this.draftTypeChanged}
            >
              <RadioButton
                label="Live Selection"
                value="live"
              />
              <RadioButton
                label="Auto-Draft by Lists"
                value="auto"
              />
            </RadioButtonGroup>
          </div>

          <div className="option-block">
            <div>Draft Order Type</div>
            <RadioButtonGroup
              className="radio-group"
              name="draftOrder"
              valueSelected={this.state.draftOrderType}
              onChange={this.draftOrderTypeChanged}
            >
              <RadioButton
                label="Set Order"
                value="normal"
              />
              <RadioButton
                label="Serpentine"
                value="serpentine"
              />
              <RadioButton
                label="Random (each round)"
                value="random"
              />
            </RadioButtonGroup>
          </div>
        </div>

        { this.getOrderBox() }

        <div className="option-block rounds">
          <TextField
            name="numberOfRounds"
            type="number"
            floatingLabelText="Number of Rounds"
            value={this.state.numberOfRounds}
            onChange={this.roundsChanged}
          />
        </div>

        <div className="option-block middle">
          <RaisedButton
            primary={true}
            label="Start Draft"
            onClick={this.startDraft}
          />
        </div>
      </div>
    );
  }
}

DraftSetup.propTypes = {
  teams: PropTypes.array,
  startDraft: PropTypes.func
};

export default DraftSetup;
