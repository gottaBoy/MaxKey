import { ProCard } from '@ant-design/pro-components';
import { Column } from '@ant-design/plots';
import { useState, useEffect } from 'react';
import { Empty, Skeleton, Badge } from 'antd';
import dashboardService from '@/services/dashboard.service';

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Array<{ hour: string; visits: number }>>([]);
  const [totalVisits, setTotalVisits] = useState<number>(6);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 从后端获取当日小时访问数据
      const hourlyData = await dashboardService.getDayHourVisits();
      
      // 转换数据格式
      const formattedData = hourlyData.map(item => ({
        hour: item.hour,
        visits: item.visits,
      }));
      
      const total = formattedData.reduce((sum, item) => sum + item.visits, 0);
      setData(formattedData);
      setTotalVisits(total);
    } catch (error) {
      console.error('加载当日访问统计失败:', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 90);
    }
  };

  const visitsConfig = {
    height: 290,
    data: data,
    xField: 'hour',
    yField: 'visits',
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
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${v}`,
      },
    },
    minColumnWidth: 10,
    maxColumnWidth: 20,
  };

  return (
    <ProCard
      title={
        <span>
          当日访问统计 - 日访问量 <Badge count={totalVisits} style={{ backgroundColor: '#52c41a', marginLeft: 8 }} />
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
