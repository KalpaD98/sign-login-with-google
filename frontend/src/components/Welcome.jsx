import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Welcome = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 20px',
      }}
    >
      <Title level={1}>Welcome</Title>
      <Paragraph style={{ fontSize: '18px', maxWidth: '600px' }}>
        Welcome to our platform. Sign in with Google to get started.
      </Paragraph>
      <Button type="primary" size="large" onClick={handleSignIn}>
        Sign in
      </Button>
    </div>
  );
};

export default Welcome;

