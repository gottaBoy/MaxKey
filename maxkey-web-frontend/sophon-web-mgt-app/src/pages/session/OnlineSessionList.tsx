import { useRef, useState } from 'react';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import {
  Button,
  Popconfirm,
  message,
  Tag,
  Space,
} from 'antd';
import {
  DisconnectOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { OnlineSession } from '@/types/entity';
import sessionsService from '@/services/sessions.service';

const OnlineSessionList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [expandForm, setExpandForm] = useState(false);

  // 表格列定义
  const columns: ProColumns<OnlineSession>[] = [
    {
      title: '会话ID',
      dataIndex: 'sessionId',
      width: 200,
      ellipsis: true,
      copyable: true,
      fixed: 'left',
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
      title: '工号',
      dataIndex: 'employeeNumber',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'message',
      width: 150,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '登录方式',
      dataIndex: 'loginType',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '访问地址',
      dataIndex: 'sourceIp',
      width: 140,
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '平台',
      dataIndex: 'platform',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      width: 180,
      hideInSearch: true,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      fixed: 'right',
      render: (_, record) => [
        <Popconfirm
          key="terminate"
          title="确定要强制此用户下线吗？"
          onConfirm={() => handleTerminate(record.sessionId!)}
          okText="确定"
          cancelText="取消"
        >
          <Button
            type="link"
            size="small"
            danger
            icon={<DisconnectOutlined />}
          >
            强制下线
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  // 加载在线会话列表
  const loadSessions = async (params: any) => {
    try {
      const requestParams: any = {
        username: params.username || '',
        displayName: params.displayName || '',
        employeeNumber: params.employeeNumber || '',
        pageNumber: params.current || 1,
        pageSize: params.pageSize || 10,
        pageSizeOptions: [10, 20, 50],
      };

      // 如果展开表单，添加日期参数
      if (expandForm && params.startDate && params.endDate) {
        requestParams.startDate = dayjs(params.startDate).format('YYYY-MM-DD HH:mm:ss');
        requestParams.endDate = dayjs(params.endDate).format('YYYY-MM-DD HH:mm:ss');
        requestParams.startDatePicker = dayjs(params.startDate).valueOf();
        requestParams.endDatePicker = dayjs(params.endDate).valueOf();
      } else {
        requestParams.startDate = '';
        requestParams.endDate = '';
      }

      const result: any = await sessionsService.fetch(requestParams);
      
      // 处理返回结果
      let rows: OnlineSession[] = [];
      let records = 0;
      
      if (result) {
        // 优先检查 rows 字段（MaxKey 标准格式）
        if (Array.isArray(result.rows)) {
          rows = result.rows;
          records = result.records || result.total || 0;
        } 
        // 检查嵌套的 data.rows
        else if (result.data && Array.isArray(result.data.rows)) {
          rows = result.data.rows;
          records = result.data.records || result.data.total || 0;
        }
        // 检查 records 字段（另一种格式）
        else if (Array.isArray(result.records)) {
          rows = result.records;
          records = result.total || 0;
        }
        // 检查 data 字段是否为数组
        else if (Array.isArray(result.data)) {
          rows = result.data;
          records = result.total || result.records || 0;
        }
        // 如果 result 本身就是数组
        else if (Array.isArray(result)) {
          rows = result;
        }
      }

      return {
        data: rows,
        success: true,
        total: records,
      };
    } catch (error: any) {
      console.error('加载在线会话列表失败:', error);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // 强制下线单个会话
  const handleTerminate = async (sessionId: string) => {
    try {
      await sessionsService.terminate(sessionId);
      message.success('强制下线成功');
      actionRef.current?.reload();
    } catch (error: any) {
      message.error(error?.response?.data?.message || '强制下线失败');
    }
  };

  // 批量强制下线
  const handleBatchTerminate = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要强制下线的会话');
      return;
    }

    try {
      // 使用 sessionId 而不是 id
      const ids = selectedRowKeys.map(key => String(key)).join(',');
      await sessionsService.terminate(ids);
      message.success(`成功强制下线 ${selectedRowKeys.length} 个会话`);
      setSelectedRowKeys([]);
      actionRef.current?.reload();
    } catch (error: any) {
      message.error(error?.response?.data?.message || '批量强制下线失败');
    }
  };

  return (
    <PageContainer
      header={{
        title: '会话管理',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '访问控制' },
            { title: '会话管理' },
          ],
        },
      }}
    >
      <ProTable<OnlineSession>
        columns={columns}
        actionRef={actionRef}
        request={loadSessions}
        rowKey="sessionId"
        search={{
          labelWidth: 'auto',
          collapsed: !expandForm,
          onCollapse: setExpandForm,
          searchText: '查询',
          resetText: '重置',
          optionRender: (_searchConfig, _formProps, dom) => [
            ...dom.reverse(),
            <Button
              key="expand"
              onClick={() => {
                setExpandForm(!expandForm);
                actionRef.current?.reload();
              }}
            >
              {expandForm ? '收起' : '展开'}
            </Button>,
          ],
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        dateFormatter="string"
        scroll={{ x: 'max-content' }}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        tableAlertRender={({ selectedRowKeys }) => (
          <Space size={24}>
            <span>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>{' '}
              项
            </span>
          </Space>
        )}
        tableAlertOptionRender={() => (
          <Space size={16}>
            <Popconfirm
              title="确定要批量强制下线选中的会话吗？"
              onConfirm={handleBatchTerminate}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                size="small"
                danger
                icon={<DisconnectOutlined />}
              >
                批量强制下线
              </Button>
            </Popconfirm>
            <Button
              type="link"
              size="small"
              onClick={() => setSelectedRowKeys([])}
            >
              取消选择
            </Button>
          </Space>
        )}
        form={{
          initialValues: {
            startDate: dayjs().subtract(30, 'day'),
            endDate: dayjs(),
          },
        }}
      />
    </PageContainer>
  );
};

export default OnlineSessionList;
