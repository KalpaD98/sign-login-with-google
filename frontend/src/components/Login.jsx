import { GoogleLogin } from '@react-oauth/google';
import { Card, message, Alert, Row, Col, Typography, Space } from 'antd';
import { CheckCircleOutlined, SafetyOutlined, RocketOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { authenticateWithGoogle } from '../services/authService';

const { Title, Paragraph, Text } = Typography;

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
      minHeight: '100vh',
      background: '#f0f2f5',
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Row gutter={[48, 48]} style={{ width: '100%', maxWidth: '1200px' }}>
        {/* Left Side - Benefits/Info */}
        <Col xs={24} lg={12} style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            <Title level={1} style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: '16px', color: '#1677ff' }}>
              Welcome Back
            </Title>
            <Paragraph style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: '#666', marginBottom: '32px' }}>
              Sign in securely with your Google account to access your dashboard
            </Paragraph>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Space>
                <CheckCircleOutlined style={{ color: '#1677ff', fontSize: '20px' }} />
                <Text strong>Quick and secure authentication</Text>
              </Space>
              <Space>
                <SafetyOutlined style={{ color: '#1677ff', fontSize: '20px' }} />
                <Text strong>Your data is protected</Text>
              </Space>
              <Space>
                <RocketOutlined style={{ color: '#1677ff', fontSize: '20px' }} />
                <Text strong>Get started in seconds</Text>
              </Space>
            </Space>
          </div>
        </Col>

        {/* Right Side - Login Card */}
        <Col xs={24} lg={12}>
          <Card 
            style={{ 
              maxWidth: '400px',
              margin: '0 auto',
              textAlign: 'center',
              borderTop: '4px solid #1677ff'
            }}
          >
            <div style={{ marginBottom: '32px' }}>
              <Title level={2} style={{ marginBottom: '8px', color: '#1677ff' }}>
                Sign In
              </Title>
              <Paragraph style={{ color: '#666', fontSize: '16px', margin: 0 }}>
                Use your Google account to continue
              </Paragraph>
            </div>
            
            {hasConfigError ? (
              <Alert
                message="Google Sign-In Unavailable"
                description="Please configure VITE_GOOGLE_CLIENT_ID in your .env file to enable Google Sign-In."
                type="warning"
                showIcon
                style={{ marginTop: '16px', textAlign: 'left' }}
              />
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
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
            
            <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '24px', marginBottom: 0 }}>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Paragraph>
          </Card>
        </Col>
      </Row>
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
