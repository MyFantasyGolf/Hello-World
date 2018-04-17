import React from 'react';
import PropTypes from 'prop-types';

import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

class PhoneNav extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      navPopver: false,
      anchorEl: null
    };
  }

  handleRequestClose = () => {
    this.setState({
      ...this.state,
      navPopver: false
    });
  }

  toggleNavMenu = ($event) => {
    this.setState({
      ...this.state,
      anchorEl: $event.currentTarget,
      navPopover: !this.state.navPopver
    });
  }

  menuClicked = ($event, value) => {
    this.setState({
      ...this.state,
      navPopover: false
    });

    this.props.navigate($event, value);
  }

  render() {
    return (
      <div className="condensed">
        <IconButton
          iconStyle={{ marginTop: '23px' }}
          className="icon-position"
          iconClassName="golf-icons-equalizer"
          onClick={ this.toggleNavMenu }/>
        <Popover
          open={ this.state.navPopover }
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={ this.handleRequestClose }
        >
          <Menu onChange={ this.menuClicked }>
            <MenuItem primaryText="Standings"
              leftIcon={
                <FontIcon className="golf-icons-list-numbered" />
              } value="/standings"/>
            <MenuItem primaryText="Rosters"
              leftIcon={
                <FontIcon className="golf-icons-user" />
              } value="/rosters"/>
            <MenuItem primaryText="Transactions"
              leftIcon={
                <FontIcon className="golf-icons-tree" />
              } value="/transactions"/>
            <MenuItem primaryText="Notes"
              leftIcon={
                <FontIcon className="golf-icons-bubbles" />
              } value="/notes"/>
            <MenuItem primaryText="Admin"
              leftIcon={
                <FontIcon className="golf-icons-cog" />
              } value="/leagueadmin"/>
          </Menu>
        </Popover>
      </div>
    );
  }
}

PhoneNav.propTypes = {
  navigate: PropTypes.func
};

export default PhoneNav;
