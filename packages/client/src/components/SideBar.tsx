import { FC, ReactNode, useState } from 'react';
import { Collapse, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ExpandMore, ExpandLess, School, Dataset, Work, Logout } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';

interface SideBarProps {
  open: boolean;
}

export const SideBar: FC<SideBarProps> = ({ open }) => {
  const drawerWidth = 256;

  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems: NavItemProps[] = [
    {
      name: 'Projects',
      icon: <Work />,
      action: () => {},
      subItems: [
        { name: 'New Project', action: () => navigate('/project/new') },
        { name: 'Project Control', action: () => navigate('/project/controls') },
        { name: 'User Permissions', action: () => navigate('/project/permissions') },
      ]
    },
    {
      name: 'Studies',
      action: () => {},
      icon: <School />,
      subItems: [
        { name: 'New Study', action: () => navigate('/study/new') },
        { name: 'Study Control', action: () => navigate('/study/contols') },
        { name: 'User Permissions', action: () => navigate('/study/permissions') },
        { name: 'Entry Controls', action: () => navigate('/study/controls') },
        { name: 'Download Tags', action: () => navigate('/study/tags') }
      ]
    },
    {
      name: 'Datasets',
      action: () => {},
      icon: <Dataset />,
      subItems: [
        { name: 'Dataset Control', action: () => navigate('/dataset/controls') },
        { name: 'Project Access', action: () => navigate('/dataset/projectaccess') }
      ]
    },
    {
      name: 'Logout',
      action: logout,
      icon: <Logout />
    }
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
  icon?: ReactNode;
  subItems?: NavItemProps[]
}

const NavItem: FC<NavItemProps> = ({ action, name, icon, subItems }) => {
  const isExpandable = subItems && subItems.length > 0;
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
    action();
  };

  const menuItemChildren = isExpandable ? (
    <Collapse in={open} timeout='auto' unmountOnExit>
      <Divider />
      <List disablePadding>
        {subItems.map((item, index) => <NavItem {...item} key={index} />)}
      </List>
    </Collapse>
  ) : null;

  return (
    <>
      <ListItem>
        <ListItemButton component='a' onClick={handleClick}>
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          <ListItemText primary={name} inset={!icon} />
          {isExpandable && !open && <ExpandMore />}
          {isExpandable && open && <ExpandLess />}
        </ListItemButton>
      </ListItem>
      {menuItemChildren}
    </>
  );
};
