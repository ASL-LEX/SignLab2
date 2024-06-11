import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/Home';
import { ThemeProvider } from './theme/ThemeProvider';
import { NavBar } from './components/NavigationBar.component';
import { NewProject } from './pages/projects/NewProject';
import { ProjectControl } from './pages/projects/ProjectControl';
import { SuccessPage } from './pages/SuccessPage';
import { NewStudy } from './pages/studies/NewStudy';
import { ContributeLanding } from './pages/contribute/ContributeLanding';
import { TaggingInterface } from './pages/contribute/TaggingInterface';
import { StudyControl } from './pages/studies/StudyControl';
import { ProjectAccess } from './pages/datasets/ProjectAccess';
import { ProjectUserPermissions } from './pages/projects/ProjectUserPermissions';
import { StudyUserPermissions } from './pages/studies/UserPermissions';
import { TagView } from './pages/studies/TagView';
import { DatasetControls } from './pages/datasets/DatasetControls';
import { AuthProvider, useAuth, AUTH_TOKEN_STR } from './context/Auth.context';
import { AdminGuard } from './guards/AdminGuard';
import { CssBaseline, Box, styled, CircularProgress, Typography } from '@mui/material';
import { FC, ReactNode, useEffect, useState } from 'react';
import { SideBar } from './components/SideBar.component';
import { ProjectProvider } from './context/Project.context';
import { ApolloClient, ApolloProvider, InMemoryCache, concat, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { StudyProvider } from './context/Study.context';
import { ConfirmationProvider } from './context/Confirmation.context';
import { DatasetProvider } from './context/Dataset.context';
import { EntryControls } from './pages/studies/EntryControls';
import { PermissionProvider } from './context/Permission.context';
import { TagTrainingView } from './pages/studies/TagTrainingView';
import { SnackbarProvider } from './context/Snackbar.context';
import { DatasetDownloads } from './pages/datasets/DatasetDownloads';
import { StudyDownloads } from './pages/studies/StudyDownloads';
import { useTranslation } from 'react-i18next';
import * as firebase from '@firebase/app';
import * as firebaseauth from '@firebase/auth';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_AUTH_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN
};

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

type AppState = 'loading' | 'ready' | 'failed';

const App: FC = () => {
  // State of the app loading
  const [appState, setAppState] = useState<AppState>('loading');
  // Initialize firebase app right away
  firebase.initializeApp(firebaseConfig);


  const checkBackend = async () => {
    const result = await fetch(import.meta.env.VITE_HEALTH_ENDPOINT);
    try {
      if (result.ok) {
        setAppState('ready');
      } else {
        console.error('Health endpoint returned non-ok value');
        console.error(`Health endpoint status: ${result.status}`);
        console.error(`Health result ${await result.text()}`);
      }
    } catch (e) {
      console.error('Failed to call health endpoint');
      console.error(e);
      setAppState('failed');
    }
  };

  useEffect(() => {
    checkBackend();
  }, []);

  const render = (state: AppState) => {
    switch (appState) {
      case 'loading':
        return <AppLoading />;
      case 'ready':
        return <AppReady />;
      case 'failed':
        return <AppFailed />;
      default:
        throw Error(`Unknown state ${state}`);
    }
  };

  return (
    <ThemeProvider>
      <BrowserRouter>{render(appState)}</BrowserRouter>
    </ThemeProvider>
  );
};

/** Loading screen */
const AppLoading: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h2">{t('common.loading')}</Typography>
      <CircularProgress />
    </>
  );
};

/** Error screen */
const AppFailed: FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Typography variant="h2">{t('home.backendFailed')}</Typography>
    </>
  );
};

/** Portion of the app that can be loaded after the backend is ready */
const AppReady: FC = () => {
  const [hasUnauthenticatedError, setHasUnauthenticatedError] = useState<boolean>(false);

  // Link for making the HTTP requests
  const httpLink = createHttpLink({ uri: import.meta.env.VITE_GRAPHQL_ENDPOINT });

  // Link for adding auth header to GraphQL requests
  const auth = firebaseauth.getAuth();
  const authLink = setContext(async (_, { headers }) => {
    // Get the current user from auth
    const currentUser = auth.currentUser;
    return {
      headers: {
        ...headers,
        authorization: currentUser ? `Bearer ${await currentUser.getIdToken(false)}` : '',
        organization: import.meta.env.VITE_ORGANIZATION_ID || ''
      }
    };
  });

  // Handles when errors are generated, currently only checking
  // if an unauthenticated error is generated, if so, notify the
  // auth context.
  const errorLink = onError(({ graphQLErrors }) => {
    if (!graphQLErrors) {
      return;
    }

    // Check if one of the error messages is about being unauthenticated
    const hasUnauthenticatedError = !!graphQLErrors.find((error) => error.extensions.code === 'UNAUTHENTICATED');
    if (hasUnauthenticatedError) {
      setHasUnauthenticatedError(true);
    }
  });

  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: concat(concat(authLink, errorLink), httpLink)
  });

  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider
        hasUnauthenticatedError={hasUnauthenticatedError}
        setHasUnauthenticatedError={setHasUnauthenticatedError}
      >
        <ConfirmationProvider>
          <SnackbarProvider>
            <CssBaseline />
            <AppInternal />
          </SnackbarProvider>
        </ConfirmationProvider>
      </AuthProvider>
    </ApolloProvider>
  );
};

/** Contents of the app that can be loaded after authentication takes place */
const AppInternal: FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const { authenticated } = useAuth();

  const mainView: ReactNode = (
    <ProjectProvider>
      <StudyProvider>
        <DatasetProvider>
          <PermissionProvider>
            <Box>
              <NavBar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
            </Box>
            <Main open={drawerOpen}>
              <Box sx={{ display: 'flex' }}>
                <SideBar open={drawerOpen} drawerWidth={drawerWidth} />
                <Box sx={{ flexGrow: 1, width: '90%' }}>
                  <MyRoutes />
                </Box>
              </Box>
            </Main>
          </PermissionProvider>
        </DatasetProvider>
      </StudyProvider>
    </ProjectProvider>
  );

  return <>{authenticated ? mainView : <UnauthenticatedView />}</>;
};

const UnauthenticatedView: FC = () => {
  return <MyRoutes />;
};

const MyRoutes: FC = () => {
  return (
    <Routes>
      <Route path={'/'} element={<HomePage />} />
      <Route element={<AdminGuard />}>
        <Route path={'/project/new'} element={<NewProject />} />
        <Route path={'/project/controls'} element={<ProjectControl />} />
        <Route path={'/project/permissions'} element={<ProjectUserPermissions />} />
        <Route path={'/study/new'} element={<NewStudy />} />
        <Route path={'/study/controls'} element={<StudyControl />} />
        <Route path={'/study/permissions'} element={<StudyUserPermissions />} />
        <Route path={'/study/entries'} element={<EntryControls />} />
        <Route path={'/study/tags'} element={<TagView />} />
        <Route path={'/study/training'} element={<TagTrainingView />} />
        <Route path={'/study/downloads'} element={<StudyDownloads />} />
        <Route path={'/successpage'} element={<SuccessPage />} />
        <Route path={'/dataset/controls'} element={<DatasetControls />} />
        <Route path={'/dataset/projectaccess'} element={<ProjectAccess />} />
        <Route path={'/dataset/downloads'} element={<DatasetDownloads />} />
        <Route path={'/contribute/landing'} element={<ContributeLanding />} />
        <Route path={'/contribute/tagging'} element={<TaggingInterface />} />
      </Route>
    </Routes>
  );
};

export default App;
