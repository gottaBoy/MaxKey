import { ProCard } from '@ant-design/pro-components';
import { Table, Skeleton } from 'antd';
import { useState, useEffect } from 'react';
import dashboardService from '@/services/dashboard.service';

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Array<{ browser: string; visits: number }>>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const browsers = await dashboardService.getBrowserStats(10);
      const tableData = browsers.map((item, index) => ({
        key: index,
        browser: item.browser,
        visits: item.count,
      }));
      setData(tableData);
    } catch (error) {
      console.error('加载浏览器统计失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '浏览器',
      dataIndex: 'browser',
      key: 'browser',
    },
    {
      title: '访问量',
      dataIndex: 'visits',
      key: 'visits',
      width: 100,
    },
  ];

  return (
    <ProCard title="30日TOP10浏览器访问统计" headerBordered size="small">
      <Skeleton loading={loading} active paragraph={{ rows: 3 }}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          size="small"
          locale={{ emptyText: '暂无数据' }}
        />
      </Skeleton>
    </ProCard>
  );
};
