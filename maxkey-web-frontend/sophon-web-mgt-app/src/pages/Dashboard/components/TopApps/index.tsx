import { ProCard } from '@ant-design/pro-components';
import { Empty, Table, Skeleton } from 'antd';
import { useState, useEffect } from 'react';
import dashboardService from '@/services/dashboard.service';

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Array<{ key: number; appName: string; visits: number }>>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const apps = await dashboardService.getTopApps(10);
      const tableData = apps.map((item, index) => ({
        key: index,
        appName: item.appName || item.appname,
        visits: item.accessCount || item.reportcount,
      }));
      setData(tableData);
    } catch (error) {
      console.error('加载应用访问统计失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '应用名称',
      dataIndex: 'appName',
      key: 'appName',
    },
    {
      title: '访问量',
      dataIndex: 'visits',
      key: 'visits',
      width: 100,
    },
  ];

  return (
    <ProCard title="30日TOP10应用访问统计" headerBordered size="small">
      <Skeleton loading={loading} active paragraph={{ rows: 3 }}>
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            size="small"
            rowKey="reportstring"
            locale={{ emptyText: '暂无数据' }}
        />
        {/* {data.length > 0 ? (
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            size="small"
          />
        ) : (
          <div style={{ height: 160, alignItems: 'center', display: 'grid' }}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
          </div>
        )} */}
      </Skeleton>
    </ProCard>
  );
};
