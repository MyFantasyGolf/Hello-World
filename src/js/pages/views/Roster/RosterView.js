import React from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';

import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

import RosterTable from './RosterTable';
import AvailablePlayerTable from './AvailablePlayerTable';
import PlayerRow from './PlayerRow';

import moment from 'moment';

class RosterView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      schedule: undefined,
      showAvailable: false
    };
  }

  componentDidMount() {

    if (isNil(this.props.schedules) || this.props.schedules.length < 1) {
      return;
    }

    const today = moment();

    const closestSchedule =
      this.props.schedules.reduce( (closest, schedule) => {
        const winningMoment = moment(closest.date.end, 'MM/DD/YYYY');
        const winningDiff = Math.abs(winningMoment.diff(today));

        const scheduleMoment = moment(schedule.date.end, 'MM/DD/YYYY');
        const scheduleDiff = Math.abs(scheduleMoment.diff(today));

        if (winningDiff < scheduleDiff) {
          return closest;
        }

        return schedule;
      }, this.props.schedules[0]);

    this.setState({
      ...this.state,
      schedule: closestSchedule.key
    });
  }

  showAvailablePlayers = () => {
    this.setState({
      ...this.state,
      showAvailable: true
    });
  }

  addPlayer = async (golfer) => {
    await this.props.addPlayer(golfer);

    this.setState({
      ...this.state,
      showAvailable: false
    });
  }

  getRosterListView = (myRoster) => {
    if (isNil(myRoster)) {
      return [];
    }

    return myRoster
      .map( (player2, index2) => {
        return <PlayerRow
          key={index2}
          player={player2}
          add={false}
          remove={false}
          move={false}
        />;
      });
  }

  getSmallDate = (dateString) => {
    return moment(dateString, 'MM/DD/YYYY').format('M/DD');
  }

  getScheduleItems = () => {
    return this.props.schedules.map( (schedule) => {
      return (
        <option
          key={schedule.key}
          value={schedule.key}
        >
          {schedule.title} ({this.getSmallDate(schedule.date.start)}
          - {this.getSmallDate(schedule.date.end)})
        </option>
      );
    });
  }

  getInstructions = () => {
    const { schedule } = this.state;
    const realSchedule = this.props.schedules.find( (s) => {
      return s.key === schedule;
    });

    if (isNil(realSchedule) || isNil(realSchedule.date)) {
      return;
    }

    const start = moment(realSchedule.date.start, 'MM/DD/YYYY');
    const now = moment();

    return (start.isAfter(now)) ?
      <div>
        Click the active status to toggle your active roster for this
        tournament.
      </div> :
      <div>
        Final Results.  (Golfers no longer on your roster are in gray).
      </div>;
  }

  scheduleChanged = ($e) => {
    this.setState({
      ...this.state,
      schedule: $e.target.value
    });
  }

  getButtonPanel = () => {
    return (
      <div className="button-panel show-available">
        <IconButton
          variant=""
          className="icon icon-show-available"
          onClick={ this.showAvailablePlayers }>
          <Icon className="golf-icons-user-plus" />
        </IconButton>
      </div>
    );
  }

  getRosterDisplay = () => {

    const {
      team,
      activeChange,
      releasePlayer
    } =
    this.props;

    if( isNil(team) || isNil(team.activeMap)) {
      return null;
    }

    return (
      <div className="roster-tables">
        { !this.state.showAvailable &&
          <RosterTable
            currentRoster={team.currentRoster}
            activeRosterMap={team.activeMap[this.state.schedule]}
            activeChange={
              (golfer) => {
                activeChange(golfer, this.state.schedule);
              }
            }
            releasePlayer={(golfer) => { releasePlayer(golfer); }}
            buttonPanel={this.getButtonPanel()}
          />
        }
        { this.state.showAvailable &&
          <AvailablePlayerTable
            addPlayer={this.addPlayer}
          />
        }
        <div className="large-screen-available-players">
          <AvailablePlayerTable

            addPlayer={this.addPlayer}
          />
        </div>
      </div>
    );
  }

  render() {

    return (
      <div>

        <div className="tourney-select">
          <FormControl>
            <InputLabel htmlFor="schedule-select">Tournament</InputLabel>
            <Select
              native
              value={this.state.schedule}
              onChange={this.scheduleChanged}
              inputProps={{
                id: 'schedule-select'
              }}
            >
              {this.getScheduleItems()}
            </Select>
          </FormControl>
        </div>

        <div className="roster-lists">
          <div className="roster-list">
            <div className="instructions">
              { this.getInstructions()}
            </div>
            {this.getRosterDisplay()}
          </div>
        </div>

      </div>
    );
  }
}

RosterView.propTypes = {
  team: PropTypes.shape({
    user: PropTypes.string,
    name: PropTypes.string,
    currentRoster: PropTypes.any,
    activeMap: PropTypes.object
  }),
  schedules: PropTypes.array,
  activeChange: PropTypes.func,
  releasePlayer: PropTypes.func,
  addPlayer: PropTypes.func
};

RosterView.defaultProps = {
  team: {
    user: '',
    name: 'None',
    currentRoster: [],
    activeMap: {}
  },
  schedules: []
};

export default RosterView;
