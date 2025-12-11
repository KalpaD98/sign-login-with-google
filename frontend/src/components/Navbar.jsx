import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd';
import { HomeOutlined, UserOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
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
  ] : [];

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
        background: '#1677ff',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}
    >
      {/* Logo/Brand */}
      <div 
        style={{ 
          color: 'white', 
          fontSize: 'clamp(16px, 2.5vw, 20px)', 
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          letterSpacing: '-0.5px'
        }}
        onClick={() => navigate(user ? '/home' : '/login')}
      >
        <Avatar 
          size={32}
          style={{ 
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.3)',
            flexShrink: 0
          }}
        >
          <UserOutlined />
        </Avatar>
        <span style={{ whiteSpace: 'nowrap' }}>Sign With Google</span>
      </div>

      {/* Navigation Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2vw, 24px)', flexWrap: 'wrap' }}>
        {user && (
          <Menu
            mode="horizontal"
            selectedKeys={[getSelectedKey()]}
            items={menuItems}
            style={{
              background: 'transparent',
              border: 'none',
              minWidth: '200px',
              color: 'white',
              flex: '1 1 auto'
            }}
            theme="dark"
          />
        )}

        {/* User Section */}
        {user ? (
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
          >
            <Space 
              style={{ 
                cursor: 'pointer', 
                padding: '4px 8px', 
                borderRadius: '8px', 
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {user.profile_picture ? (
                <Avatar 
                  src={user.profile_picture}
                  size={32}
                  style={{ 
                    border: '2px solid rgba(255,255,255,0.3)',
                    display: 'block'
                  }}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Avatar 
                  icon={<UserOutlined />}
                  size={32}
                  style={{ 
                    border: '2px solid rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.2)'
                  }}
                />
              )}
              <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>
                {user.first_name || 'User'}
              </span>
            </Space>
          </Dropdown>
        ) : (
          <Button 
            type="primary"
            icon={<LoginOutlined />}
            onClick={() => navigate('/login')}
            ghost
            style={{
              height: '40px',
              padding: '0 20px',
              fontWeight: '500'
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

