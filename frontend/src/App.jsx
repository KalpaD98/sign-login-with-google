import { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { message, Alert } from 'antd';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import { getStoredUser } from './services/authService';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }

    // Listen for automatic logout events (e.g., token expiration)
    const handleAuthLogout = (event) => {
      setUser(null);
      if (event.detail?.reason === 'token_expired') {
        message.warning('Your session has expired. Please log in again.');
      }
    };

    window.addEventListener('auth:logout', handleAuthLogout);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const hasConfigError = !googleClientId;

  const appContent = user ? (
    <UserProfile user={user} onLogout={handleLogout} />
  ) : (
    <Login onLoginSuccess={handleLoginSuccess} hasConfigError={hasConfigError} />
  );

  return (
    <>
      {hasConfigError && (
        <Alert
          message="Configuration Error"
          description="Please set VITE_GOOGLE_CLIENT_ID in your .env file"
          type="error"
          showIcon
          closable
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            borderRadius: 0
          }}
        />
      )}
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          {appContent}
        </GoogleOAuthProvider>
      ) : (
        <div style={{ paddingTop: hasConfigError ? '48px' : '0' }}>
          {appContent}
        </div>
      )}
    </>
  );
}

export default App;
