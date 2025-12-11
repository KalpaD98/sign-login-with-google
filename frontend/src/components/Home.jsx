import { Card, Typography, Row, Col, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Title, Paragraph } = Typography;

const Home = ({ user }) => {
  return (
    <div style={{ 
      minHeight: 'calc(100vh - 64px)',
      background: '#f0f2f5',
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <Card 
          style={{ 
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
            textAlign: 'center'
          }}
          bodyStyle={{ padding: '60px 40px' }}
        >
          <Row justify="center" style={{ marginBottom: '32px' }}>
            {user?.profile_picture ? (
              <Avatar 
                src={user.profile_picture}
                size={120}
                style={{ 
                  border: '4px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
                referrerPolicy="no-referrer"
              />
            ) : (
              <Avatar 
                icon={<UserOutlined />}
                size={120}
                style={{ 
                  border: '4px solid rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.2)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              />
            )}
          </Row>
          
          <Title 
            level={1} 
            style={{ 
              color: 'white', 
              margin: 0,
              fontSize: 'clamp(32px, 5vw, 48px)',
              marginBottom: '16px'
            }}
          >
            Welcome, {user?.first_name || 'User'}! 👋
          </Title>
          
          <Paragraph style={{ 
            color: 'rgba(255,255,255,0.9)', 
            margin: 0, 
            fontSize: 'clamp(16px, 2vw, 20px)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            You've successfully signed in with your Google account. 
            Use the navigation menu to access your profile and other features.
          </Paragraph>
        </Card>
      </div>
    </div>
  );
};

Home.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    profile_picture: PropTypes.string,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
};

export default Home;
