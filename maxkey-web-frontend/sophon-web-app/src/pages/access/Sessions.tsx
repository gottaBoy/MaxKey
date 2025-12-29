import { useRef } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Badge, Popconfirm, Space, Table, message } from 'antd';
import type { OnlineSession } from '@/types/entity';
import sessionsService from '@/services/sessions.service';

const Sessions: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<OnlineSession>[] = [
    {
      title: '会话ID',
      dataIndex: 'sessionId',
      ellipsis: true,
      copyable: true,
      align: 'center',
      width: 150,
      fixed: 'left',
      search: false,
    },
    {
      title: '登录账号',
      dataIndex: 'username',
      width: 120,
      ellipsis: true,
      fieldProps: { autoComplete: 'off' },
    },
    {
      title: '姓名',
      dataIndex: 'displayName',
      width: 100,
      ellipsis: true,
      search: false,
    },
    {
      title: 'IP地址',
      width: 130,
      dataIndex: 'sourceIp',
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
      width: 120,
      ellipsis: true,
      search: false,
      render: (_, record) => {
        return record.location || '-';
      },
    },
    {
      title: '浏览器',
      ellipsis: true,
      width: 110,
      search: false,
      render: (_, record) => {
        return record.browser || '-';
      },
    },
    {
      title: '平台',
      ellipsis: true,
      width: 110,
      search: false,
      render: (_, record) => {
        return record.platform || '-';
      },
    },
    {
      title: '登录时间',
      ellipsis: true,
      dataIndex: 'loginTime',
      align: 'center',
      width: 200,
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 60,
      align: 'center',
      fixed: 'right',
      render: (text: any, record) => {
        return [
          <Popconfirm
            title="确定要强制下线此会话吗？"
            placement="bottomRight"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={async () => {
              try {
                await sessionsService.terminate(record.sessionId!);
                message.success('强制下线成功');
                actionRef.current?.reload();
              } catch (error: any) {
                console.error('强制下线失败:', error);
                message.error('强制下线失败');
              }
            }}
            okText="确定"
            cancelText="取消"
            key="offline"
          >
            <a target="_blank" key="remove" style={{ color: 'red' }}>
              下线
            </a>
          </Popconfirm>,
        ];
      },
    },
  ];

  return (
    <PageContainer content="管理您的在线会话，可以查看会话详情并强制下线">
      <ProTable<OnlineSession>
        search={false}
        options={{
          density: false,
          setting: true,
          reload: true,
          search: false,
        }}
        cardProps={{ style: { overflow: 'auto' } }}
        scroll={{ x: 700 }}
        columns={columns}
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={24}>
            <span>
              已选择 {selectedRowKeys.length} 项
              <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                取消选择
              </a>
            </span>
          </Space>
        )}
        tableAlertOptionRender={(rowSelection) => {
          return (
            <Space size={16}>
              <Popconfirm
                title="确定要强制下线选中的会话吗？"
                placement="bottomRight"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={async () => {
                  try {
                    const ids = rowSelection.selectedRowKeys.join(',');
                    await sessionsService.terminate(ids);
                    message.success('批量强制下线成功');
                    rowSelection.onCleanSelected();
                    actionRef.current?.reload();
                  } catch (error: any) {
                    console.error('批量强制下线失败:', error);
                    message.error('批量强制下线失败');
                  }
                }}
                okText="确定"
                cancelText="取消"
                key="offline"
              >
                <a target="_blank" key="remove" style={{ color: 'red' }}>
                  批量下线
                </a>
              </Popconfirm>
            </Space>
          );
        }}
        actionRef={actionRef}
        pagination={{ defaultPageSize: 10 }}
        request={async (params) => {
          try {
            const requestParams: any = {
              pageNumber: params.current || 1,
              pageSize: params.pageSize || 10,
              username: params.username || '',
            };

            // 移除空参数
            Object.keys(requestParams).forEach((key) => {
              if (requestParams[key] === '' || requestParams[key] === null || requestParams[key] === undefined) {
                delete requestParams[key];
              }
            });

            const result = await sessionsService.fetch(requestParams);
            return {
              data: result.rows || [],
              success: true,
              total: result.records || 0,
            };
          } catch (error: any) {
            console.error('加载会话列表失败:', error);
            message.error('加载会话列表失败');
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

export default Sessions;

