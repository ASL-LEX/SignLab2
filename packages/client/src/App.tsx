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
import { CssBaseline, Box, styled } from '@mui/material';
import { useState } from 'react';
import { SideBar } from './components/SideBar';

const drawerWidth = 256;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  })
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
                <Box sx={{ flexGrow: 1, width: '90%' }}>
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
                </Box>
              </Box>
            </Main>
          </AuthProvider>
        </EnvironmentContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
