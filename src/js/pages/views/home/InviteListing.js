import React from 'react';
import PropTypes from 'prop-types';

import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

const InviteListing = ({invite, acceptInvitation, declineInvitation}) => {
  return (
    <div className="league-listing flex space-between">
      <div>
        <div>{invite.name}</div>
        <div className="subtext">{`by ${invite.commissioner.name}`}</div>
      </div>
      <div>
        <IconButton>
          <Icon className="golf-icons-cross2" title="Decline"
            onClick={() => { declineInvitation(invite); }}
          />
        </IconButton>
        <IconButton>
          <Icon className="golf-icons-check" title="Accept"
            onClick={() => { acceptInvitation(invite); }}
          />
        </IconButton>
      </div>
    </div>
  );
};

InviteListing.propTypes = {
  invite: PropTypes.shape({
    name: PropTypes.string,
    commisioner: PropTypes.shape({
      name: PropTypes.string
    })
  }),
  acceptInvitation: PropTypes.func.isRequired,
  declineInvitation: PropTypes.func.isRequired
};

export default InviteListing;
