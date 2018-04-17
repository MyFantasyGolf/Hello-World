import React from 'react';
import PropTypes from 'prop-types';

import IconButton from 'material-ui/IconButton';

import { withRouter } from 'react-router-dom';

const RouteButton = ({
  title,
  onClick,
  route,
  iconClass,
  history
}) => {

  const selected = history.location.pathname === route;

  const selection = selected ?
    'selected' : 'not-selected';

  const iconStyle = selected ?
    { color: 'white' } : {};

  return(
    <div className={ `navItem ${selection}` }>
      <IconButton
        iconClassName={ iconClass }
        onClick={ onClick }
        iconStyle={ iconStyle }
      >
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
