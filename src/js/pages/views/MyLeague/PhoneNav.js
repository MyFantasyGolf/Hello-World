import React from 'react';
import PropTypes from 'prop-types';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

class PhoneNav extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      navPopover: false,
      anchorEl: null
    };
  }

  handleRequestClose = () => {
    this.setState({
      ...this.state,
      navPopover: false
    });
  }

  toggleNavMenu = ($event) => {
    this.setState({
      ...this.state,
      anchorEl: $event.currentTarget,
      navPopover: !this.state.navPopver
    });
  }

  menuClicked = (value) => {
    this.setState({
      ...this.state,
      navPopover: false
    });

    this.props.navigate(value);
  }

  render() {
    return (
      <div className="condensed">
        <IconButton
          variant=""
          className="icon-position"
          onClick={ this.toggleNavMenu }>
          <Icon className="golf-icons-equalizer" />
        </IconButton>

        <Menu
          open={ this.state.navPopover }
          anchorEl={this.state.anchorEl}>
          <MenuItem
            onClick={() => { this.menuClicked('/standings'); }}
          >
            <ListItemIcon>
              <Icon className="golf-icons-list-numbered" />
            </ListItemIcon>
            <ListItemText inset primary="Standings" />
          </MenuItem>
          <MenuItem
            onClick={() => { this.menuClicked('/rosters'); }}
          >
            <ListItemIcon>
              <Icon className="golf-icons-user"/>
            </ListItemIcon>
            <ListItemText inset primary="Rosters" />
          </MenuItem>
          <MenuItem
            onClick={() => { this.menuClicked('/transactions'); }}
          >
            <ListItemIcon>
              <Icon className="golf-icons-tree" />
            </ListItemIcon>
            <ListItemText inset primary="Transactions" />
          </MenuItem>
          <MenuItem
            onClick={() => { this.menuClicked('/notes'); }}
          >
            <ListItemIcon>
              <Icon className="golf-icons-bubbles"/>
            </ListItemIcon>
            <ListItemText inset primary="Notes" />
          </MenuItem>
          <MenuItem
            onClick={() => { this.menuClicked('/leagueadmin'); }}
          >
            <ListItemIcon>
              <Icon className="golf-icons-cog" />
            </ListItemIcon>
            <ListItemText inset primary="Admin" />
          </MenuItem>
        </Menu>

      </div>
    );
  }
}

PhoneNav.propTypes = {
  navigate: PropTypes.func
};

export default PhoneNav;
