import React from 'react';
import PropTypes from 'prop-types';

import isNil from 'lodash/isNil';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import {
  withRouter
} from 'react-router-dom';

const LoginForm = ({
  login,
  password,
  email,
  passwordChanged,
  emailChanged,
  error,
  history
}) => {


  const passwordKey = ($event) => {
    if ($event.keyCode === 13) {
      login();
    }
  };

  return (
    <div className="login">
      <div>
        <TextField
          id="email"
          placeholder="Email Address"
          required={true}
          value={ email }
          onChange={ emailChanged }
        >
        </TextField>
      </div>
      <div>
        <TextField
          id="password"
          placeholder="Password"
          require="true"
          type="password"
          value={ password }
          onChange={ passwordChanged }
          onKeyUp={ passwordKey }
        >
        </TextField>
      </div>

      { !isNil(error) &&
        <div className="error">{ error }</div>
      }
      <div className="login-buttons">
        <Button
          variant="raised"
          color="primary"
          onClick={ login }>
          Login
        </Button>
      </div>
      <div className="register-link">
        <a onClick={ () => { history.push('/login/register');}}>
          Not registered yet? Register now.
        </a>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
  emailChanged: PropTypes.func.isRequired,
  passwordChanged: PropTypes.func.isRequired,
  password: PropTypes.string,
  email: PropTypes.string,
  error: PropTypes.string,
  history: PropTypes.object
};

LoginForm.defaultProps = {
  password: '',
  email: ''
};

export default withRouter(LoginForm);
