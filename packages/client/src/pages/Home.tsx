import { keyframes } from 'styled-components';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { token, initialized } = useAuth();

  return (
    <div>
      <AnimatedGradientText>Welcome to SignLab</AnimatedGradientText>
      {initialized && token ? <p>You are signed in</p> : <p>Please login to continue</p>}
    </div>
  );
};

const gradient = keyframes`
{
0% {
  background-position: 0 40%;
}
50% {
  background-position: 100% 50%;
}
100% {
  background-position: 0 50%;
}}
`;
const AnimatedGradientText = styled.h1`
  animation: ${gradient} 5s ease-in-out infinite;
  background: linear-gradient(to right, #ee9ca7, #e5d7f9, #d2fffe, #74efc8);
  background-size: 300%;
  background-clip: text;
  !-webkit-text-fill-color: transparent;
  color: #e2b1f2;
`;
