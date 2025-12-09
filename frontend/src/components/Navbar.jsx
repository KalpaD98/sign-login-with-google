import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd';
import { HomeOutlined, UserOutlined, LogoutOutlined, LoginOutlined, WelcomeOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { logout } from '../services/authService';

const { Header } = Layout;

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    onLogout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: handleLogout,
    },
  ];

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/') return 'welcome';
    if (path === '/home') return 'home';
    if (path === '/profile') return 'profile';
    return '';
  };

  const menuItems = user ? [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Home',
      onClick: () => navigate('/home'),
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
  ] : [
    {
      key: 'welcome',
      icon: <WelcomeOutlined />,
      label: 'Welcome',
      onClick: () => navigate('/'),
    },
  ];

  return (
    <Header 
      style={{ 
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}
    >
      {/* Logo/Brand */}
      <div 
        style={{ 
          color: 'white', 
          fontSize: '24px', 
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onClick={() => navigate(user ? '/home' : '/')}
      >
        <span style={{ fontSize: '28px' }}>🚀</span>
        <span>MyApp</span>
      </div>

      {/* Navigation Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Menu
          mode="horizontal"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          style={{
            background: 'transparent',
            border: 'none',
            minWidth: '200px',
          }}
          theme="dark"
        />

        {/* User Section */}
        {user ? (
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Space style={{ cursor: 'pointer' }}>
              <Avatar 
                src={user.profile_picture}
                icon={!user.profile_picture && <UserOutlined />}
                style={{ border: '2px solid white' }}
              />
              <span style={{ color: 'white', fontWeight: '500' }}>
                {user.first_name || 'User'}
              </span>
            </Space>
          </Dropdown>
        ) : (
          <Button 
            type="primary"
            icon={<LoginOutlined />}
            onClick={() => navigate('/login')}
            style={{
              background: 'white',
              color: '#667eea',
              border: 'none',
              fontWeight: 'bold',
              height: '40px',
              padding: '0 24px'
            }}
          >
            Login
          </Button>
        )}
      </div>
    </Header>
  );
};

Navbar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    profile_picture: PropTypes.string,
    created_at: PropTypes.string.isRequired,
  }),
  onLogout: PropTypes.func.isRequired,
};

Navbar.defaultProps = {
  user: null,
};

export default Navbar;

