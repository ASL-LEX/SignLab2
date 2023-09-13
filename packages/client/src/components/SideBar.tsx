import { FC, ReactNode, useState } from 'react';
import { Collapse, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ExpandMore, ExpandLess, School, Dataset, Work } from '@mui/icons-material';

interface SideBarProps {
  open: boolean;
}

export const SideBar: FC<SideBarProps> = ({ open }) => {
  const drawerWidth = 256;

  const navItems: NavItemProps[] = [
    {
      name: 'Projects',
      icon: <Work />,
      action: () => {},
      subItems: [
        { name: 'New Project', action: () => {} },
        { name: 'Project Control', action: () => {} },
        { name: 'User Permissions', action: () => {} },
      ]
    },
    {
      name: 'Studies',
      action: () => {},
      icon: <School />,
      subItems: [
        { name: 'New Study', action: () => {} },
        { name: 'Study Control', action: () => {} },
        { name: 'User Permissions', action: () => {} },
        { name: 'Entry Controls', action: () => {} },
        { name: 'Download Tags', action: () => {} }
      ]
    },
    {
      name: 'Datasets',
      action: () => {},
      icon: <Dataset />,
      subItems: [
        { name: 'Dataset Control', action: () => {} },
        { name: 'Project Access', action: () => {} }
      ]
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
