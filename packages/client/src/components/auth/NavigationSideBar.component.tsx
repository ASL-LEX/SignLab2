import { Drawer, List, ListItem, ListItemText, Typography, Box, Collapse } from '@mui/material';
import { useState } from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const drawerWidth = 270;

const NavigationSidebar = () => {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#283593',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <Typography variant="h5" sx={{ color: 'white' }}>
          ASL-LEX SignLab
        </Typography>
      </Box>
      <List
        sx={{
          height: '100%', 
          '.MuiListItem-root': {
            color: 'white',
            backgroundColor: '#5c6bc0',
          },
        }}
      >
        <ListItem button key="Navigation" onClick={handleClick}>
          <ListItemText primary="Navigation" />
          {open ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button key="Login">
              <ListItemText primary="Login" sx={{ pl: 4, color: 'white' }} />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default NavigationSidebar;
