import { Layout, Row, Col, Card, Button, Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, DesktopOutlined, ProfileOutlined, AppstoreOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import authnService from '@/services/authn.service';
import './AppPanel.less';

const { Content, Footer } = Layout;

const modules = [
  {
    name: '场景地图构建系统',
    description: '',
    english: 'MapForge',
    poem: ['绘制场景地图与更新，提供精准地理信息，支撑智能运营高效展开'],
  },
  {
    name: '多源业务融合系统',
    description: '',
    english: 'FusionHub',
    poem: ['连接多源业务系统，打通数据与指令流，赋能场景智能统一调控'],
  },
  {
    name: '运力资源管理系统',
    description: '',
    english: 'FleetMatrix',
    poem: ['统筹车队编排与调度，保障车辆完好与资源齐备，支撑多元编队灵活运行'],
  },
  {
    name: '场景任务调度系统',
    description: '',
    english: 'MissionFlow',
    poem: ['生成与管理场景任务流，驱动运输执行闭环，承载业务运营成功与价值实现'],
  },
  {
    name: '智能场景仿真系统',
    description: '',
    english: 'SimCraft',
    poem: ['推演场景运行全流程，识别潜在风险隐患，优化部署策略与路径'],
  },
  {
    name: '车辆智能监控系统',
    description: '',
    english: 'SentinelNet',
    poem: ['实时监测车辆与状态，预警潜在异常风险，守护场景智能安全运行'],
  },
];

const links: { [key: string]: string } = {
  MapForge: 'http://localhost:4000/#map=17.00/21.69630/111.84556/338.5',
  FleetMatrix: 'http://localhost:5000',
  FusionHub: 'http://localhost:7002',
};

const AppPanel: React.FC = () => {
  const navigate = useNavigate();
  
  // 检查登录状态
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const ticket = localStorage.getItem('ticket');
      const userInfoStr = localStorage.getItem('userInfo');
      
      // 如果既没有 token 也没有 ticket，或者没有 userInfo，则跳转到登录页
      if ((!token || token.trim() === '') && (!ticket || ticket.trim() === '')) {
        console.log('未检测到登录信息，跳转到登录页');
        navigate('/user/login', { replace: true });
        return;
      }
      
      if (!userInfoStr) {
        console.log('未检测到用户信息，跳转到登录页');
        navigate('/user/login', { replace: true });
        return;
      }
      
      try {
        const userInfo = JSON.parse(userInfoStr);
        if (!userInfo || !userInfo.id) {
          console.log('用户信息无效，跳转到登录页');
          navigate('/user/login', { replace: true });
          return;
        }
      } catch (error) {
        console.error('解析用户信息失败:', error);
        navigate('/user/login', { replace: true });
        return;
      }
    };
    
    checkLoginStatus();
  }, [navigate]);
  
  // 获取用户信息
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  
  // 卡车图片路径
  const truckImg = '/assets/zeron/zeron_truck.png';

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
      window.location.href = '/user/login';
    }
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: '个人信息',
      onClick: () => {
        navigate('/dashboard/config/profile');
      },
    },
    {
      key: 'app-list',
      icon: <AppstoreOutlined />,
      label: '应用列表',
      onClick: () => {
        navigate('/dashboard/home');
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const handleModuleClick = (english: string) => {
    if (english === 'MapForge' && links.MapForge) {
      window.open(links.MapForge, '_blank');
    } else if (english === 'FleetMatrix' && links.FleetMatrix) {
      window.open(links.FleetMatrix, '_blank');
    } else if (english === 'FusionHub' && links.FusionHub) {
      window.open(links.FusionHub, '_blank');
    }
  };

  return (
    <Layout className="app-panel" style={{ minHeight: '100vh', background: '#0d1117' }}>
      {/* 顶部导航栏 */}
      <div className="app-panel-navbar">
        <div className="navbar-left">
          <div className="navbar-logo">
            <span className="logo-zeron">Zeron</span>
            <span className="logo-n">Edge</span>
          </div>
        </div>
        <div className="navbar-right">
          <Button
            type="text"
            icon={<DesktopOutlined />}
            onClick={() => {
              console.log('点击控制台按钮，准备跳转到 /dashboard/home');
              navigate('/dashboard/home');
            }}
            className="nav-button console-button"
            title={userInfo.displayName || userInfo.username || '系统管理员'}
          >
            控制台
          </Button>
          <Dropdown 
            menu={{ items: userMenuItems }} 
            placement="bottomRight" 
            trigger={['click']}
            overlayStyle={{ minWidth: 'auto' }}
            dropdownRender={(menu) => (
              <div className="user-dropdown-menu">
                {menu}
              </div>
            )}
          >
            <div className="user-dropdown" title={userInfo.displayName || userInfo.username || '用户'}>
              <Avatar 
                size={32} 
                icon={<UserOutlined />}
                style={{ backgroundColor: '#3ba0ff', cursor: 'pointer' }}
              />
            </div>
          </Dropdown>
        </div>
      </div>

      <Content
        style={{
          padding: '80px 120px 40px 120px',
          minHeight: 'calc(100vh - 160px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '800px',
            minWidth: '320px',
            marginTop: '20px',
            marginLeft: 0,
          }}
        >
          <h1
            style={{
              color: '#3ba0ff',
              fontSize: '45px',
              marginBottom: '16px',
              fontWeight: '500',
            }}
          >
            零一无人货运智能运营平台 ZeronEdge
          </h1>
          <p
            style={{
              color: '#cbd5e1',
              fontSize: '16px',
              marginBottom: '100px',
            }}
          >
            为智慧场景而生，以构建、调度、仿真与守护，成就自主智能运营
          </p>
          <Row gutter={[40, 40]} justify="start">
            {modules.map((mod, index) => (
              <Col xs={24} sm={12} md={12} lg={12} xl={12} key={index}>
                <Card
                  hoverable
                  style={{
                    width: '100%',
                    minWidth: '280px',
                    height: '140px',
                    background: 'rgba(30, 41, 59, 0.8)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'white',
                    textAlign: 'left',
                    borderRadius: '12px',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2), 0 0 12px rgba(59, 160, 255, 0.1)',
                    transition: 'all 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                  }}
                  bodyStyle={{ padding: '20px 24px' }}
                  onClick={() => handleModuleClick(mod.english)}
                >
                  <div
                    style={{
                      fontSize: '18px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ color: '#3ba0ff', fontWeight: '500' }}>{mod.name}</span>
                    <span style={{ fontSize: '14px', color: '#94a3b8' }}>{mod.english}</span>
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '12px' }}>
                    {mod.description}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.6' }}>
                    {mod.poem[0]}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Truck background on the right */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '50vw',
            minWidth: '400px',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            pointerEvents: 'none',
          }}
        >
          <img
            src={truckImg}
            alt="Zeron Truck"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '90vh',
              opacity: 0.9,
              filter: 'drop-shadow(0 8px 32px rgba(24,144,255,0.18))',
              objectFit: 'contain',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
            onError={(e) => {
              console.error('卡车图片加载失败');
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      </Content>

      <Footer
        style={{
          textAlign: 'center',
          color: '#7c8ea0',
          background: 'transparent',
          marginTop: '16px',
          padding: '12px 0 8px 0',
        }}
      >
        江苏零一汽车有限公司 ©2025
      </Footer>
    </Layout>
  );
};

export default AppPanel;
