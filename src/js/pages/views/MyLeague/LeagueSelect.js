import React from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';
import inject from '../../../services/inject';

import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import { observer } from 'mobx-react';

@inject('LeagueService')
@observer
class LeagueSelect extends React.Component {

  buildMenuItems() {
    return this.props.LeagueService.myLeagues.map( (league) => {
      return (
        <option
          key={ league._id }
          value={ league._id }
        >
          {league.name}
        </option>
      );
    });
  }

  leagueSelected = ($event) => {
    this.props.LeagueService.selectLeague($event.target.value);
  }

  render() {
    const { selectedLeague } = this.props.LeagueService;
    const leagueId = isNil(selectedLeague) ? 0 : selectedLeague._id;

    return (
      <FormControl>
        <InputLabel htmlFor="league-select">League</InputLabel>
        <Select
          native
          value={ leagueId }
          onChange={ this.leagueSelected }
          inputProps={{
            id: 'league-select'
          }}
        >
          { this.buildMenuItems() }
        </Select>
      </FormControl>
    );
  }
}

LeagueSelect.propTypes = {
  LeagueService: PropTypes.object
};

export default LeagueSelect;
