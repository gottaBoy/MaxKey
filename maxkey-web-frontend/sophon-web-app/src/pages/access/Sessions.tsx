import { useState, useEffect, useRef } from 'react';
import { Card, Table, Button, DatePicker, Space, message, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import type { OnlineSession } from '@/types/entity';
import sessionsService from '@/services/sessions.service';
import './Sessions.less';

const { RangePicker } = DatePicker;

const Sessions: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<OnlineSession[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

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

      const result = await sessionsService.fetch(params);
      setDataSource(result.rows || []);
      setTotal(result.records || 0);
    } catch (error: any) {
      console.error('加载会话列表失败:', error);
      message.error('加载会话列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pagination.current, pagination.pageSize]);

  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    loadData();
  };

  const handleTerminate = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要下线的会话');
      return;
    }

    try {
      const ids = selectedRowKeys.join(',');
      await sessionsService.terminate(ids);
      message.success('强制下线成功');
      setSelectedRowKeys([]);
      loadData();
    } catch (error: any) {
      console.error('强制下线失败:', error);
      message.error('强制下线失败');
    }
  };

  const columns: ColumnsType<OnlineSession> = [
    {
      title: '会话ID',
      dataIndex: 'sessionId',
      width: 160,
      ellipsis: true,
    },
    {
      title: '登录账号',
      dataIndex: 'username',
      width: 100,
      ellipsis: true,
    },
    {
      title: '姓名',
      dataIndex: 'displayName',
      width: 100,
      ellipsis: true,
    },
    {
      title: 'IP地址',
      dataIndex: 'sourceIp',
      width: 120,
      ellipsis: true,
    },
    {
      title: '位置',
      dataIndex: 'location',
      width: 100,
      ellipsis: true,
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      width: 100,
      ellipsis: true,
    },
    {
      title: '平台',
      dataIndex: 'platform',
      width: 100,
      ellipsis: true,
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      width: 150,
      ellipsis: true,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys);
    },
  };

  return (
    <div className="sessions-container">
      <Card>
        <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
          <Space>
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
            <Button onClick={() => {
              setDateRange([dayjs().subtract(30, 'day'), dayjs()]);
              setPagination({ current: 1, pageSize: 10 });
            }}>
              重置
            </Button>
          </Space>
        </Space>
      </Card>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Popconfirm
            title="确定要强制下线选中的会话吗？"
            onConfirm={handleTerminate}
            okText="确定"
            cancelText="取消"
            disabled={selectedRowKeys.length === 0}
          >
            <Button type="primary" danger disabled={selectedRowKeys.length === 0}>
              强制下线
            </Button>
          </Popconfirm>
        </Space>

        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="sessionId"
          loading={loading}
          rowSelection={rowSelection}
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
          scroll={{ x: 1000 }}
          bordered
          size="small"
        />
      </Card>
    </div>
  );
};

export default Sessions;

