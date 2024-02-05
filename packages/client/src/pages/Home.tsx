import { keyframes } from 'styled-components';
import styled from 'styled-components';
import { useAuth } from '../context/Auth.context';
import { useTranslation } from 'react-i18next';

export const HomePage: React.FC = () => {
  const { token, authenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <div>
      <AnimatedGradientText>{t('home.welcome')}</AnimatedGradientText>
      {authenticated && token ? <p>{t('home.signedIn')}</p> : <p>{t('home.logIn')}</p>}
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
