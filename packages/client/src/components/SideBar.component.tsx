import { FC, ReactNode, useState } from 'react';
import { Collapse, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ExpandMore, ExpandLess, School, Dataset, Work, Logout, GroupWork } from '@mui/icons-material';
import { useAuth } from '../context/Auth.context';
import { useNavigate } from 'react-router-dom';
import { Environment } from './Environment.component';

interface SideBarProps {
  open: boolean;
  drawerWidth: number;
}

export const SideBar: FC<SideBarProps> = ({ open, drawerWidth }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems: NavItemProps[] = [
    {
      name: 'Projects',
      icon: <Work />,
      action: () => {},
      visible: () => true,
      subItems: [
        { name: 'New Project', action: () => navigate('/project/new'), visible: () => true },
        { name: 'Project Control', action: () => navigate('/project/controls'), visible: () => true },
        { name: 'User Permissions', action: () => navigate('/project/permissions'), visible: () => true },
      ]
    },
    {
      name: 'Studies',
      action: () => {},
      icon: <School />,
      visible: () => true,
      subItems: [
        { name: 'New Study', action: () => navigate('/study/new'), visible: () => true },
        { name: 'Study Control', action: () => navigate('/study/controls'), visible: () => true },
        { name: 'User Permissions', action: () => navigate('/study/permissions'), visible: () => true },
        { name: 'Entry Controls', action: () => navigate('/study/controls'), visible: () => true },
        { name: 'Download Tags', action: () => navigate('/study/tags'), visible: () => true },
      ]
    },
    {
      name: 'Datasets',
      action: () => {},
      icon: <Dataset />,
      visible: () => true,
      subItems: [
        { name: 'Dataset Control', action: () => navigate('/dataset/controls'), visible: () => true },
        { name: 'Project Access', action: () => navigate('/dataset/projectaccess'), visible: () => true },
      ]
    },
    {
      name: 'Contribute',
      action: () => {},
      icon: <GroupWork />,
      visible: () => true,
      subItems: [{ name: 'Tag in Study', action: () => navigate('/contribute/landing'), visible: () => true }]
    },
    {
      name: 'Logout',
      action: logout,
      icon: <Logout />,
      visible: () => true
    }
  ];

  return (
    <Drawer
      variant="persistent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#103F68',
          color: 'white',
          paddingTop: 2,
          mt: '64px'
        }
      }}
      anchor="left"
      open={open}
    >
      <List sx={{ paddingTop: '30px' }}>
        {navItems
          .filter((navItem) => navItem.visible())
          .map((navItem) => <NavItem {...navItem} key={navItem.name} />)
        }
      </List>
      <Environment />
    </Drawer>
  );
};

interface NavItemProps {
  action: () => void;
  name: string;
  icon?: ReactNode;
  subItems?: NavItemProps[];
  visible: () => boolean;
}

const NavItem: FC<NavItemProps> = ({ action, name, icon, subItems }) => {
  const isExpandable = subItems && subItems.length > 0;
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
    action();
  };

  const menuItemChildren = isExpandable ? (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Divider />
      <List disablePadding>
        {subItems.map((item, index) => (
          <NavItem {...item} key={index} />
        ))}
      </List>
    </Collapse>
  ) : null;

  return (
    <>
      <ListItem>
        <ListItemButton component="a" onClick={handleClick}>
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
