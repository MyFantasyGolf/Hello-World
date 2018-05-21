import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/TextField';
import Button from '@material-ui/core/Button';

import isNil from 'lodash/isNil';

import inject from '../services/inject';

@inject('AuthService')
class RegistrationPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { firstName: '', email: '', password: '', error: null };
  }

  firstNameProvided = ($event) => {
    this.setState({ ...this.state, firstName: $event.target.value });
  }

  emailProvided = ($event) => {
    this.setState({ ...this.state, email: $event.target.value });
  }

  passwordProvided = ($event) => {
    this.setState({ ...this.state, password: $event.target.value });
  }

  registerUser = async () => {
    const { error } = await this.props.AuthService.registerUser(this.state);
    return error;
  }

  registerClicked = async () => {
    this.setState({
      ...this.state,
      error: null
    });

    const error = await this.registerUser();

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
          <div className="fancy-font">MyFantasyGolf- Register</div>
        </div>

        <div className="login">
          <div>
            <TextField
              id="firstName"
              placeholder="First Name"
              required={true}
              value= { this.state.firstName }
              onChange={ this.firstNameProvided }
            >
            </TextField>
          </div>
          <div>
            <TextField
              id="email"
              placeholder="Email Address"
              required={true}
              value={ this.state.email }
              onChange={ this.emailProvided }
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
              onChange={ this.passwordProvided }
            >
            </TextField>
          </div>

          { !isNil(this.state.error) &&
            <div className="error">{ this.state.error }</div>
          }
          <div className="register-buttons">
            <Button
              variant="raised"
              primary={true}
              onClick={ this.registerClicked }>
              Register
            </Button>
          </div>
          <div className="login-link">
            <a href="/login">Already have an account? Login.</a>
          </div>
        </div>
      </div>
    );
  }
}

RegistrationPage.propTypes = {
  AuthService: PropTypes.object
};

export default RegistrationPage;
