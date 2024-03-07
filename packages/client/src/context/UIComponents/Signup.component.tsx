import { useState, FC } from 'react';
import * as firebaseauth from '@firebase/auth';
import styles from './styles.component';
import { useNavigate } from 'react-router-dom';

interface SignUpComponentProps {
  auth: firebaseauth.Auth;
}

// SignUp Page Component
const SignUpComponent: FC<SignUpComponentProps> = ({ auth }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await firebaseauth.createUserWithEmailAndPassword(auth, email, password);
      alert('Sign Up Successfully');
      setPassword('');
      navigate('/');
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSignUp} style={styles.form}>
      <label style={styles.label}>Enter Username</label>
      <input type="email" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <label style={styles.label}>Enter Password</label>
      <input type="password" style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit" style={styles.button}>Sign Up</button>
    </form>
  );
};

export default SignUpComponent;
