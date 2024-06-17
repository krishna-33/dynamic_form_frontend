import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch } from 'react-redux';
import { signout } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import useAlerts from '../../hooks/useAlerts';

export default function DialogAlert({open, setOpen}) {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { success } = useAlerts();



  const handleClose = () => {
    setOpen(false);
  };

  const handleSignOut = () => {
    dispatch(signout());
    setOpen(false);
    navigate('/signin')
    success('SignOut suceessfully')
  }
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Sign Out"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to signout from website ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleSignOut} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
