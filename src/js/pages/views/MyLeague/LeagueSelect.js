import React from 'react';
import PropTypes from 'prop-types';

import inject from '../../../services/inject';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

@inject('LeagueService')
class LeagueSelect extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedValue: null
    };
  }

  buildMenuItems() {
    return this.props.LeagueService.myLeagues.map( (league) => {
      return <MenuItem
        key={ league._id }
        primaryText={ league.name }
        value={ league } />;
    });
  }

  leagueSelected = ($event, value) => {
    this.props.LeagueService.selectLeague(value);
  }

  render() {
    return (
      <SelectField
        value={ this.props.LeagueService.selectedLeague }
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
