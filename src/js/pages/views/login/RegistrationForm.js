import React from 'react';
import PropTypes from 'prop-types';

import isNil from 'lodash/isNil';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import {
  withRouter
} from 'react-router-dom';

const RegistrationForm = ({
  email,
  password,
  passwordConfirm,
  emailChanged,
  name,
  nameChanged,
  passwordChanged,
  passwordConfirmChanged,
  register,
  error,
  history
}) => {
  return (
    <div className="login">
      <div>
        <TextField
          id="userName"
          placeholder="Name"
          required={true}
          value= { name }
          onChange={ nameChanged }
        >
        </TextField>
      </div>
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
        >
        </TextField>
      </div>
      <div>
        <TextField
          id="passwordConfirm"
          placeholder="Confirm Password"
          require="true"
          type="password"
          value={ passwordConfirm }
          onChange={ passwordConfirmChanged }
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
          onClick={ register }>
          Register
        </Button>
      </div>
      <div className="register-link">
        <a onClick={() => { history.push('/login');}} >
          Already have an account? Login.
        </a>
      </div>
    </div>
  );
};

RegistrationForm.propTypes = {
  register: PropTypes.func.isRequired,
  email: PropTypes.string,
  password: PropTypes.string,
  passwordConfirm: PropTypes.string,
  name: PropTypes.string,
  nameChanged: PropTypes.func.isRequired,
  passwordChanged: PropTypes.func.isRequired,
  passwordConfirmChanged: PropTypes.func.isRequired,
  emailChanged: PropTypes.func.isRequired,
  error: PropTypes.string,
  history: PropTypes.object
};

RegistrationForm.defaultProps = {
  email: '',
  password: '',
  name: '',
  passwordConfrim: '',
  error: ''
};

export default withRouter(RegistrationForm);
