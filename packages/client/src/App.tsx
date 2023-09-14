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
import { CssBaseline } from '@mui/material';
import { useState } from 'react';
import { SideBar } from './components/SideBar';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <EnvironmentContextProvider>
          <CssBaseline />
          <AuthProvider>
            <NavBar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
            <SideBar open={drawerOpen} />
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
          </AuthProvider>
        </EnvironmentContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
