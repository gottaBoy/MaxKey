import { useState, useRef } from 'react';
import {
  PageContainer,
  ProCard,
  ProTable,
  ModalForm,
} from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import {
  Button,
  Popconfirm,
  message,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { Group, GroupMember, UserInfo } from '@/types/entity';
import groupsService from '@/services/groups.service';
import groupMembersService from '@/services/group-members.service';
import './GroupMembersList.less';

const GroupMembersList: React.FC = () => {
  const groupActionRef = useRef<ActionType>();
  const memberActionRef = useRef<ActionType>();
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [selectedGroupName, setSelectedGroupName] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedGroupRowKey, setSelectedGroupRowKey] = useState<React.Key | null>(null);
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [addMemberLoading, setAddMemberLoading] = useState(false);
  const [addMemberSelectedKeys, setAddMemberSelectedKeys] = useState<React.Key[]>([]);
  const [addMemberSelectedRows, setAddMemberSelectedRows] = useState<UserInfo[]>([]);
  const addMemberActionRef = useRef<ActionType>();

  // 组列表列定义
  const groupColumns: ProColumns<Group>[] = [
    {
      title: '用户组名称',
      dataIndex: 'groupName',
      width: 200,
    },
  ];

  // 组成员列表列定义
  const memberColumns: ProColumns<GroupMember>[] = [
    {
      title: '用户组名称',
      dataIndex: 'groupName',
      width: 150,
      search: false,
      render: () => selectedGroupName || '-',
    },
    {
      title: '登录账号',
      dataIndex: 'username',
      width: 120,
    },
    {
      title: '显示名称',
      dataIndex: 'displayName',
      width: 150,
      search: false,
    },
    {
      title: '部门',
      dataIndex: 'department',
      width: 150,
      search: false,
      ellipsis: true,
    },
    {
      title: '职位',
      dataIndex: 'jobTitle',
      width: 120,
      search: false,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 80,
      search: false,
      render: (_, record) => {
        return record.gender === 1 ? '女' : '男';
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      fixed: 'right',
      render: (_, record) => [
        record.category === 'static' && (
          <Popconfirm
            key="delete"
            title="确定要删除此成员吗？"
            onConfirm={() => handleDeleteMember(record.id!)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        ),
      ],
    },
  ];

  // 加载组列表
  const loadGroups = async (params: any) => {
    try {
      // MaxKey API 使用 pageNumber 而不是 current
      const requestParams: any = {
        pageNumber: params.current || 1,
        pageSize: params.pageSize || 10,
        groupName: params.groupName || '',
      };
      
      // 移除空值参数
      Object.keys(requestParams).forEach(key => {
        if (requestParams[key] === '' || requestParams[key] === null || requestParams[key] === undefined) {
          delete requestParams[key];
        }
      });
      
      console.log('组列表请求参数:', requestParams);
      
      const result: any = await groupsService.fetch(requestParams);
      console.log('组列表API响应:', result);
      
      let records: Group[] = [];
      let total = 0;
      
      // 处理 MaxKey 的响应格式: { data: { records: number, rows: [...] } } 或 { records: number, rows: [...] }
      if (result && typeof result === 'object') {
        if (result.data && typeof result.data === 'object') {
          if (Array.isArray(result.data.rows)) {
            records = result.data.rows;
            total = result.data.records || result.data.total || result.data.rows.length;
          } else if (Array.isArray(result.data.records)) {
            records = result.data.records;
            total = result.data.total || result.data.records.length;
          } else if (Array.isArray(result.data)) {
            records = result.data;
            total = result.data.length;
          }
        } else if (Array.isArray(result.rows)) {
          records = result.rows;
          total = result.records || result.total || result.rows.length;
        } else if (Array.isArray(result.records)) {
          records = result.records;
          total = result.total || result.records.length;
        } else if (Array.isArray(result)) {
          records = result;
          total = result.length;
        }
      }
      
      return {
        data: records,
        success: true,
        total: total,
      };
    } catch (error: any) {
      console.error('加载组列表失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '加载组列表失败';
      message.error(errorMessage);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // 加载组成员列表
  const loadMembers = async (params: any) => {
    if (!selectedGroupId) {
      return {
        data: [],
        success: true,
        total: 0,
      };
    }

    try {
      // MaxKey API 使用 pageNumber 而不是 current
      // 参考 Angular 版本的参数格式
      const requestParams: any = {
        pageNumber: params.current || 1,
        pageSize: params.pageSize || 10,
        groupId: selectedGroupId,
        groupName: selectedGroupName || '',
        username: params.username || '',
      };
      
      // 移除空值参数
      Object.keys(requestParams).forEach(key => {
        if (requestParams[key] === '' || requestParams[key] === null || requestParams[key] === undefined) {
          delete requestParams[key];
        }
      });
      
      // 确保 groupId 存在
      if (!requestParams.groupId) {
        console.warn('groupId 为空，无法加载组成员列表');
        return {
          data: [],
          success: true,
          total: 0,
        };
      }
      
      console.log('组成员列表请求参数:', requestParams);
      
      const result: any = await groupMembersService.member(requestParams);
      console.log('组成员列表API响应:', result);
      
      let records: GroupMember[] = [];
      let total = 0;
      
      // 处理 MaxKey 的响应格式: { data: { records: number, rows: [...] } } 或 { records: number, rows: [...] }
      if (result && typeof result === 'object') {
        if (result.data && typeof result.data === 'object') {
          if (Array.isArray(result.data.rows)) {
            records = result.data.rows;
            total = result.data.records || result.data.total || result.data.rows.length;
          } else if (Array.isArray(result.data.records)) {
            records = result.data.records;
            total = result.data.total || result.data.records.length;
          } else if (Array.isArray(result.data)) {
            records = result.data;
            total = result.data.length;
          }
        } else if (Array.isArray(result.rows)) {
          records = result.rows;
          total = result.records || result.total || result.rows.length;
        } else if (Array.isArray(result.records)) {
          records = result.records;
          total = result.total || result.records.length;
        } else if (Array.isArray(result)) {
          records = result;
          total = result.length;
        }
      }
      
      return {
        data: records,
        success: true,
        total: total,
      };
    } catch (error: any) {
      console.error('加载组成员列表失败:', error);
      // 响应拦截器已经显示了错误消息（当 code !== 0 时），这里只记录日志
      // 如果是网络错误或 HTTP 错误，拦截器会显示，这里不需要重复显示
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // 选择组（单选）
  const handleSelectGroup = (record: Group, checked: boolean) => {
    if (checked) {
      setSelectedGroupId(record.id!);
      setSelectedGroupName(record.groupName);
      setSelectedRowKeys([]);
      setTimeout(() => {
        memberActionRef.current?.reload();
      }, 0);
    } else {
      // 取消选择时清空
      setSelectedGroupId('');
      setSelectedGroupName('');
      setSelectedRowKeys([]);
      setTimeout(() => {
        memberActionRef.current?.reload();
      }, 0);
    }
  };

  // 添加成员
  const handleAddMember = () => {
    if (!selectedGroupId) {
      message.warning('请先选择一个组');
      return;
    }
    setAddMemberModalVisible(true);
    setAddMemberSelectedKeys([]);
    setTimeout(() => {
      addMemberActionRef.current?.reload();
    }, 0);
  };

  // 加载未加入组的用户（用于添加成员）
  const loadUsersNotInGroup = async (params: any) => {
    if (!selectedGroupId) {
      return {
        data: [],
        success: true,
        total: 0,
      };
    }

    try {
      // MaxKey API 使用 pageNumber 而不是 current
      const requestParams: any = {
        pageNumber: params.current || 1,
        pageSize: params.pageSize || 10,
        groupId: selectedGroupId,
        username: params.username || '',
        displayName: params.displayName || '',
      };
      
      // 移除空值参数
      Object.keys(requestParams).forEach(key => {
        if (requestParams[key] === '' || requestParams[key] === null || requestParams[key] === undefined) {
          delete requestParams[key];
        }
      });
      
      console.log('未加入组用户列表请求参数:', requestParams);
      
      const result: any = await groupMembersService.memberOut(requestParams);
      console.log('未加入组用户列表API响应:', result);
      
      let records: UserInfo[] = [];
      let total = 0;
      
      // 处理 MaxKey 的响应格式: { data: { records: number, rows: [...] } } 或 { records: number, rows: [...] }
      if (result && typeof result === 'object') {
        if (result.data && typeof result.data === 'object') {
          if (Array.isArray(result.data.rows)) {
            records = result.data.rows;
            total = result.data.records || result.data.total || result.data.rows.length;
          } else if (Array.isArray(result.data.records)) {
            records = result.data.records;
            total = result.data.total || result.data.records.length;
          } else if (Array.isArray(result.data)) {
            records = result.data;
            total = result.data.length;
          }
        } else if (Array.isArray(result.rows)) {
          records = result.rows;
          total = result.records || result.total || result.rows.length;
        } else if (Array.isArray(result.records)) {
          records = result.records;
          total = result.total || result.records.length;
        } else if (Array.isArray(result)) {
          records = result;
          total = result.length;
        }
      }
      
      return {
        data: records,
        success: true,
        total: total,
      };
    } catch (error: any) {
      console.error('加载用户列表失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '加载用户列表失败';
      message.error(errorMessage);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // 确认添加成员
  const handleConfirmAddMember = async () => {
    if (addMemberSelectedKeys.length === 0) {
      message.warning('请至少选择一个用户');
      return;
    }

    setAddMemberLoading(true);
    try {
      // 使用保存的选中行数据
      const selectedUsers = addMemberSelectedRows.filter((u) => addMemberSelectedKeys.includes(u.id!));
      
      const memberIds = selectedUsers.map((u) => u.id!).join(',');
      const memberNames = selectedUsers.map((u) => u.username || '').join(',');

      await groupMembersService.add({
        type: 'USER',
        groupId: selectedGroupId,
        memberId: memberIds,
        memberName: memberNames,
      });

      message.success('添加成员成功');
      setAddMemberModalVisible(false);
      setAddMemberSelectedKeys([]);
      setAddMemberSelectedRows([]);
      memberActionRef.current?.reload();
    } catch (error: any) {
      console.error('添加成员失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '添加成员失败';
      message.error(errorMessage);
    } finally {
      setAddMemberLoading(false);
    }
  };

  // 删除成员
  const handleDeleteMember = async (id: string) => {
    try {
      await groupMembersService.delete(id);
      message.success('删除成员成功');
      memberActionRef.current?.reload();
    } catch (error) {
      message.error('删除成员失败');
    }
  };

  // 批量删除成员
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选择一个成员');
      return;
    }

    try {
      await groupMembersService.delete(selectedRowKeys as string[]);
      message.success('批量删除成员成功');
      setSelectedRowKeys([]);
      memberActionRef.current?.reload();
    } catch (error) {
      message.error('批量删除成员失败');
    }
  };

  // 未加入组用户的列定义
  const userColumns: ProColumns<UserInfo>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
    },
    {
      title: '显示名称',
      dataIndex: 'displayName',
      width: 150,
    },
    {
      title: '员工编号',
      dataIndex: 'employeeNumber',
      width: 120,
      search: false,
    },
    {
      title: '部门',
      dataIndex: 'department',
      width: 150,
      search: false,
      ellipsis: true,
    },
    {
      title: '职位',
      dataIndex: 'jobTitle',
      width: 120,
      search: false,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 80,
      search: false,
      render: (_, record) => {
        return record.gender === 1 ? '女' : '男';
      },
    },
  ];

  return (
    <PageContainer
      header={{
        title: '组成员管理',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '身份管理' },
            { title: '组成员管理' },
          ],
        },
      }}
    >
      <ProCard>
        <Row gutter={[16, 16]}>
          {/* 左侧组列表 */}
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <ProCard title="组列表" className="group-list-card">
              <ProTable<Group>
                actionRef={groupActionRef}
                columns={groupColumns}
                request={loadGroups}
                rowKey="id"
                search={{
                  labelWidth: 'auto',
                  collapsed: false,
                }}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
                size="small"
                bordered
                rowSelection={{
                  type: 'radio',
                  selectedRowKeys: selectedGroupRowKey ? [selectedGroupRowKey] : [],
                  onChange: (_selectedRowKeys, selectedRows) => {
                    if (selectedRows.length > 0) {
                      const record = selectedRows[0];
                      setSelectedGroupRowKey(record.id!);
                      handleSelectGroup(record, true);
                    } else {
                      setSelectedGroupRowKey(null);
                      handleSelectGroup({} as Group, false);
                    }
                  },
                }}
              />
            </ProCard>
          </Col>

          {/* 右侧组成员列表 */}
          <Col xs={24} sm={24} md={16} lg={16} xl={16}>
            <ProCard
              title={`组成员 - ${selectedGroupName || '请选择组'}`}
              className="member-list-card"
            >
              <ProTable<GroupMember>
                actionRef={memberActionRef}
                columns={memberColumns}
                request={loadMembers}
                rowKey="id"
                search={{
                  labelWidth: 'auto',
                  collapsed: false,
                }}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
                size="small"
                bordered
                scroll={{ x: 'max-content' }}
                rowSelection={{
                  selectedRowKeys,
                  onChange: setSelectedRowKeys,
                }}
                toolBarRender={() => [
                  <Button
                    key="add"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddMember}
                    disabled={!selectedGroupId}
                  >
                    添加成员
                  </Button>,
                  <Popconfirm
                    key="batchDelete"
                    title="确定要批量删除选中的成员吗？"
                    onConfirm={handleBatchDelete}
                    disabled={selectedRowKeys.length === 0}
                  >
                    <Button
                      danger
                      disabled={selectedRowKeys.length === 0}
                      icon={<DeleteOutlined />}
                    >
                      批量删除
                    </Button>
                  </Popconfirm>,
                ]}
              />
            </ProCard>
          </Col>
        </Row>
      </ProCard>

      {/* 添加成员对话框 */}
      <ModalForm
        title={`添加成员到组 - ${selectedGroupName}`}
        open={addMemberModalVisible}
        onOpenChange={setAddMemberModalVisible}
        onFinish={handleConfirmAddMember}
        width={900}
        modalProps={{
          destroyOnClose: true,
          confirmLoading: addMemberLoading,
        }}
        submitter={{
          searchConfig: {
            resetText: '取消',
          },
          submitButtonProps: {
            loading: addMemberLoading,
          },
        }}
      >
        <ProTable<UserInfo>
          actionRef={addMemberActionRef}
          columns={userColumns}
          request={loadUsersNotInGroup}
          rowKey="id"
          search={{
            labelWidth: 'auto',
            collapsed: false,
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          size="small"
          bordered
          scroll={{ x: 'max-content' }}
          rowSelection={{
            selectedRowKeys: addMemberSelectedKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              setAddMemberSelectedKeys(selectedRowKeys as React.Key[]);
              setAddMemberSelectedRows(selectedRows as UserInfo[]);
            },
          }}
          toolBarRender={false}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default GroupMembersList;

