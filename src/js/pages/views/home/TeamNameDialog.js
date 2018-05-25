import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const TeamNameDialog = ({
  open,
  invitation,
  teamName,
  teamNameChanged,
  callback}) => {

  return (
    <Dialog
      open={open}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle>Accept Invitation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          `Please enter a team name to use in league ${invitation.name}`
        </DialogContentText>
        <TextField
          label="Team Name"
          value={teamName}
          onChange={teamNameChanged}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => { callback(false); }}
          type="flat"
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={() => { callback(true); }}
          type="raised"
          color="primary"
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

TeamNameDialog.propTypes = {
  open: PropTypes.bool,
  invitation: PropTypes.shape({
    name: PropTypes.string
  }),
  teamName: PropTypes.string,
  teamNameChanged: PropTypes.func,
  callback: PropTypes.func
};

TeamNameDialog.defaultProps = {
  open: false,
  teamName: '',
  teamNameChanged: () => {},
  callback: () => {}
};

export default TeamNameDialog;
