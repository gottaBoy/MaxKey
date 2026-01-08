import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  SafetyOutlined,
  AuditOutlined,
  SettingOutlined,
  LogoutOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Avatar, Space } from 'antd';
import type { MenuProps } from 'antd';
import ThemeDensitySelector from '../components/ThemeDensitySelector';
import './BasicLayout.less';

const { Header, Sider, Content } = Layout;

const BasicLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表板',
    },
    {
      key: '/idm',
      icon: <UserOutlined />,
      label: '身份管理',
      children: [
        {
          key: '/idm/users',
          label: '用户管理',
        },
        {
          key: '/idm/organizations',
          label: '组织管理',
        },
        {
          key: '/idm/groups',
          label: '用户组',
        },
        {
          key: '/idm/groupmembers',
          label: '组成员管理',
        },
      ],
    },
    {
      key: '/apps',
      icon: <AppstoreOutlined />,
      label: '应用管理',
    },
    {
      key: '/permissions/apps',
      icon: <SafetyOutlined />,
      label: '权限管理',
    },
    {
      key: '/access',
      icon: <SafetyOutlined />,
      label: '访问控制',
      children: [
        {
          key: '/access/permissions',
          label: '访问控制',
        },
        {
          key: '/access/sessions',
          icon: <EyeOutlined />,
          label: '会话管理',
        },
      ],
    },
    {
      key: '/audit',
      icon: <AuditOutlined />,
      label: '日志审计',
      children: [
        {
          key: '/audit/login-history',
          label: '登录日志',
        },
        {
          key: '/audit/access-log',
          label: '访问日志',
        },
        {
          key: '/audit/synchronizer-log',
          label: '同步器日志',
        },
        {
          key: '/audit/connector-log',
          label: '连接器日志',
        },
        {
          key: '/audit/system-log',
          label: '系统日志',
        },
      ],
    },
    {
      key: '/config',
      icon: <SettingOutlined />,
      label: '配置管理',
      children: [
        {
          key: '/config/institutions',
          label: '机构配置',
        },
        {
          key: '/accounts',
          label: '账号管理',
        },
        {
          key: '/config/synchronizers',
          label: '同步器管理',
        },
        {
          key: '/config/connectors',
          label: '连接器管理',
        },
        {
          key: '/config/socialsproviders',
          label: '社交登录',
        },
        {
          key: '/config/ldapcontext',
          label: 'LDAP配置',
        },
        {
          key: '/config/emailsender',
          label: '电子邮箱',
        },
        {
          key: '/config/smsprovider',
          label: '短信服务',
        },
        {
          key: '/config/passwordpolicy',
          label: '密码策略',
        },
      ],
    },
  ];

  // 根据当前路径自动打开对应的父菜单
  useEffect(() => {
    const pathname = location.pathname;
    
    const findOpenKeys = (items: MenuProps['items']): string[] => {
      if (!items) return [];
      for (const item of items) {
        const itemKey = item?.key as string;
        // 如果当前项有子菜单
        if ((item as any).children) {
          // 检查子菜单是否包含当前路径
          const hasMatch = (item as any).children.some((child: any) => 
            child.key === pathname || pathname.startsWith(child.key + '/')
          );
          
          if (hasMatch) {
            return [itemKey];
          }
          
          // 递归查找深层
          const found = findOpenKeys((item as any).children);
          if (found.length > 0) {
            return [itemKey, ...found];
          }
        }
      }
      return [];
    };
    
    // 如果找到了对应的父菜单，则设置打开
    const newOpenKeys = findOpenKeys(menuItems);
    if (newOpenKeys.length > 0) {
      setOpenKeys(newOpenKeys);
    }
  }, [location.pathname]);

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: '个人中心',
    },
    {
      key: 'settings',
      label: '账户设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    // 如果点击的是有子菜单的父菜单项，不进行导航（让子菜单展开/收起）
    const menuItem = findMenuItemByKey(menuItems, key);
    if (menuItem && menuItem.children && menuItem.children.length > 0) {
      return;
    }
    navigate(key);
  };

  // 辅助函数：根据 key 查找菜单项
  const findMenuItemByKey = (items: MenuProps['items'], targetKey: string): any => {
    if (!items) return null;
    for (const item of items) {
      if (item?.key === targetKey) {
        return item;
      }
      if (item?.children) {
        const found = findMenuItemByKey(item.children, targetKey);
        if (found) return found;
      }
    }
    return null;
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      // 清除 token
      localStorage.removeItem('token');
      navigate('/user/login');
    } else {
      navigate(`/account/${key}`);
    }
  };

  return (
    <Layout className="basic-layout">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <img
            src="/logo.svg"
            alt="ZERON SSO"
            style={{ height: collapsed ? 32 : 40 }}
          />
          {!collapsed && <span className="logo-text">ZERON SSO</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header className="layout-header">
          <div className="header-left">
            {collapsed ? (
              <MenuUnfoldOutlined
                className="trigger"
                onClick={() => setCollapsed(!collapsed)}
              />
            ) : (
              <MenuFoldOutlined
                className="trigger"
                onClick={() => setCollapsed(!collapsed)}
              />
            )}
          </div>
          <div className="header-right">
            <Space size="middle">
              <ThemeDensitySelector />
              <Dropdown
                menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
                placement="bottomRight"
              >
                <Space className="user-info">
                  <Avatar icon={<UserOutlined />} />
                  <span>管理员</span>
                </Space>
              </Dropdown>
            </Space>
          </div>
        </Header>
        <Content className="layout-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
