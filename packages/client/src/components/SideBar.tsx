import { useState } from 'react';
import { Divider, Drawer, IconButton, List, Typography, Link } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Environment } from './Environment';
import { Navigation } from './Navigation';
import { useAuth } from '../context/AuthContext';

function SideBar() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { token, initialized } = useAuth();

  return (
    <div>
      <Drawer PaperProps={{ sx: { width: '25%' } }} open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <List sx={{ marginTop: '20px' }}>
          <Link
            sx={{
              fontSize: '22px',
              paddingLeft: '16px'
            }}
            underline={'none'}
            href="/"
            onClick={() => setOpenDrawer(false)}
          >
            Home
          </Link>
        </List>
        <Divider sx={{ paddingTop: '8px' }} orientation="horizontal" flexItem />
        {token && initialized && (
          <div>
            <Typography variant="h5">Environment</Typography>
            <Environment />
            <Divider orientation="horizontal" flexItem />
            <Typography variant="h5">Navigation</Typography>
            <Navigation />
          </div>
        )}
      </Drawer>
      <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
        <MenuIcon />
      </IconButton>
    </div>
  );
}
export { SideBar };
