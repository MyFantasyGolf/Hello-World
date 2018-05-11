import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import isNil from 'lodash/isNil';
import { observer } from 'mobx-react';
import inject from '../services/inject';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
  green500, green700, amber500,
} from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  'palette': {
    'primary1Color': green500,
    'primary2Color': green700,
    'accent1Color': amber500,
  },
});

import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage';
import HomePage from './HomePage';

@inject('AuthService')
@observer
class EntryPage extends React.Component {

  componentWillMount() {
    this.initialize();
  }

  async initialize() {
    this.setState({ loading: true });
    await this.props.AuthService.getCurrentUser();
    this.setState({ loading: false });
  }

  buildLoadingScreen() {
    return <div>Loading...</div>;
  }

  buildLoginRoute() {
    if (isNil(this.props.AuthService.me)) {
      return <Route exact path="/login" component={LoginPage} />;
    }

    return <Redirect from="/login" to="/" />;
  }

  buildRegisterRoute() {
    if (isNil(this.props.AuthService.me)) {
      return <Route exact path="/register" component={RegistrationPage} />;
    }

    return <Redirect from="/register" to="/" />;
  }

  buildLoadedScreen() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <BrowserRouter>
          <Switch>
            { this.buildLoginRoute() }
            { this.buildRegisterRoute() }
            { isNil(this.props.AuthService.me) &&
              <Redirect to="/login" />
            }
            <Route path="/" component={HomePage} />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }

  buildPresentation() {
    const view = this.state.loading === true ?
      this.buildLoadingScreen() :
      this.buildLoadedScreen();

    return view;
  }

  render() {
    return this.buildPresentation();
  }
}

EntryPage.propTypes = {
  AuthService: PropTypes.object
};

export default EntryPage;
