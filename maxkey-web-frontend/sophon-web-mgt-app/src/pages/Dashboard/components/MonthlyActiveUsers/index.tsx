import { ProCard } from '@ant-design/pro-components';
import { Column } from '@ant-design/plots';
import { useState, useEffect } from 'react';
import { Empty, Skeleton, Badge } from 'antd';
import dashboardService from '@/services/dashboard.service';

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Array<{ date: string; users: number }>>([]);
  const [totalUsers, setTotalUsers] = useState<number>(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 从后端获取30天访问趋势数据
      const trendData = await dashboardService.getVisitTrend(30);
      
      const monthData = trendData.map(item => ({
        date: item.date,
        users: item.visits,
      }));
      
      setData(monthData);
      
      // 从 Dashboard 数据获取活跃用户数
      const dashboardData = await dashboardService.getDashboard();
      setTotalUsers(dashboardData.activeUsers || 0);
    } catch (error) {
      console.error('加载30日访问统计失败:', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 90);
    }
  };

  const visitsConfig = {
    height: 290,
    data: data,
    xField: 'date',
    yField: 'users',
    color: '#5B8FF9',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: 'top' as const,
      style: {
        fill: '#000',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoRotate: true,
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${v}`,
      },
    },
    minColumnWidth: 20,
    maxColumnWidth: 60,
  };

  return (
    <ProCard
      title={
        <span>
          30日访问统计 - 活动用户 <Badge count={totalUsers} style={{ backgroundColor: '#52c41a', marginLeft: 8 }} />
        </span>
      }
      headerBordered
    >
      <Skeleton loading={loading} style={{ height: 290 }} active paragraph={{ rows: 7 }}>
        {data.length > 0 ? (
          <Column {...visitsConfig} />
        ) : (
          <div style={{ height: 290, alignItems: 'center', display: 'grid' }}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )}
      </Skeleton>
    </ProCard>
  );
};
