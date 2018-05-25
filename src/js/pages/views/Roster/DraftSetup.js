import React from 'react';
import PropTypes from 'prop-types';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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

  roundsChanged = ($e) => {
    this.setState({
      ...this.state,
      numberOfRounds: $e.target.value
    });
  }

  draftTypeChanged = ($e) => {
    this.setState({
      ...this.state,
      draftType: $e.target.value
    });
  }

  draftOrderTypeChanged = ($e) => {
    this.setState({
      ...this.state,
      draftOrderType: $e.target.value
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
            <RadioGroup
              className="radio-group"
              name="draftType"
              value={this.state.draftType}
              onChange={this.draftTypeChanged}
            >
              <FormControlLabel
                label="Live Selection"
                value="live"
                control={<Radio />}
              />
              <FormControlLabel
                label="Auto-Draft by Lists"
                value="auto"
                control={<Radio />}
              />
            </RadioGroup>
          </div>

          <div className="option-block">
            <div>Draft Order Type</div>
            <RadioGroup
              className="radio-group"
              name="draftOrder"
              value={this.state.draftOrderType}
              onChange={this.draftOrderTypeChanged}
            >
              <FormControlLabel
                label="Set Order"
                value="normal"
                control={<Radio />}
              />
              <FormControlLabel
                label="Serpentine"
                value="serpentine"
                control={<Radio />}
              />
              <FormControlLabel
                label="Random (each round)"
                value="random"
                control={<Radio />}
              />
            </RadioGroup>
          </div>
        </div>

        <div className="option-blocks">
          { this.getOrderBox() }

          <div className="option-block rounds">
            <TextField
              name="numberOfRounds"
              type="number"
              label="Number of Rounds"
              value={this.state.numberOfRounds}
              onChange={this.roundsChanged}
            />
          </div>
        </div>

        <div className="middle">
          <Button
            variant="raised"
            color="primary"
            onClick={this.startDraft}
          >
            Start Draft
          </Button>
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
