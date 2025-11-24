import { useState, useEffect } from 'react';
import { Card, Table, DatePicker, Button, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import type { LoginHistory } from '@/types/entity';
import historyService from '@/services/history.service';
import './AuditLogins.less';

const { RangePicker } = DatePicker;

const AuditLogins: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<LoginHistory[]>([]);
  const [total, setTotal] = useState(0);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    loadData();
  }, [pagination.current, pagination.pageSize]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params: any = {
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
        pageSizeOptions: [10, 20, 50],
      };

      if (dateRange && dateRange[0] && dateRange[1]) {
        params.startDate = dateRange[0].format('YYYY-MM-DD HH:mm:ss');
        params.endDate = dateRange[1].format('YYYY-MM-DD HH:mm:ss');
        params.startDatePicker = dateRange[0].valueOf();
        params.endDatePicker = dateRange[1].valueOf();
      }

      const result = await historyService.fetchLoginHistory(params);
      setDataSource(result.rows || []);
      setTotal(result.records || 0);
    } catch (error: any) {
      console.error('加载登录日志失败:', error);
      message.error('加载登录日志失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    loadData();
  };

  const columns: ColumnsType<LoginHistory> = [
    {
      title: '会话ID',
      dataIndex: 'sessionId',
      width: 200,
      ellipsis: true,
    },
    {
      title: '登录账号',
      dataIndex: 'username',
      width: 150,
    },
    {
      title: '姓名',
      dataIndex: 'displayName',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
    },
    {
      title: '登录方式',
      dataIndex: 'authnType',
      width: 120,
    },
    {
      title: '访问地址',
      dataIndex: 'sourceIp',
      width: 150,
    },
    {
      title: '位置',
      dataIndex: 'location',
      width: 150,
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      width: 150,
    },
    {
      title: '平台',
      dataIndex: 'platform',
      width: 150,
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      width: 180,
    },
    {
      title: '退出时间',
      dataIndex: 'logoutTime',
      width: 180,
    },
  ];

  return (
    <div className="audit-logins-container">
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <RangePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            value={dateRange}
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                setDateRange([dates[0], dates[1]]);
              } else {
                setDateRange([dayjs().subtract(30, 'day'), dayjs()]);
              }
            }}
          />
          <Button type="primary" onClick={handleSearch}>
            查询
          </Button>
          <Button
            onClick={() => {
              setDateRange([dayjs().subtract(30, 'day'), dayjs()]);
              setPagination({ current: 1, pageSize: 10 });
            }}
          >
            重置
          </Button>
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="sessionId"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize });
            },
          }}
          bordered
          size="small"
        />
      </Card>
    </div>
  );
};

export default AuditLogins;

