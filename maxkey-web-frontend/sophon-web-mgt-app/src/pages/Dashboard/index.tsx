import { GridContent } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import Overview from './components/Overview';
import DailyVisitStats from './components/DailyVisitStats';
import MonthlyActiveUsers from './components/MonthlyActiveUsers';
import VisitZoneMap from './components/VisitZoneMap';
import TopApps from './components/TopApps';
import TopBrowsers from './components/TopBrowsers';

const Dashboard = () => {
  return (
    <GridContent style={{ height: '100%' }}>
      {/* 顶部概览统计卡片 - 一行4列 */}
      <Overview />
      
      {/* 当日访问统计 - 单独一行 */}
      <Row gutter={[24, 24]}>
        <Col span={24} style={{ marginBottom: 24 }}>
          <DailyVisitStats />
        </Col>
      </Row>

      {/* 30日访问统计 - 单独一行 */}
      <Row gutter={[24, 24]}>
        <Col span={24} style={{ marginBottom: 24 }}>
          <MonthlyActiveUsers />
        </Col>
      </Row>

      {/* 30日TOP10访问统计 - 地图 - 单独一行 */}
      <Row gutter={[24, 24]}>
        <Col span={24} style={{ marginBottom: 24 }}>
          <VisitZoneMap />
        </Col>
      </Row>

      {/* 30日TOP10应用访问统计 和 浏览器访问统计 - 一行两列 */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ marginBottom: 24 }}>
          <TopApps />
        </Col>
        
        <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ marginBottom: 24 }}>
          <TopBrowsers />
        </Col>
      </Row>
    </GridContent>
  );
};

export default Dashboard;
