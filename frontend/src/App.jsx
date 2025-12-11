import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { message, Alert, Layout, ConfigProvider, App as AntApp } from 'antd';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import Home from './components/Home';
import Navbar from './components/Navbar';
import { getStoredUser } from './services/authService';

const { Content } = Layout;

// Ant Design blue theme configuration
const theme = {
  token: {
    colorPrimary: '#1677ff',
    colorInfo: '#1677ff',
    borderRadius: 8,
    wireframe: false,
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
    },
    Menu: {
      borderRadius: 8,
    },
  },
};

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

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Public Route Component (redirect to home if already logged in)
  const PublicRoute = ({ children }) => {
    if (user) {
      return <Navigate to="/home" replace />;
    }
    return children;
  };

  const rootRedirect = '/login';

  return (
    <ConfigProvider theme={theme}>
      <AntApp>
        <Router>
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
                zIndex: 2000,
                borderRadius: 0
              }}
            />
          )}
          
          <GoogleOAuthProvider clientId={googleClientId || 'dummy-client-id'}>
            <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
              <Navbar user={user} onLogout={handleLogout} />
              <Content style={{ background: '#f0f2f5' }}>
                <Routes>
                  {/* Root - redirect to appropriate page */}
                  <Route path="/" element={<Navigate to={rootRedirect} replace />} />
                  
                  {/* Login Page - redirect to home if already logged in */}
                  <Route 
                    path="/login" 
                    element={
                      <PublicRoute>
                        <Login 
                          onLoginSuccess={handleLoginSuccess} 
                          hasConfigError={hasConfigError} 
                        />
                      </PublicRoute>
                    } 
                  />
                  
                  {/* Protected Routes - require authentication */}
                  <Route 
                    path="/home" 
                    element={
                      <ProtectedRoute>
                        <Home user={user} />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <UserProfile user={user} onLogout={handleLogout} />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Catch all - redirect to root */}
                  <Route path="*" element={<Navigate to={rootRedirect} replace />} />
                </Routes>
              </Content>
            </Layout>
          </GoogleOAuthProvider>
        </Router>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
