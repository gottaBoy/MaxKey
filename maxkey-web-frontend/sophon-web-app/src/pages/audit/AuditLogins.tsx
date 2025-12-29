import { useRef } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Badge, DatePicker } from 'antd';
import dayjs from 'dayjs';
import type { LoginHistory } from '@/types/entity';
import historyService from '@/services/history.service';
import './AuditLogins.less';

const { RangePicker } = DatePicker;

const AuditLogins: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<LoginHistory>[] = [
    {
      title: '会话ID',
      dataIndex: 'sessionId',
      width: 200,
      ellipsis: true,
      copyable: true,
      fixed: 'left',
      search: false,
    },
    {
      title: '登录账号',
      dataIndex: 'username',
      width: 150,
      ellipsis: true,
      fieldProps: { autoComplete: 'off' },
    },
    {
      title: '姓名',
      dataIndex: 'displayName',
      width: 150,
      ellipsis: true,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      search: false,
      render: (_, record) => {
        const status = record.status;
        if (status === '成功' || status === 'SUCCESS') {
          return <Badge status="success" text="成功" />;
        } else if (status === '失败' || status === 'FAILURE') {
          return <Badge status="error" text="失败" />;
        }
        return <Badge status="default" text={status || '-'} />;
      },
    },
    {
      title: '登录方式',
      dataIndex: 'authnType',
      width: 120,
      search: false,
    },
    {
      title: '访问地址',
      dataIndex: 'sourceIp',
      width: 150,
      ellipsis: true,
      search: false,
      render: (_, record) => {
        return record.sourceIp ? (
          <Badge status="success" text={record.sourceIp} />
        ) : (
          <Badge status="error" text="未知" />
        );
      },
    },
    {
      title: '位置',
      dataIndex: 'location',
      width: 150,
      ellipsis: true,
      search: false,
      render: (_, record) => {
        return record.location || '-';
      },
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      width: 150,
      ellipsis: true,
      search: false,
      render: (_, record) => {
        return record.browser || '-';
      },
    },
    {
      title: '平台',
      dataIndex: 'platform',
      width: 150,
      ellipsis: true,
      search: false,
      render: (_, record) => {
        return record.platform || '-';
      },
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      width: 180,
      valueType: 'dateTime',
      sorter: true,
      defaultSortOrder: 'descend',
      renderFormItem: () => {
        return (
          <RangePicker
            showTime={{
              hideDisabledOptions: true,
              defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
            }}
            placeholder={['开始时间', '结束时间']}
            format="YYYY-MM-DD HH:mm:ss"
          />
        );
      },
    },
    {
      title: '退出时间',
      dataIndex: 'logoutTime',
      width: 180,
      valueType: 'dateTime',
      search: false,
    },
  ];

  return (
    <PageContainer content="查看您的登录历史记录，包括登录时间、IP地址、浏览器等信息">
      <ProTable<LoginHistory>
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false,
        }}
        options={{
          density: false,
          setting: true,
          reload: true,
        }}
        cardProps={{ style: { overflow: 'auto' } }}
        scroll={{ x: 1500 }}
        columns={columns}
        actionRef={actionRef}
        pagination={{ defaultPageSize: 10 }}
        request={async (params, sort) => {
          try {
            const requestParams: any = {
              pageNumber: params.current || 1,
              pageSize: params.pageSize || 10,
              username: params.username || '',
            };

            // 处理日期范围
            if (params.loginTime && Array.isArray(params.loginTime) && params.loginTime.length === 2) {
              requestParams.startDate = dayjs(params.loginTime[0]).format('YYYY-MM-DD HH:mm:ss');
              requestParams.endDate = dayjs(params.loginTime[1]).format('YYYY-MM-DD HH:mm:ss');
              requestParams.startDatePicker = dayjs(params.loginTime[0]).valueOf();
              requestParams.endDatePicker = dayjs(params.loginTime[1]).valueOf();
            }

            // 移除空参数
            Object.keys(requestParams).forEach((key) => {
              if (requestParams[key] === '' || requestParams[key] === null || requestParams[key] === undefined) {
                delete requestParams[key];
              }
            });

            const result = await historyService.fetchLoginHistory(requestParams);
            return {
              data: result.rows || [],
              success: true,
              total: result.records || 0,
            };
          } catch (error: any) {
            console.error('加载登录日志失败:', error);
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        rowKey="sessionId"
        dateFormatter="string"
      />
    </PageContainer>
  );
};

export default AuditLogins;

