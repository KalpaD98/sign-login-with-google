import { Card, Typography, Space } from 'antd';
import PropTypes from 'prop-types';

const { Title, Paragraph } = Typography;

const Home = ({ user }) => {

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
          <Space orientation="vertical" size="small">
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

        {/* Recent Activity */}
        <Card 
          title="Recent Activity" 
          style={{ 
            borderRadius: '12px',
            marginBottom: '32px'
          }}
        >
          <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
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
