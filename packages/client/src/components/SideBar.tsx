import { FC, useState, ReactNode } from 'react';
import { Divider, Drawer, IconButton, List, Typography, Link,
         ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Environment } from './Environment';
import { Navigation } from './Navigation';
import { useAuth } from '../context/AuthContext';

export const SideBar1: FC = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { token, initialized } = useAuth();

  return (
    <>
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
    </>
  );
}

interface SideBarProps {
  open: boolean;
}

export const SideBar: FC<SideBarProps> = ({ open }) => {
  const drawerWidth = 256;

  const navItems: NavItemProps[] = [

  ];

  return (
    <Drawer
      variant='persistent'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#103F68',
          color: 'white',
          paddingTop: 18,
          mt: '64px'
        }
      }}
      anchor='left'
      open={open}
    >
      <List>
        {navItems.map((navItem) => <NavItem {...navItem} key={navItem.name} />)}
      </List>
    </Drawer>
  );
};

interface NavItemProps {
  action: () => void;
  name: string;
  icon: ReactNode;
}

const NavItem: FC<NavItemProps> = ({ action, name, icon }) => {
  return (
    <ListItem>
      <ListItemButton component='a' onClick={action}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={name} />
      </ListItemButton>
    </ListItem>
  );
};
