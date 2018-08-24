import React from 'react';
import PropTypes from 'prop-types';

import isNil from 'lodash/isNil';
import inject from '../../../services/inject';

import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';

import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom';

@inject('AuthService')
class LoginPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
      name: '',
      passwordConfirm: ''
    };
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

    const { history } = this.props;

    const error = await this.login();

    if (!isNil(error) && !isNil(error.error)) {
      this.setState({
        ...this.state,
        error
      });
    }
    else {
      history.push('/mfg');
    }
  }

  nameChanged = ($event) => {
    this.setState({ ...this.state, name: $event.target.value });
  }

  passwordConfirmChanged = ($event) => {
    this.setState({
      ...this.state,
      passwordConfirm: $event.target.value
    });
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

    if (!isNil(error) && !isNil(error.error)) {
      this.setState({
        ...this.state,
        error
      });

      return;
    }

    this.setState({
      ...this.state,
      email: '',
      password: ''
    });

    this.props.history.push('/login');
  }

  render() {
    return (
      <div className="golf-background">
        <div className="flex golf-banner">
          <div className="golf-icons-golf-tee big-icon"></div>
          <div className="fancy-font">MyFantasyGolf</div>
        </div>

        <Switch>
          <Route path="/login" exact render={() => {
            return (
              <LoginForm
                login={this.loginClicked}
                emailChanged={this.emailChanged}
                passwordChanged={this.passwordChanged}
                email={this.state.email}
                password={this.state.password}
                error={this.state.error}
              />
            );
          }}
          />
          <Route path="/login/register" render={() => {
            return (
              <RegistrationForm
                register={this.registerClicked}
                email={this.state.email}
                password={this.state.password}
                passwordConfirm={this.state.passwordConfirm}
                name={this.state.name}
                nameChanged={this.nameChanged}
                passwordChanged={this.passwordChanged}
                emailChanged={this.emailChanged}
                passwordConfirmChanged={this.passwordConfirmChanged}
                error={this.state.error}
              />
            );
          }}
          />
        </Switch>
      </div>
    );
  }
}

LoginPage.propTypes = {
  AuthService: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(LoginPage);
