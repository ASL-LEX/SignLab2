import * as ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { StrictMode } from 'react';
import './i18n';
import * as React from 'react';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <React.Suspense>
      <App />
    </React.Suspense>
  </StrictMode>
);
