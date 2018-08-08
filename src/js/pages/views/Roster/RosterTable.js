import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import inject from '../../../services/inject';
import { observer } from 'mobx-react';

@inject('RosterTableService')
@observer
class RosterTable extends React.Component {

  activeCellRenderer = (row) => {
    return (
      <div
        style={{
          color:
            row.value === true ?
              '#386331' : 'gray',
          textAlign: 'center'
        }}
      >
        <div
          className={`icon table-row ${row.value === true ?
            'golf-icons-check' : 'golf-icons-cross2'}`}
          onClick={() => { this.activeClicked(row.original); }}
        />
      </div>);
  };

  cellColorRenderer = (row) => {
    return (
      <div
        style={{
          color: row.original.current === true ?
            'black' : 'gray',
          fontSize: '20px'
        }}
      >
        {row.value}
      </div>
    );
  }

  getColumns = () => {
    return [
      {
        Header: 'Active',
        accessor: 'active',
        width: 80,
        Cell: this.activeCellRenderer
      },
      {
        Header: 'Name',
        accessor: 'name',
        Cell: this.cellColorRenderer
      },
      {
        Header: 'Tournament Score',
        accessor: 'score',
        Cell: this.cellColorRenderer
      },
      {
        Header: 'Total Score',
        accessor: 'totalScore',
        Cell: this.cellColorRenderer
      }
    ];
  }

  componentDidMount() {
    const { currentRoster, activeRosterMap } = this.props;
    this.props.RosterTableService.loadPlayerList(
      currentRoster, activeRosterMap
    );
  }

  componentDidUpdate(previousProps) {

    const { currentRoster, activeRosterMap } = this.props;

    if (previousProps.currentRoster === currentRoster &&
    previousProps.activeRosterMap === activeRosterMap) {
      return;
    }

    this.props.RosterTableService.loadPlayerList(
      currentRoster, activeRosterMap
    );
  }

  activeClicked = (golfer) => {
    const { activeChange } = this.props;

    activeChange(golfer);
  }

  render() {

    const { RosterTableService } = this.props;
    const computedRoster = RosterTableService.playerList;

    return (
      <div className="table">
        { RosterTableService.loading &&
          <div className="table-loading">Loading...</div>
        }
        { RosterTableService.loading === false &&
          <ReactTable
            className=" -striped -highlight"
            data={computedRoster}
            columns={this.getColumns()}
            minRows={0}
          />
        }
      </div>
    );
  }
}

RosterTable.propTypes = {
  currentRoster: PropTypes.any,
  activeRosterMap: PropTypes.any,
  RosterTableService: PropTypes.object,
  activeChange: PropTypes.func
};

export default RosterTable;
