import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const OkCancelDialog = ({text, title, callback, open, cancel}) => {

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      disableBackdropClick
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        { cancel &&
          <Button
            type="flat"
            color="secondary"
            onClick={() => {callback(false); }}
          >
            Cancel
          </Button>
        }
        <Button
          type="raised"
          color="primary"
          onClick={() => {callback(true); }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

OkCancelDialog.propTypes = {
  text: PropTypes.string,
  title: PropTypes.string,
  callback: PropTypes.func,
  open: PropTypes.bool,
  cancel: PropTypes.bool
};

OkCancelDialog.defaultProps = {
  callback: () => {},
  text: 'Are you sure?',
  title: 'Confirm',
  cancel: true
};

export default OkCancelDialog;
