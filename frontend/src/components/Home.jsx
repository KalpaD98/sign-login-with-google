import { Card, Typography, Space, Row, Col, Statistic, Button } from 'antd';
import { UserOutlined, SafetyOutlined, ClockCircleOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const { Title, Paragraph } = Typography;

const Home = ({ user }) => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Active Users',
      value: 1234,
      icon: <UserOutlined style={{ color: '#667eea' }} />,
    },
    {
      title: 'Security Level',
      value: 100,
      suffix: '%',
      icon: <SafetyOutlined style={{ color: '#52c41a' }} />,
    },
    {
      title: 'Uptime',
      value: 99.9,
      suffix: '%',
      icon: <ClockCircleOutlined style={{ color: '#1890ff' }} />,
    },
    {
      title: 'Features',
      value: 50,
      prefix: '+',
      icon: <RocketOutlined style={{ color: '#fa8c16' }} />,
    },
  ];

  const quickActions = [
    {
      title: 'View Profile',
      description: 'Check and update your profile information',
      action: () => navigate('/profile'),
      color: '#667eea'
    },
    {
      title: 'Settings',
      description: 'Manage your account preferences',
      action: () => alert('Settings page coming soon!'),
      color: '#52c41a'
    },
    {
      title: 'Help Center',
      description: 'Get support and find answers',
      action: () => alert('Help center coming soon!'),
      color: '#1890ff'
    },
  ];

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 64px)',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Welcome Section */}
        <Card 
          style={{ 
            marginBottom: '32px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none'
          }}
        >
          <Space direction="vertical" size="small">
            <Title 
              level={2} 
              style={{ 
                color: 'white', 
                margin: 0,
                fontSize: '32px'
              }}
            >
              Welcome back, {user?.first_name || 'User'}! 👋
            </Title>
            <Paragraph style={{ color: 'white', margin: 0, fontSize: '16px' }}>
              Here's what's happening with your account today.
            </Paragraph>
          </Space>
        </Card>

        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card 
                hoverable
                style={{ 
                  borderRadius: '12px',
                  height: '100%'
                }}
              >
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  valueStyle={{ color: stat.icon.props.style.color }}
                  prefix={stat.icon}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Quick Actions */}
        <Title level={3} style={{ marginBottom: '24px', color: '#333' }}>
          Quick Actions
        </Title>
        <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
          {quickActions.map((action, index) => (
            <Col xs={24} md={8} key={index}>
              <Card
                hoverable
                style={{
                  borderRadius: '12px',
                  height: '100%',
                  borderLeft: `4px solid ${action.color}`
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Title level={4} style={{ margin: 0, color: action.color }}>
                    {action.title}
                  </Title>
                  <Paragraph style={{ margin: 0, color: '#666' }}>
                    {action.description}
                  </Paragraph>
                  <Button 
                    type="primary" 
                    onClick={action.action}
                    style={{ 
                      background: action.color,
                      borderColor: action.color 
                    }}
                  >
                    Go
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Recent Activity */}
        <Card 
          title="Recent Activity" 
          style={{ 
            borderRadius: '12px',
            marginBottom: '32px'
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
              <Paragraph style={{ margin: 0, color: '#666' }}>
                <strong>Account Created:</strong> {new Date(user?.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Paragraph>
            </div>
            <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
              <Paragraph style={{ margin: 0, color: '#666' }}>
                <strong>Last Login:</strong> Today
              </Paragraph>
            </div>
            <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
              <Paragraph style={{ margin: 0, color: '#666' }}>
                <strong>Email Verified:</strong> ✓ {user?.email}
              </Paragraph>
            </div>
          </Space>
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

