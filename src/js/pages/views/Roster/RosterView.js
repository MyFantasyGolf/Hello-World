import React from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';

import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import PlayerRow from './PlayerRow';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class RosterView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      schedule: undefined
    };
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

  getColumns = () => {
    return [
      {
        Header: 'Active',
        accessor: 'active'
      },
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Total Score',
        accessor: 'total_score'
      }
    ];
  }

  getScheduleItems = () => {
    return this.props.schedules.map( (schedule) => {
      return (
        <option
          key={schedule.key}
          value={schedule.key}
        >
          {schedule.title}
        </option>
      );
    });
  }

  scheduleChanged = ($e) => {
    this.setState({
      ...this.state,
      schedule: $e.value
    });
  }

  render() {

    const { team } = this.props;

    return (
      <div className="roster-lists">

        <div>
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

        <div className="roster-list">
          <div className="title">
            My Roster
          </div>
          <div className="body">
            {this.getRosterListView(team.currentRoster)}
          </div>
          <div className="table">
            <ReactTable
              data={[{active: false, name: 'Nate Bever', 'total_score': 10}]}
              columns={this.getColumns()}
              minRows={0}
            />
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
  schedules: PropTypes.array
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
