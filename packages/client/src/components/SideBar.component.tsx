import { FC, ReactNode, useState } from 'react';
import { Collapse, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ExpandMore, ExpandLess, School, Dataset, Work, Logout, GroupWork } from '@mui/icons-material';
import { useAuth } from '../context/Auth.context';
import { useNavigate } from 'react-router-dom';
import { Environment } from './Environment.component';
import { Permission } from '../graphql/graphql';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';
import { usePermission } from '../context/Permission.context';

interface SideBarProps {
  open: boolean;
  drawerWidth: number;
}

export const SideBar: FC<SideBarProps> = ({ open, drawerWidth }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { permission } = usePermission();

  const navItems: NavItemProps[] = [
    {
      name: t('menu.projects'),
      icon: <Work />,
      action: () => {},
      visible: (p) => p!.owner || p!.projectAdmin,
      permission,
      subItems: [
        { name: t('menu.newProject'), action: () => navigate('/project/new'), visible: (p) => p!.owner },
        { name: t('menu.projectControl'), action: () => navigate('/project/controls'), visible: (p) => p!.owner },
        {
          name: t('menu.userPermissions'),
          action: () => navigate('/project/permissions'),
          visible: (p) => p!.projectAdmin
        }
      ]
    },
    {
      name: t('menu.studies'),
      action: () => {},
      icon: <School />,
      visible: (p) => p!.projectAdmin || p!.studyAdmin,
      permission,
      subItems: [
        { name: t('menu.newStudy'), action: () => navigate('/study/new'), visible: (p) => p!.projectAdmin },
        { name: t('menu.studyControl'), action: () => navigate('/study/controls'), visible: (p) => p!.projectAdmin },
        {
          name: t('menu.userPermissions'),
          action: () => navigate('/study/permissions'),
          visible: (p) => p!.studyAdmin
        },
        { name: t('menu.entryControl'), action: () => navigate('/study/entries'), visible: (p) => p!.studyAdmin },
        { name: t('menu.viewTags'), action: () => navigate('/study/tags'), visible: (p) => p!.studyAdmin },
        { name: t('menu.studyDownloads'), action: () => navigate('/study/downloads'), visible: (p) => p!.studyAdmin }
      ]
    },
    {
      name: t('menu.datasets'),
      action: () => {},
      icon: <Dataset />,
      visible: (p) => p!.owner,
      permission,
      subItems: [
        { name: t('menu.datasetControl'), action: () => navigate('/dataset/controls'), visible: (p) => p!.owner },
        { name: t('menu.projectAccess'), action: () => navigate('/dataset/projectaccess'), visible: (p) => p!.owner },
        { name: t('menu.datasetDownloads'), action: () => navigate('/dataset/downloads'), visible: (p) => p!.owner }
      ]
    },
    {
      name: t('menu.contribute'),
      action: () => {},
      icon: <GroupWork />,
      permission,
      visible: (p) => p!.contributor,
      subItems: [
        { name: t('menu.tagInStudy'), action: () => navigate('/contribute/landing'), visible: (p) => p!.contributor }
      ]
    },
    {
      name: t('menu.logout'),
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
          paddingBottom: 10,
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

      <LanguageSelector />
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
