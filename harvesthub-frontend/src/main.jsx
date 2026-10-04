import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import App from './App.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

import './index.css';
import './styles/glass.css';
import './styles/animations.css';

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </ToastProvider>
      </AuthProvider>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '14px',
            background: '#0B3D2E',
            color: '#fff'
          }
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);