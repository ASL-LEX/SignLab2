import { useState, FC } from 'react';
import * as firebaseauth from '@firebase/auth';
import styles from './styles.component';
import { useNavigate } from 'react-router-dom';

interface ResetPasswordComponentProps {
    auth: firebaseauth.Auth;
  }

// Reset-Password Page Component
const ResetPasswordComponent: FC<ResetPasswordComponentProps> = ({ auth }) => {
const [email, setEmail] = useState<string>('');
const navigate = useNavigate();

// Handle Reset-Password
const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        await firebaseauth.sendPasswordResetEmail(auth, email);
        alert('An email for reset password has been sent to your email. Please check and follow the instructions.')
        navigate('/');
    } catch (error) {
    alert((error as Error).message);
}
};

return (
    <div>
        <form onSubmit={handleResetPassword} style={styles.form}>
            <label style={styles.label}>Enter Email to Reset Password</label>
            <input
            type="email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            />
            <button type="submit" style={styles.button}>Submit</button>
        </form>
    </div>
    );
};

export default ResetPasswordComponent;