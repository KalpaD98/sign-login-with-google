import { Card, Avatar, Button, Descriptions, Space, Typography, Row, Col, Tag, Divider } from 'antd';
import { UserOutlined, LogoutOutlined, MailOutlined, CalendarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const UserProfile = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onLogout();
    navigate('/login');
  };

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 64px)',
      background: '#f0f2f5',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Row gutter={[24, 24]}>
          {/* Left Column - Avatar and Actions */}
          <Col xs={24} md={8}>
            <Card 
              style={{ 
                borderRadius: '12px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Blue accent background */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '120px',
                background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
                zIndex: 0
              }} />
              
              <div style={{ position: 'relative', zIndex: 1, marginTop: '60px' }}>
                {user.profile_picture ? (
                  <Avatar 
                    src={user.profile_picture}
                    size={120}
                    style={{ 
                      border: '4px solid white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      marginBottom: '16px',
                      display: 'inline-block'
                    }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Avatar 
                    size={120}
                    icon={<UserOutlined />}
                    style={{ 
                      border: '4px solid white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      background: '#1677ff',
                      marginBottom: '16px',
                      display: 'inline-block'
                    }}
                  />
                )}
                
                <Title level={3} style={{ marginTop: '16px', marginBottom: '8px' }}>
                  {user.first_name || ''} {user.last_name || ''}
                </Title>
                
                <Space direction="vertical" size="small" style={{ width: '100%', marginBottom: '24px' }}>
                  <Tag color="success" icon={<CheckCircleOutlined />} style={{ fontSize: '12px' }}>
                    Verified Account
                  </Tag>
                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    Member since {new Date(user.created_at).getFullYear()}
                  </Text>
                </Space>

                <Divider />

                <Button 
                  danger
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  block
                  size="large"
                >
                  Logout
                </Button>
              </div>
            </Card>
          </Col>

          {/* Right Column - Profile Details */}
          <Col xs={24} md={16}>
            <Card 
              title={
                <Space>
                  <UserOutlined style={{ color: '#1677ff' }} />
                  <span>Profile Information</span>
                </Space>
              }
              style={{ 
                borderRadius: '12px'
              }}
            >
              <Descriptions 
                bordered 
                column={1}
                labelStyle={{ 
                  fontWeight: '600', 
                  backgroundColor: '#fafafa',
                  width: '180px',
                  color: '#1677ff'
                }}
                contentStyle={{
                  backgroundColor: '#fff'
                }}
              >
                <Descriptions.Item 
                  label={
                    <Space>
                      <MailOutlined />
                      <span>Email Address</span>
                    </Space>
                  }
                >
                  <Space>
                    <Text>{user.email}</Text>
                    <Tag color="success" icon={<CheckCircleOutlined />}>
                      Verified
                    </Tag>
                  </Space>
                </Descriptions.Item>
                
                <Descriptions.Item 
                  label={
                    <Space>
                      <UserOutlined />
                      <span>First Name</span>
                    </Space>
                  }
                >
                  <Text strong>{user.first_name || 'N/A'}</Text>
                </Descriptions.Item>
                
                <Descriptions.Item 
                  label={
                    <Space>
                      <UserOutlined />
                      <span>Last Name</span>
                    </Space>
                  }
                >
                  <Text strong>{user.last_name || 'N/A'}</Text>
                </Descriptions.Item>
                
                <Descriptions.Item 
                  label={
                    <Space>
                      <CalendarOutlined />
                      <span>Member Since</span>
                    </Space>
                  }
                >
                  <Text>
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item 
                  label={
                    <Space>
                      <UserOutlined />
                      <span>User ID</span>
                    </Space>
                  }
                >
                  <Text code>{user.id}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </div>
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
