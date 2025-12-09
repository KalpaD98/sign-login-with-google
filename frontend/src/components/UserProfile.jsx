import { Card, Avatar, Button, Descriptions, Space, Typography } from 'antd';
import { UserOutlined, LogoutOutlined, MailOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { logout } from '../services/authService';

const { Title } = Typography;

const UserProfile = ({ user, onLogout }) => {
  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%',
          maxWidth: 600,
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          borderRadius: '12px'
        }}
      >
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ color: '#667eea', marginBottom: '24px' }}>
              User Profile
            </Title>
            
            {user.profile_picture ? (
              <img 
                src={user.profile_picture}
                referrerPolicy="no-referrer"
                alt="profile"
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  border: '4px solid #667eea',
                  marginBottom: '24px',
                  display: 'inline-block'
                }}
              />
            ) : (
              <Avatar 
                size={120} 
                icon={<UserOutlined />}
                style={{ 
                  marginBottom: '24px',
                  border: '4px solid #667eea'
                }}
              />
            )}
          </div>

          <Descriptions 
            bordered 
            column={1}
            labelStyle={{ 
              fontWeight: 'bold', 
              backgroundColor: '#f5f5f5',
              width: '150px'
            }}
          >
            <Descriptions.Item 
              label={<><MailOutlined /> Email</>}
            >
              {user.email}
            </Descriptions.Item>
            <Descriptions.Item 
              label={<><UserOutlined /> First Name</>}
            >
              {user.first_name || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item 
              label={<><UserOutlined /> Last Name</>}
            >
              {user.last_name || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item 
              label="Member Since"
            >
              {new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Descriptions.Item>
          </Descriptions>

          <Button 
            type="primary" 
            danger 
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            size="large"
            block
            style={{ marginTop: '16px' }}
          >
            Logout
          </Button>
        </Space>
      </Card>
    </div>
  );
};

UserProfile.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    profile_picture: PropTypes.string,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default UserProfile;
