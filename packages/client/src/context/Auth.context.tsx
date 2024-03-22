import { createContext, FC, useContext, useEffect, useState, ReactNode } from 'react';
import jwt_decode from 'jwt-decode';
import * as firebaseui from 'firebaseui';
import * as firebase from '@firebase/app';
import * as firebaseauth from '@firebase/auth';
import { Organization } from '../graphql/graphql';
import { useGetOrganizationsQuery } from '../graphql/organization/organization';
import { signInWithPopup } from 'firebase/auth';
import { MenuItem, Select } from '@mui/material';
import { any } from 'prop-types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_AUTH_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN
};

// // Switch to TENANT_ID1.
//  const authID=firebaseauth.GithubAuthProvider.PROVIDER_ID;
// //  = 'TENANT_ID1';

// // Sign-in with popup.
// signInWithPopup(authID, provider)
//   .then((userCredential) => {
//     // User is signed in.
//     const user = userCredential.user;
//     // user.tenantId is set to 'TENANT_ID1'.
//     // Provider data available from the result.user.getIdToken()
//     // or from result.user.providerData
//   })
//   .catch((error) => {
//     // Handle / display error.
//     // ...
//   });
export const AUTH_TOKEN_STR = 'token';

export interface DecodedToken {
  aud: string;
  auth_time: number;
  email: string;
  email_verified: boolean;
  exp: number;
  firebase: {
    identities: {
      email: string[];
      email_verified: boolean;
    };
    sign_in_provider: string;
    user_id: string;
    tenant: string;
  };
  iat: number;
  iss: string;
  sub: string;
  user_id: string;
}

export interface AuthContextProps {
  authenticated: boolean;
  token: string | null;
  decodedToken: DecodedToken | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem(AUTH_TOKEN_STR));
  const [authenticated, setAuthenticated] = useState<boolean>(true);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [organizationList, setOrganizationList] = useState<Organization[] | null>(null);

  const getOrganizationResult = useGetOrganizationsQuery();

  useEffect(() => {
    // TODO: Handle multi-organization login
    if (getOrganizationResult.data && getOrganizationResult.data.getOrganizations.length > 0) {
      setOrganizationList(getOrganizationResult.data.getOrganizations);
      console.log('Here' + getOrganizationResult);
      setOrganization(getOrganizationResult.data.getOrganizations[0]);
    }
  }, [getOrganizationResult.data]);

  const handleUnauthenticated = () => {
    // Clear the token and authenticated state
    setToken(null);
    setAuthenticated(false);
    localStorage.removeItem(AUTH_TOKEN_STR);
  };

  const handleAuthenticated = (token: string) => {
    setToken(token);
    setAuthenticated(true);
    localStorage.setItem(AUTH_TOKEN_STR, token);

    const decodedToken = jwt_decode<DecodedToken>(token);
    setDecodedToken(decodedToken);
  };

  // Handle loading the login UI
  useEffect(() => {
    // Check local storage for token
    const token = localStorage.getItem(AUTH_TOKEN_STR);

    // If no token, need to login
    if (!token) {
      handleUnauthenticated();
      return;
    }

    // Decode the token
    const decodedToken = jwt_decode<DecodedToken>(token);

    // If token is expired, need to login
    if (decodedToken.exp * 1000 < Date.now()) {
      handleUnauthenticated();
      return;
    }

    // Otherwise, can set the token and authenticated state
    handleAuthenticated(token);
  }, []);

  const logout = () => {
    handleUnauthenticated();
  };

  return (
    <div>
      <div className="options">
        <Select>
          {organizationList?.map((organization, index) => {
            return (
              <MenuItem key={index} value={10}>
                {organization.name}
              </MenuItem>
            );
          })}
        </Select>
      </div>
      <AuthContext.Provider value={{ token, authenticated, decodedToken, logout }}>
        {!authenticated && organization && (
          <FirebaseLoginWrapper setToken={handleAuthenticated} organization={organization} />
        )}
        {authenticated && children}
      </AuthContext.Provider>
    </div>
  );
};

interface FirebaseLoginWrapperProps {
  setToken: (token: string) => void;
  organization: Organization;
}

const FirebaseLoginWrapper: FC<FirebaseLoginWrapperProps> = ({ setToken, organization }) => {
  firebase.initializeApp(firebaseConfig);

  // Handle multi-tenant login
  const auth = firebaseauth.getAuth();
  auth.tenantId = organization.tenantID;

  const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

  const signInSuccess = async (authResult: any) => {
    setToken(await authResult.user.getIdToken());
  };

  useEffect(() => {
    ui.start('#firebaseui-auth-container', {
      callbacks: {
        signInSuccessWithAuthResult: (authResult, _redirectUrl) => {
          signInSuccess(authResult);
          return true;
        }
      },
      signInOptions: [
        firebaseauth.GoogleAuthProvider.PROVIDER_ID,
        firebaseauth.GithubAuthProvider.PROVIDER_ID,
        firebaseauth.EmailAuthProvider.PROVIDER_ID
      ]
    });
  }, []);

  return <div id="firebaseui-auth-container" />;
};

export const useAuth = () => useContext(AuthContext);
