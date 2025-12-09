import { GoogleLogin } from '@react-oauth/google';
import { Card, message } from 'antd';
import { authenticateWithGoogle } from '../services/authService';

const Login = ({ onLoginSuccess }) => {
  const handleSuccess = async (credentialResponse) => {
    try {
      message.loading({ content: 'Authenticating...', key: 'auth' });
      const data = await authenticateWithGoogle(credentialResponse.credential);
      message.success({ content: 'Login successful!', key: 'auth', duration: 2 });
      onLoginSuccess(data.user);
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
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
            theme="filled_blue"
            size="large"
            text="continue_with"
          />
        </div>
      </Card>
    </div>
  );
};

export default Login;
