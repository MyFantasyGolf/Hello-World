import React from 'react';
import PropTypes from 'prop-types';

import { Tabs, Tab } from 'material-ui/tabs';
import FontIcon from 'material-ui/FontIcon';

const MainNavBar = ({ navSelected }) => {
  return (
    <Tabs>
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
  );
};

MainNavBar.propTypes = {
  navSelected: PropTypes.func
};

export default MainNavBar;
