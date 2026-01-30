import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.jsx';
import './i18n'; // Import i18n configuration

import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import { NotificationProvider } from './contexts/NotificationContext'

// Disable console logs in production for security
if (import.meta.env.PROD) {
  console.log = () => { };
  console.info = () => { };
  console.warn = () => { };
  // Keep console.error for critical crash reporting
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <DataProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </DataProvider>
    </AuthProvider>
  </StrictMode>,
)
