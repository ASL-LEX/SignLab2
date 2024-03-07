import { useState, FC } from 'react';
import * as firebaseauth from '@firebase/auth';
import styles from './styles.component';

interface LoginComponentProps {
  onLoginSuccess: (token: string) => void;
  auth: firebaseauth.Auth;
}

// Login Page Component
const LoginComponent: FC<LoginComponentProps> = ({ auth, onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  // Handle Login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await firebaseauth.signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      onLoginSuccess(token);
    } catch (error) {
      alert((error as Error).message);
      setPassword('');
    }
  };

  return (
    <form onSubmit={handleLogin} style={styles.form}>
      <label style={styles.label}>Enter Participant Username</label>
      <input type="email" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <label style={styles.label}>Enter Password</label>
      <input type="password" style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit" style={styles.button}>Login</button>
    </form>
  );
};

export default LoginComponent;
