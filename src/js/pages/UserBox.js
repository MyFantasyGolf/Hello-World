import React from 'react';
import PropTypes from 'prop-types';
import inject from '../services/inject';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { withRouter } from 'react-router';

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
    this.props.history.push('/login');
  }

  changePassword = () => {
    this.setState({
      ...this.state,
      open: false
    });
  }

  render() {
    // eslint-disable-next-line
    const name = this.props.AuthService.me.name;

    return (
      <div className="user-box">
        <Button
          variant="flat"
          color="secondary"
          onClick={ this.toggleMenu }>
          {name}
        </Button>
        <Menu
          open={this.state.open}
          anchorEl={this.state.anchorElement}
        >
          <MenuItem
            onClick={ this.changePassword }
          >
            Change password
          </MenuItem>
          <MenuItem
            onClick={ this.logout }
          >
            Logout
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

UserBox.propTypes = {
  AuthService: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(UserBox);
