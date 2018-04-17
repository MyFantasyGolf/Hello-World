import React from 'react';
import PropTypes from 'prop-types';

import { Tabs, Tab } from 'material-ui/tabs';
import FontIcon from 'material-ui/FontIcon';

import { withRouter } from 'react-router-dom';

const MainNavBar = ({ navSelected, history }) => {

  const routes = ['/home', '/myleagues', '/admin'];
  const selectedIndex = routes.findIndex( (route) => {
    return route === history.location.pathname;
  });

  return (
    <div>
      <div className="upper-tab-bar">
        <Tabs initialSelectedIndex={ selectedIndex }>
          <Tab
            label="Home"
            icon={<FontIcon className="golf-icons-bubbles"></FontIcon>}
            onActive={ () => {
              navSelected('/home');
            }}
          >
          </Tab>
          <Tab
            label="League View"
            icon={<FontIcon className="golf-icons-golf-ball"></FontIcon>}
            onActive={ () => {
              navSelected('/myleagues');
            }}
          >
          </Tab>
          <Tab
            label="Admin"
            icon={<FontIcon className="golf-icons-cog"></FontIcon>}
            onActive={ () => {
              navSelected('/admin');
            }}
          >
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

MainNavBar.propTypes = {
  navSelected: PropTypes.func,
  history: PropTypes.object
};

export default withRouter(MainNavBar);
