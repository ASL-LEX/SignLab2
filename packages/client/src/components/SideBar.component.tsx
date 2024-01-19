import { FC, ReactNode, useEffect, useState } from 'react';
import { Collapse, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ExpandMore, ExpandLess, School, Dataset, Work, Logout, GroupWork } from '@mui/icons-material';
import { useAuth } from '../context/Auth.context';
import { useNavigate } from 'react-router-dom';
import { Environment } from './Environment.component';
import { Permission } from '../graphql/graphql';
import { useGetRolesQuery } from '../graphql/permission/permission';
import { useProject } from '../context/Project.context';
import { useStudy } from '../context/Study.context';

interface SideBarProps {
  open: boolean;
  drawerWidth: number;
}

export const SideBar: FC<SideBarProps> = ({ open, drawerWidth }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [permission, setPermission] = useState<Permission | null>(null);
  const { project } = useProject();
  const { study } = useStudy();
  const rolesQueryResults = useGetRolesQuery({ variables: { project: project?._id, study: study?._id } });

  useEffect(() => {
    if (rolesQueryResults.data) {
      setPermission(rolesQueryResults.data.getRoles);
    }
  }, [rolesQueryResults.data]);

  const navItems: NavItemProps[] = [
    {
      name: 'Projects',
      icon: <Work />,
      action: () => {},
      visible: (p) => p!.owner || p!.projectAdmin,
      permission,
      subItems: [
        { name: 'New Project', action: () => navigate('/project/new'), visible: (p) => p!.owner },
        { name: 'Project Control', action: () => navigate('/project/controls'), visible: (p) => p!.owner },
        { name: 'User Permissions', action: () => navigate('/project/permissions'), visible: (p) => p!.projectAdmin }
      ]
    },
    {
      name: 'Studies',
      action: () => {},
      icon: <School />,
      visible: (p) => p!.projectAdmin || p!.studyAdmin,
      permission,
      subItems: [
        { name: 'New Study', action: () => navigate('/study/new'), visible: (p) => p!.projectAdmin },
        { name: 'Study Control', action: () => navigate('/study/controls'), visible: (p) => p!.projectAdmin },
        { name: 'User Permissions', action: () => navigate('/study/permissions'), visible: (p) => p!.studyAdmin },
        { name: 'Entry Controls', action: () => navigate('/study/entries'), visible: (p) => p!.studyAdmin },
        { name: 'Download Tags', action: () => navigate('/study/tags'), visible: (p) => p!.studyAdmin }
      ]
    },
    {
      name: 'Datasets',
      action: () => {},
      icon: <Dataset />,
      visible: (p) => p!.owner,
      permission,
      subItems: [
        { name: 'Dataset Control', action: () => navigate('/dataset/controls'), visible: (p) => p!.owner },
        { name: 'Project Access', action: () => navigate('/dataset/projectaccess'), visible: (p) => p!.owner }
      ]
    },
    {
      name: 'Contribute',
      action: () => {},
      icon: <GroupWork />,
      permission,
      visible: (p) => p!.contributor,
      subItems: [
        { name: 'Tag in Study', action: () => navigate('/contribute/landing'), visible: (p) => p!.contributor }
      ]
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
      {permission && (
        <List sx={{ paddingTop: '30px' }}>
          {navItems
            .filter((navItem) => navItem.visible(permission))
            .map((navItem) => (
              <NavItem {...navItem} key={navItem.name} />
            ))}
        </List>
      )}
      <Environment />
    </Drawer>
  );
};

interface NavItemProps {
  action: () => void;
  name: string;
  icon?: ReactNode;
  subItems?: NavItemProps[];
  permission?: Permission | null;
  visible: (permission: Permission | null | undefined) => boolean;
}

const NavItem: FC<NavItemProps> = ({ action, name, icon, subItems, permission }) => {
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
        {subItems
          .filter((subItem) => subItem.visible(permission))
          .map((item, index) => (
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
