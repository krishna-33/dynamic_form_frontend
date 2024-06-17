import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import DialogAlert from '../dialog';

export default function Header() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };


  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dynamic Forms
          </Typography>
          <Button color="inherit" onClick={handleClickOpen}>Sign Out</Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
    <DialogAlert open={open} setOpen={setOpen} />
    </>
  );
}
