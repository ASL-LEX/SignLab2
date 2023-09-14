import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/Home';
import { ThemeProvider } from './theme/ThemeProvider';
import { NavBar } from './components/NavigationBar';
import { NewProject } from './pages/projects/NewProject';
import { ProjectControl } from './pages/projects/ProjectControl';
import { SuccessPage } from './pages/SuccessPage';
import { NewStudy } from './pages/studies/NewStudy';
import { ContributePage } from './pages/contribute/Contribute';
import { TagView } from './components/TagView';
import { StudyControl } from './pages/studies/StudyControl';
import { ProjectAccess } from './pages/datasets/ProjectAccess';
import { ProjectUserPermissions } from './pages/projects/ProjectUserPermissions';
import { StudyUserPermissions } from './pages/studies/UserPermissions';
import { DownloadTags } from './pages/studies/DownloadTags';
import { LoginPage } from './pages/LoginPage';
import { DatasetControls } from './pages/datasets/DatasetControls';
import { AuthCallback } from './pages/AuthCallback';
import { EnvironmentContextProvider } from './context/EnvironmentContext';
import { AuthProvider } from './context/AuthContext';
import { AdminGuard } from './guards/AdminGuard';
import { LogoutPage } from './pages/LogoutPage';
import { CssBaseline, Box, styled, Typography } from '@mui/material';
import { useState } from 'react';
import { SideBar } from './components/SideBar';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{ open?: boolean; }>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}));

function App() {
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <EnvironmentContextProvider>
          <AuthProvider>
            <CssBaseline />
            <Box>
              <NavBar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
            </Box>
            <Main open={drawerOpen}>
              <Box sx={{ display: 'flex' }}>
              <SideBar open={drawerOpen} drawerWidth={drawerWidth} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography>

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.

Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. N
                  </Typography>
                </Box>
              </Box>
            </Main>
          </AuthProvider>
        </EnvironmentContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

/*
                    <Routes>
                      <Route path={'/'} element={<HomePage />} />
                      <Route path={'/callback'} element={<AuthCallback />} />
                      <Route path={'/loginpage'} element={<LoginPage />} />
                      <Route element={<AdminGuard />}>
                        <Route path={'/project/new'} element={<NewProject />} />
                        <Route path={'/project/controls'} element={<ProjectControl />} />
                        <Route path={'/project/permissions'} element={<ProjectUserPermissions />} />
                        <Route path={'/study/new'} element={<NewStudy />} />
                        <Route path={'/study/controls'} element={<StudyControl />} />
                        <Route path={'/study/permissions'} element={<StudyUserPermissions />} />
                        <Route path={'/study/tags'} element={<DownloadTags />} />
                        <Route path={'/successpage'} element={<SuccessPage />} />
                        <Route path={'/dataset/controls'} element={<DatasetControls />} />
                        <Route path={'/dataset/projectaccess'} element={<ProjectAccess />} />
                        <Route path={'/study/contribute'} element={<ContributePage />} />
                        <Route path={'/tagging'} element={<TagView />} />
                        <Route path={'/logoutpage'} element={<LogoutPage />} />
                      </Route>
                    </Routes>
                    */

export default App;
