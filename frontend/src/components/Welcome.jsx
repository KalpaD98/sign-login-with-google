import { Button, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const { Title, Paragraph } = Typography;

const Welcome = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      icon: <GoogleOutlined style={{ fontSize: '48px', color: '#667eea' }} />,
      title: 'Google Sign-In',
      description: 'Seamlessly authenticate with your Google account for quick and secure access.'
    },
    {
      icon: <SafetyOutlined style={{ fontSize: '48px', color: '#667eea' }} />,
      title: 'Secure Authentication',
      description: 'Your data is protected with industry-standard security protocols and encryption.'
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: '48px', color: '#667eea' }} />,
      title: 'Fast & Reliable',
      description: 'Built with modern technologies for optimal performance and user experience.'
    },
    {
      icon: <GlobalOutlined style={{ fontSize: '48px', color: '#667eea' }} />,
      title: 'Universal Access',
      description: 'Access your profile from anywhere, anytime, on any device.'
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {/* Hero Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <Space orientation="vertical" size="large" style={{ maxWidth: '800px' }}>
          <Title 
            level={1} 
            style={{ 
              color: 'white', 
              fontSize: '56px',
              marginBottom: '0',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            Welcome to Our Platform
          </Title>
          
          <Paragraph 
            style={{ 
              color: 'white', 
              fontSize: '20px',
              marginBottom: '32px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
            }}
          >
            Experience seamless authentication with Google Sign-In. 
            Secure, fast, and user-friendly access to your personalized dashboard.
          </Paragraph>

          <Button 
            type="primary" 
            size="large"
            onClick={handleGetStarted}
            style={{
              height: '56px',
              fontSize: '18px',
              padding: '0 48px',
              background: 'white',
              color: '#667eea',
              border: 'none',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
          >
            Get Started
          </Button>
        </Space>
      </div>
    </div>
  );
};

Welcome.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default Welcome;

