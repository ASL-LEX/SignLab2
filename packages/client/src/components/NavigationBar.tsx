import { AppBar, Toolbar, CssBaseline, Typography, Link } from '@mui/material';
import { SideBar } from './SideBar';
import { Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function NavBar() {
  const { token, initialized } = useAuth();
  const navigate = useNavigate();
  return (
    <AppBar>
      <CssBaseline />
      <Toolbar>
        <SideBar />
        <Typography
          sx={{
            flexGrow: '1',
            textAlign: 'right',
            paddingRight: '1rem'
          }}
        >
          ASL-LEX SignLab
        </Typography>
        <Divider orientation="vertical" flexItem />
        {!token || !initialized ? (
          <div>
            <Link sx={{ fontSize: '16px', paddingLeft: '1rem', color: 'white' }} underline="none" href={`/loginpage`}>
              Log In
            </Link>
            <Link sx={{ fontSize: '16px', paddingLeft: '1rem', color: 'white' }} underline="none" href={`/loginpage`}>
              Sign Up
            </Link>
          </div>
        ) : (
          <Link sx={{ fontSize: '16px', paddingLeft: '1rem', color: 'white' }} underline="none" onClick={() => navigate('/logoutpage')}>
            Log Out
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
}
export { NavBar };
