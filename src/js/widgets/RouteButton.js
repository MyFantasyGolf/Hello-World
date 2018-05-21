import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

import { withRouter } from 'react-router-dom';

const RouteButton = ({
  title,
  onClick,
  route,
  iconClass,
  history
}) => {

  const selected = history.location.pathname.endsWith(route);

  const selection = selected ?
    'selected' : 'not-selected';

  return(
    <div className={ `navItem ${selection}` }>
      <IconButton
        variant="flat"
        color="secondary"
        onClick={ onClick }
      >
        <Icon className={iconClass}/>
      </IconButton>
      <div className="title">{ title }</div>
    </div>
  );
};

RouteButton.propTypes = {
  route: PropTypes.string,
  iconClass: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
  history: PropTypes.object
};

export default withRouter(RouteButton);
