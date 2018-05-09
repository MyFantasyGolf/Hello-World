import React from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';
import inject from '../../../services/inject';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { observer } from 'mobx-react';

@inject('LeagueService')
@observer
class LeagueSelect extends React.Component {

  buildMenuItems() {
    return this.props.LeagueService.myLeagues.map( (league) => {
      return <MenuItem
        key={ league._id }
        primaryText={ league.name }
        value={ league._id } />;
    });
  }

  leagueSelected = ($event, index, value) => {
    this.props.LeagueService.selectLeague(value);
  }

  render() {
    const { selectedLeague } = this.props.LeagueService;
    const leagueId = isNil(selectedLeague) ? null : selectedLeague._id;

    return (
      <SelectField
        value={ leagueId }
        floatingLabelText="Select a League"
        onChange={ this.leagueSelected }
      >
        { this.buildMenuItems() }
      </SelectField>
    );
  }
}

LeagueSelect.propTypes = {
  LeagueService: PropTypes.object
};

export default LeagueSelect;
