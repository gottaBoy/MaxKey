import React, { useState } from 'react';
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
import { Layout, Menu, Dropdown, Avatar, Space } from 'antd';
import type { MenuProps } from 'antd';
import authnService from '@/services/authn.service';
import './BasicLayout.less';

const { Header, Sider, Content } = Layout;

const BasicLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 获取用户信息
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

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
    // {
    //   key: '/authz/mgt',
    //   icon: <ClusterOutlined />,
    //   label: '后台',
    // },
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

