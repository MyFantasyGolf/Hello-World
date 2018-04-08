import React from 'react';
import PropTypes from 'prop-types';
import inject from '../services/inject';

import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

@inject('AuthService')
class UserBox extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      anchorElement: null
    };
  }

  toggleMenu = ($event) => {
    this.setState({
      ...this.state,
      open: !this.state.open,
      anchorElement: $event.target
    });
  }

  closeMenu = () => {
    this.setState({
      ...this.state,
      open: false
    });
  }

  logout = () => {
    this.setState({
      ...this.state,
      open: false
    });

    this.props.AuthService.logout();
  }

  changePassword = () => {
    this.setState({
      ...this.state,
      open: false
    });
  }

  render() {
    // eslint-disable-next-line
    const name = this.props.AuthService.me.firstName;

    return (
      <div className="user-box">
        <FlatButton
          label={ name }
          secondary={true}
          onClick={ this.toggleMenu } />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorElement}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.closeMenu}>
          <Menu>
            <MenuItem
              primaryText="Change password"
              onClick={ this.changePassword }/>
            <MenuItem
              primaryText="Logout"
              onClick={ this.logout }/>
          </Menu>
        </Popover>
      </div>
    );
  }
}

UserBox.propTypes = {
  AuthService: PropTypes.object
};

export default UserBox;
