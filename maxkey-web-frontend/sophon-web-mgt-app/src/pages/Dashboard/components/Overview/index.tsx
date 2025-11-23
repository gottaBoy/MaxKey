import { useState, useEffect } from 'react';
import { Col, Row, Skeleton } from 'antd';
import dashboardService from '@/services/dashboard.service';
import './index.less';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 6,
  style: { marginBottom: 16 },
};

interface OverviewData {
  onlineUsers: number;
  totalUsers: number;
  newUsers: number;
  organizations: number;
  applications: number;
  onlineTrend: Array<{ time: string; value: number }>;
  newUsersTrend: Array<{ time: string; value: number }>;
  orgTrend: Array<{ time: string; value: number }>;
  appTrend: Array<{ time: string; value: number }>;
}

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<OverviewData>({
    onlineUsers: 0,
    totalUsers: 0,
    newUsers: 0,
    organizations: 0,
    applications: 0,
    onlineTrend: [],
    newUsersTrend: [],
    orgTrend: [],
    appTrend: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 直接获取完整的 Dashboard 数据
      const dashboardData = await dashboardService.getDashboard();
      
      // 生成模拟趋势数据（基于实际数据）
      const generateTrend = (base: number, length: number = 17) => {
        const beginDay = new Date().getTime();
        return Array.from({ length }, (_, i) => {
          const date = new Date(beginDay - 1000 * 60 * 60 * 24 * (length - 1 - i));
          return {
            time: `${date.getMonth() + 1}-${date.getDate()}`,
            value: Math.floor(base * (0.5 + Math.random() * 0.5)),
          };
        });
      };

      setData({
        onlineUsers: dashboardData.onlineUsers || 0,
        totalUsers: dashboardData.totalUsers || 0,
        newUsers: dashboardData.newUsers || 0,
        organizations: dashboardData.totalDepts || 0,
        applications: dashboardData.totalApps || 0,
        onlineTrend: generateTrend(dashboardData.onlineUsers || 0),
        newUsersTrend: generateTrend(dashboardData.newUsers || 0),
        orgTrend: generateTrend(dashboardData.totalDepts || 0),
        appTrend: generateTrend(dashboardData.totalApps || 0),
      });
    } catch (error) {
      console.error('加载概览数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    bgClass, 
    value, 
    title
  }: { 
    bgClass: string; 
    value: string | number; 
    title: string;
  }) => {
    return (
      <div className={`stat-card ${bgClass}`}>
        <div className="stat-card-content">
          <div className="stat-value">{value}</div>
          <p className="stat-title">{title}</p>
        </div>
      </div>
    );
  };

  return (
    <Row gutter={16}>
      <Col {...topColResponsiveProps}>
        <Skeleton loading={loading} active paragraph={{ rows: 0 }}>
          <StatCard
            bgClass="bg-primary"
            value={`${data.onlineUsers}/${data.totalUsers}`}
            title="在线/用户"
          />
        </Skeleton>
      </Col>

      <Col {...topColResponsiveProps}>
        <Skeleton loading={loading} active paragraph={{ rows: 0 }}>
          <StatCard
            bgClass="bg-success"
            value={data.newUsers}
            title="当月新增用户"
          />
        </Skeleton>
      </Col>

      <Col {...topColResponsiveProps}>
        <Skeleton loading={loading} active paragraph={{ rows: 0 }}>
          <StatCard
            bgClass="bg-orange"
            value={data.organizations}
            title="组织"
          />
        </Skeleton>
      </Col>

      <Col {...topColResponsiveProps}>
        <Skeleton loading={loading} active paragraph={{ rows: 0 }}>
          <StatCard
            bgClass="bg-magenta"
            value={data.applications}
            title="应用"
          />
        </Skeleton>
      </Col>
    </Row>
  );
};
