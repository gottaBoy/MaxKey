import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ClusterOutlined,
  HistoryOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Avatar, Space, Button } from 'antd';
import type { MenuProps } from 'antd';
import authnService from '@/services/authn.service';
import usersService from '@/services/users.service';
import './BasicLayout.less';

const { Header, Sider, Content } = Layout;

const BasicLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 获取用户信息
  const [userInfo, setUserInfo] = useState<any>(JSON.parse(localStorage.getItem('userInfo') || '{}'));

  // 判断是否显示后台管理按钮：平台超管(admin/PLATFORM_ADMIN) 或 租户超管(TANANT_ADMIN)
  const showConsoleJump = React.useMemo(() => {
    if (!userInfo) return false;
    const { username, userType } = userInfo;
    return (
      username === 'admin' || 
      userType === 'PLATFORM_ADMIN' || 
      userType === 'TANANT_ADMIN' ||
      userType === 'TENANT_ADMIN' // 兼容可能的拼写修正
    );
  }, [userInfo]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserInfo = localStorage.getItem('userInfo');

    if (token && (!storedUserInfo || storedUserInfo === '{}')) {
      usersService.getProfile().then(user => {
        console.log('BasicLayout: 用户信息获取成功', user);
        localStorage.setItem('userInfo', JSON.stringify(user));
        setUserInfo(user);
      }).catch(err => {
        console.error('BasicLayout: 获取用户信息失败', err);
        // 如果获取失败，可能是 token 失效，但交给 request 拦截器处理跳转
      });
    } else if (storedUserInfo && storedUserInfo !== '{}') {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, [location.pathname]);

  const menuItems: MenuProps['items'] = [
    {
      key: '/app-panel',
      icon: <AppstoreOutlined />,
      label: '应用面板',
      onClick: () => {
        window.location.href = '/app-panel';
      },
    },
    {
      key: '/dashboard/home',
      icon: <UnorderedListOutlined />,
      label: '应用列表',
    },
          {
            key: '/dashboard/sessions',
            icon: <ClusterOutlined />,
            label: '会话',
          },
    {
      key: '/dashboard/config',
      icon: <SettingOutlined />,
      label: '设置',
      children: [
        {
          key: '/dashboard/config/profile',
          label: '我的资料',
        },
        {
          key: '/dashboard/config/passkey',
          label: 'Passkey 注册',
        },
        {
          key: '/dashboard/config/mfa',
          label: '二次认证',
        },
        {
          key: '/dashboard/config/password',
          label: '密码修改',
        },
        {
          key: '/dashboard/config/socialsassociate',
          label: '社交关联',
        },
        {
          key: '/dashboard/config/timebased',
          label: '时间令牌',
        },
      ],
    },
    {
      key: '/dashboard/audit',
      icon: <HistoryOutlined />,
      label: '审计',
      children: [
        {
          key: '/dashboard/audit/audit-logins',
          label: '登录日志',
        },
        {
          key: '/dashboard/audit/audit-login-apps',
          label: '应用登录日志',
        },
      ],
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === '/authz/mgt') {
      // 后台管理是外部链接
      window.open('/authz/mgt', '_blank');
    } else if (key === '/app-panel') {
      // 应用面板是独立页面，使用 window.location.href 跳转
      window.location.href = '/app-panel';
    } else {
      navigate(key);
    }
  };

  const handleLogout = async () => {
    try {
      await authnService.logout();
    } catch (error) {
      console.error('退出登录失败:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('ticket');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('authData');
      navigate('/user/login');
    }
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="basic-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} width={200}>
        <div className="logo">
          {!collapsed ? (
            <div className="logo-text">
              <span style={{ color: '#FFD700' }}>Zeron</span>
              <span style={{ color: '#FFD700' }}>Edge</span>
            </div>
          ) : (
            <div className="logo-icon">Z</div>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header className="header">
          <div className="header-left">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
          </div>
          <div className="header-right">
            {showConsoleJump && (
              <Button
                type="primary"
                ghost
                icon={<ClusterOutlined />}
                style={{ marginRight: 16 }}
                onClick={() => {
                  const token = localStorage.getItem('token');
                  if (token) {
                    window.open(`http://localhost:8528?token=${encodeURIComponent(token)}`, '_blank');
                  } else {
                    window.open('http://localhost:8528', '_blank');
                  }
                }}
              >
                后台管理
              </Button>
            )}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space className="user-info" style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>{userInfo.displayName || userInfo.username || '用户'}</span>
              </Space>
            </Dropdown>
          </div>
        </Header>
        <Content className="content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;

