import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import isNil from 'lodash/isNil';

import inject from '../services/inject';

@inject('AuthService')
class LoginPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: null };
  }

  emailChanged = ($event) => {
    this.setState({ ...this.state, email: $event.target.value });
  }

  passwordChanged = ($event) => {
    this.setState({ ...this.state, password: $event.target.value });
  }

  login = async () => {
    const { error } = await this.props.AuthService.login(this.state);
    return error;
  }

  loginClicked = async () => {
    this.setState({
      ...this.state,
      error: null
    });

    const error = await this.login();

    this.setState({
      ...this.state,
      error
    });
  }

  render() {
    return (
      <div className="golf-background">
        <div className="flex golf-banner">
          <div className="golf-icons-golf-tee big-icon"></div>
          <div className="fancy-font">MyFantasyGolf</div>
        </div>

        <div className="login">
          <div>
            <TextField
              id="email"
              placeholder="Email Address"
              required={true}
              value={ this.state.email }
              onChange={ this.emailChanged }
            >
            </TextField>
          </div>
          <div>
            <TextField
              id="password"
              placeholder="Password"
              require="true"
              type="password"
              value={ this.state.password }
              onChange={ this.passwordChanged }
            >
            </TextField>
          </div>

          { !isNil(this.state.error) &&
            <div className="error">{ this.state.error }</div>
          }
          <div className="login-buttons">
            <RaisedButton
              primary={true}
              onClick={ this.loginClicked }>
              Login
            </RaisedButton>
          </div>
          <div className="register-link">
            <a href="#">Not registered yet? Register now.</a>
          </div>
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  AuthService: PropTypes.object
};

export default LoginPage;
