import { GoogleLogin } from '@react-oauth/google';
import { Card, message, Alert } from 'antd';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { authenticateWithGoogle } from '../services/authService';

const Login = ({ onLoginSuccess, hasConfigError }) => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      message.loading({ content: 'Authenticating...', key: 'auth' });
      const data = await authenticateWithGoogle(credentialResponse.credential);
      message.success({ content: 'Login successful!', key: 'auth', duration: 2 });
      onLoginSuccess(data.user);
      navigate('/home');
    } catch (error) {
      message.error({ 
        content: `Login failed: ${error.response?.data?.detail || error.message}`, 
        key: 'auth', 
        duration: 3 
      });
    }
  };

  const handleError = () => {
    message.error('Login failed. Please try again.');
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card 
        style={{ 
          width: 400, 
          textAlign: 'center',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          borderRadius: '12px'
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#667eea',
            marginBottom: '8px'
          }}>
            Welcome
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Sign in with your Google account
          </p>
        </div>
        
        {hasConfigError ? (
          <Alert
            message="Google Sign-In Unavailable"
            description="Please configure VITE_GOOGLE_CLIENT_ID in your .env file to enable Google Sign-In."
            type="warning"
            showIcon
            style={{ marginTop: '16px' }}
          />
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap
              theme="filled_blue"
              size="large"
              text="signin_with"
            />
          </div>
        )}
      </Card>
    </div>
  );
};

Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
  hasConfigError: PropTypes.bool,
};

Login.defaultProps = {
  hasConfigError: false,
};

export default Login;
