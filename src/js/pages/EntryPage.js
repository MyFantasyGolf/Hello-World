import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { observer } from 'mobx-react';
import inject from '../services/inject';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#33691e'
    },
    secondary: {
      main: '#c0ca33'
    }
  },
});

import LoginPage from './views/login/LoginPage';
import HomePage from './HomePage';

@inject('AuthService')
@observer
class EntryPage extends React.Component {

  buildLoadedScreen() {
    return (
      <MuiThemeProvider theme={muiTheme}>
        <BrowserRouter>
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/mfg" component={HomePage} />
            <Redirect to="/mfg" />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }

  render() {
    // return this.buildPresentation();
    return this.buildLoadedScreen();
  }
}

EntryPage.propTypes = {
  AuthService: PropTypes.object
};

export default EntryPage;
