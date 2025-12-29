import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  PageContainer,
  ProCard,
  ProTable,
} from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import {
  Button,
  Popconfirm,
  message,
  Row,
  Col,
  Tag,
  Space,
  Input,
  Modal,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { Group, GroupMember } from '@/types/entity';
import groupsService from '@/services/groups.service';
import groupMembersService from '@/services/group-members.service';
import './GroupMembersList.less';

const GroupMembersList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const groupActionRef = useRef<ActionType>();
  const memberActionRef = useRef<ActionType>();
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [selectedGroupName, setSelectedGroupName] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [groupSearchParams, setGroupSearchParams] = useState<any>({});
  const [memberSearchParams, setMemberSearchParams] = useState<any>({});
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [addGroupModalVisible, setAddGroupModalVisible] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [memberTargetKeys, setMemberTargetKeys] = useState<string[]>([]);
  const [groupTargetKeys, setGroupTargetKeys] = useState<string[]>([]);
  const [memberLoading, setMemberLoading] = useState(false);
  const [groupLoading, setGroupLoading] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState<string>('');
  const [groupSelectedRowKeys, setGroupSelectedRowKeys] = useState<React.Key[]>([]);
  const [memberModalSearchParams, setMemberModalSearchParams] = useState<any>({});
  const [groupModalSearchParams, setGroupModalSearchParams] = useState<any>({});
  const memberModalActionRef = useRef<ActionType>();
  const groupModalActionRef = useRef<ActionType>();

  // 从 URL 参数初始化
  useEffect(() => {
    const urlGroupId = searchParams.get('groupId');
    const urlGroupName = searchParams.get('groupName');
    const urlUsername = searchParams.get('username');
    
    if (urlGroupId) {
      setSelectedGroupId(urlGroupId);
      if (urlGroupName) {
        setSelectedGroupName(decodeURIComponent(urlGroupName));
      }
    }
    
    if (urlUsername) {
      const decodedUsername = decodeURIComponent(urlUsername);
      setSelectedUsername(decodedUsername);
      setMemberSearchParams({ username: decodedUsername });
    }
  }, [searchParams]);

  // 用户组表格列定义
  const groupColumns: ProColumns<Group>[] = [
    {
      title: '用户组名称',
      dataIndex: 'groupName',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '类型',
      dataIndex: 'category',
      width: 120,
      hideInSearch: true,
      valueType: 'text',
      render: (_, record) => {
        const categoryMap: Record<string, { text: string; color: string }> = {
          dynamic: { text: '动态组', color: 'blue' },
          static: { text: '静态组', color: 'green' },
          app: { text: '应用组', color: 'orange' },
        };
        const category = categoryMap[record.category || 'static'] || { text: record.category || '静态组', color: 'default' };
        return <Tag color={category.color}>{category.text}</Tag>;
      },
    },
  ];

  // 成员表格列定义
  const memberColumns: ProColumns<GroupMember>[] = [
    {
      title: '用户组名称',
      dataIndex: 'groupName',
      width: 150,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
    },
    {
      title: '显示名称',
      dataIndex: 'displayName',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '部门',
      dataIndex: 'department',
      width: 150,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '职位',
      dataIndex: 'jobTitle',
      width: 120,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 80,
      hideInSearch: true,
      render: (_, record) => {
        return record.gender === 1 ? '女' : '男';
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      fixed: 'right',
      render: (_, record) => {
        // 只有静态组才显示删除按钮
        if (record.category === 'static') {
          return [
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
            </Popconfirm>,
          ];
        }
        return null;
      },
    },
  ];

  // 加载用户组列表
  const loadGroups = async (params: any) => {
    try {
      const requestParams: any = {
        pageNumber: params.current || 1,
        pageSize: params.pageSize || 10,
        ...groupSearchParams,
      };
      
      // 移除空值参数
      Object.keys(requestParams).forEach(key => {
        if (requestParams[key] === '' || requestParams[key] === null || requestParams[key] === undefined) {
          delete requestParams[key];
        }
      });
      
      const result: any = await groupsService.fetch(requestParams);
      
      let records: Group[] = [];
      let total = 0;
      
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
      
      // 调试：检查数据是否包含 category 字段
      if (records.length > 0) {
        console.log('用户组列表数据示例:', records[0]);
        console.log('category 字段:', records[0]?.category);
      }
      
      return {
        data: records,
        success: true,
        total: total,
      };
    } catch (error: any) {
      console.error('加载用户组列表失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '加载用户组列表失败';
      message.error(errorMessage);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // 加载成员列表
  const loadMembers = async (params: any) => {
    if (!selectedGroupId) {
      return {
        data: [],
        success: true,
        total: 0,
      };
    }

    try {
      const requestParams: any = {
        groupId: selectedGroupId,
        pageNumber: params.current || 1,
        pageSize: params.pageSize || 10,
        ...memberSearchParams,
      };
      
      // 移除空值参数（但保留 groupId）
      Object.keys(requestParams).forEach(key => {
        if (key !== 'groupId' && (requestParams[key] === '' || requestParams[key] === null || requestParams[key] === undefined)) {
          delete requestParams[key];
        }
      });
      
      const result: any = await groupMembersService.member(requestParams);
      
      let records: GroupMember[] = [];
      let total = 0;
      
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
      console.error('加载成员列表失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '加载成员列表失败';
      message.error(errorMessage);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // 选择用户组（通过 checkbox，类似 Angular 的 onGroupTableItemChecked）
  const handleSelectGroup = (groupId: string, groupName: string, checked: boolean) => {
    // 先取消所有选择（类似 Angular 的 onGroupTableAllChecked(false)）
    setGroupSelectedRowKeys([]);
    
    if (checked) {
      // 只选择当前项
      setGroupSelectedRowKeys([groupId]);
      setSelectedGroupId(groupId);
      setSelectedGroupName(groupName);
      setSelectedRowKeys([]);
      // 刷新成员列表
      setTimeout(() => {
        memberActionRef.current?.reload();
      }, 0);
    } else {
      setSelectedGroupId('');
      setSelectedGroupName('');
      setSelectedRowKeys([]);
    }
  };

  // 删除成员
  const handleDeleteMember = async (id: string) => {
    try {
      await groupMembersService.delete(id);
      message.success('删除成员成功');
      memberActionRef.current?.reload();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || '删除成员失败';
      message.error(errorMessage);
    }
  };

  // 批量删除成员
  const handleBatchDeleteMembers = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的成员');
      return;
    }
    try {
      await groupMembersService.delete(selectedRowKeys as string[]);
      message.success('批量删除成功');
      setSelectedRowKeys([]);
      memberActionRef.current?.reload();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || '批量删除失败';
      message.error(errorMessage);
    }
  };

  // 加载成员对话框数据
  const loadMemberModalData = async () => {
    if (!selectedGroupId) return;
    try {
      const requestParams: any = {
        groupId: selectedGroupId,
        pageNumber: 1,
        pageSize: 1000,
        ...memberModalSearchParams,
      };
      const result: any = await groupMembersService.memberOut(requestParams);
      let users: any[] = [];
      if (result && typeof result === 'object') {
        if (result.data && typeof result.data === 'object') {
          if (Array.isArray(result.data.rows)) {
            users = result.data.rows;
          } else if (Array.isArray(result.data.records)) {
            users = result.data.records;
          } else if (Array.isArray(result.data)) {
            users = result.data;
          }
        } else if (Array.isArray(result.rows)) {
          users = result.rows;
        } else if (Array.isArray(result.records)) {
          users = result.records;
        } else if (Array.isArray(result)) {
          users = result;
        }
      }
      setAllUsers(users);
    } catch (error: any) {
      console.error('加载用户列表失败:', error);
      message.error('加载用户列表失败');
    }
  };

  // 加载组对话框数据
  const loadGroupModalData = async () => {
    if (!selectedUsername) return;
    try {
      const requestParams: any = {
        username: selectedUsername,
        pageNumber: 1,
        pageSize: 1000,
        ...groupModalSearchParams,
      };
      const result: any = await groupMembersService.noMember(requestParams);
      let groups: Group[] = [];
      if (result && typeof result === 'object') {
        if (result.data && typeof result.data === 'object') {
          if (Array.isArray(result.data.rows)) {
            groups = result.data.rows;
          } else if (Array.isArray(result.data.records)) {
            groups = result.data.records;
          } else if (Array.isArray(result.data)) {
            groups = result.data;
          }
        } else if (Array.isArray(result.rows)) {
          groups = result.rows;
        } else if (Array.isArray(result.records)) {
          groups = result.records;
        } else if (Array.isArray(result)) {
          groups = result;
        }
      }
      setAllGroups(groups);
    } catch (error: any) {
      console.error('加载组列表失败:', error);
      message.error('加载组列表失败');
    }
  };

  // 打开添加对话框（根据是否有 username 或 groupId 决定）
  const handleAdd = async () => {
    if (selectedUsername) {
      // 如果有 username，打开为用户添加组的对话框
      setAddGroupModalVisible(true);
      setGroupTargetKeys([]);
      setGroupModalSearchParams({});
      await loadGroupModalData();
    } else if (selectedGroupId) {
      // 如果有 groupId，打开为组添加成员的对话框
      setAddMemberModalVisible(true);
      setMemberTargetKeys([]);
      setMemberModalSearchParams({});
      await loadMemberModalData();
    } else {
      message.warning('请先选择用户组或输入用户名');
    }
  };

  // 保存成员（为组添加成员）
  const handleSaveMembers = async () => {
    if (!selectedGroupId || memberTargetKeys.length === 0) {
      message.warning('请选择要添加的成员');
      return;
    }

    setMemberLoading(true);
    try {
      const usersToAdd = allUsers.filter((user) => memberTargetKeys.includes(user.id!));
      const memberIds = usersToAdd.map((user) => user.id!).join(',');
      const memberNames = usersToAdd.map((user) => user.username || '').join(',');
      
      await groupMembersService.add({
        type: 'USER',
        groupId: selectedGroupId,
        memberId: memberIds,
        memberName: memberNames,
      });

      message.success('添加成员成功');
      setAddMemberModalVisible(false);
      setMemberTargetKeys([]);
      memberActionRef.current?.reload();
    } catch (error: any) {
      console.error('添加成员失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '添加成员失败';
      message.error(errorMessage);
    } finally {
      setMemberLoading(false);
    }
  };

  // 保存组（为用户添加组）
  const handleSaveGroups = async () => {
    if (!selectedUsername || groupTargetKeys.length === 0) {
      message.warning('请选择要添加的组');
      return;
    }

    setGroupLoading(true);
    try {
      const groupsToAdd = allGroups.filter((group) => groupTargetKeys.includes(group.id!));
      const groupIds = groupsToAdd.map((group) => group.id!).join(',');
      const groupNames = groupsToAdd.map((group) => group.groupName || '').join(',');
      
      await groupMembersService.addMember2Groups({
        username: selectedUsername,
        groupId: groupIds,
        groupName: groupNames,
      });

      message.success('添加组成功');
      setAddGroupModalVisible(false);
      setGroupTargetKeys([]);
      memberActionRef.current?.reload();
    } catch (error: any) {
      console.error('添加组失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '添加组失败';
      message.error(errorMessage);
    } finally {
      setGroupLoading(false);
    }
  };

  return (
    <PageContainer
      header={{
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '身份管理' },
            { title: '用户组成员管理' },
          ],
        },
        // title: '用户组成员管理',
      }}
    >
      <ProCard>
        <Row gutter={[16, 16]}>
          {/* 左侧用户组列表 */}
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <ProCard
              title="用户组"
              className="grid-border"
              bodyStyle={{ padding: '12px' }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {/* 搜索表单 */}
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    placeholder="用户组名称"
                    value={groupSearchParams.groupName || ''}
                    onChange={(e) => {
                      setGroupSearchParams({ groupName: e.target.value });
                    }}
                    onPressEnter={() => {
                      groupActionRef.current?.reload();
                    }}
                    style={{ flex: 1 }}
                  />
                  <Button
                    type="primary"
                    onClick={() => {
                      groupActionRef.current?.reload();
                    }}
                  >
                    查询
                  </Button>
                </Space.Compact>
                <ProTable<Group>
                  columns={groupColumns}
                  actionRef={groupActionRef}
                  request={loadGroups}
                  rowKey="id"
                  search={false}
                  pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                  size="small"
                  bordered
                  scroll={{ x: 'max-content' }}
                  onRow={(record) => ({
                    onClick: () => {
                      if (groupSelectedRowKeys.includes(record.id!)) {
                        handleSelectGroup('', '', false);
                      } else {
                        handleSelectGroup(record.id!, record.groupName || '', true);
                      }
                    },
                    style: {
                      cursor: 'pointer',
                      backgroundColor: groupSelectedRowKeys.includes(record.id!) ? '#e6f7ff' : undefined,
                    },
                  })}
                />
              </Space>
            </ProCard>
          </Col>

          {/* 右侧成员列表 */}
          <Col xs={24} sm={24} md={16} lg={16} xl={16}>
            <ProCard
              // title="成员列表"
              className="grid-border"
              bodyStyle={{ padding: '12px' }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {/* 搜索表单 */}
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={12} md={8}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <span style={{ fontSize: '13px' }}>用户组名称</span>
                      <Input
                        value={selectedGroupName}
                        readOnly
                        disabled
                        placeholder="用户组名称"
                      />
                    </Space>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <span style={{ fontSize: '13px' }}>用户名</span>
                      <Input
                        placeholder="用户名"
                        value={memberSearchParams.username || ''}
                        onChange={(e) => {
                          setMemberSearchParams({ ...memberSearchParams, username: e.target.value });
                        }}
                        onPressEnter={() => {
                          memberActionRef.current?.reload();
                        }}
                      />
                    </Space>
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <span style={{ fontSize: '13px', opacity: 0 }}>操作</span>
                      <Space>
                        <Button
                          type="primary"
                          onClick={() => {
                            memberActionRef.current?.reload();
                          }}
                        >
                          查询
                        </Button>
                        <Button
                          onClick={() => {
                            setMemberSearchParams({ username: '' });
                            memberActionRef.current?.reload();
                          }}
                        >
                          重置
                        </Button>
                      </Space>
                    </Space>
                  </Col>
                </Row>
                <ProTable<GroupMember>
                  columns={memberColumns}
                  actionRef={memberActionRef}
                  request={loadMembers}
                  rowKey="id"
                  search={false}
                form={{
                  onValuesChange: (_changedValues, allValues) => {
                    setMemberSearchParams(allValues);
                  },
                }}
                pagination={{
                  defaultPageSize: 10,
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
                    onClick={handleAdd}
                    disabled={!selectedGroupId && !selectedUsername}
                  >
                    新增
                  </Button>,
                  <Popconfirm
                    key="batchDelete"
                    title="确定要批量删除选中的成员吗？"
                    onConfirm={handleBatchDeleteMembers}
                    okText="确定"
                    okType="danger"
                    cancelText="取消"
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
              </Space>
            </ProCard>
          </Col>
        </Row>
      </ProCard>

      {/* 为组添加成员对话框 */}
      <Modal
        title="新增"
        open={addMemberModalVisible}
        onCancel={() => {
          setAddMemberModalVisible(false);
          setMemberTargetKeys([]);
          setMemberModalSearchParams({});
        }}
        onOk={handleSaveMembers}
        width={800}
        confirmLoading={memberLoading}
        footer={[
          <Button key="cancel" onClick={() => {
            setAddMemberModalVisible(false);
            setMemberTargetKeys([]);
            setMemberModalSearchParams({});
          }}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={memberLoading} onClick={handleSaveMembers}>
            确认
          </Button>,
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {/* 搜索表单 */}
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={16} md={14}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <span style={{ fontSize: '13px' }}>用户名</span>
                <Input
                  placeholder="用户名"
                  value={memberModalSearchParams.username || ''}
                  onChange={(e) => {
                    setMemberModalSearchParams({ ...memberModalSearchParams, username: e.target.value });
                  }}
                  onPressEnter={() => {
                    loadMemberModalData();
                  }}
                />
              </Space>
            </Col>
            <Col xs={24} sm={8} md={10}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <span style={{ fontSize: '13px', opacity: 0 }}>操作</span>
                <Space>
                  <Button
                    type="primary"
                    onClick={() => {
                      loadMemberModalData();
                    }}
                  >
                    查询
                  </Button>
                  <Button
                    onClick={() => {
                      setMemberModalSearchParams({});
                      loadMemberModalData();
                    }}
                  >
                    重置
                  </Button>
                </Space>
              </Space>
            </Col>
          </Row>
          <ProTable
            columns={[
              {
                title: '用户名',
                dataIndex: 'username',
                width: 120,
              },
              {
                title: '显示名称',
                dataIndex: 'displayName',
                width: 120,
              },
              {
                title: '员工编号',
                dataIndex: 'employeeNumber',
                width: 120,
              },
              {
                title: '部门',
                dataIndex: 'department',
                width: 150,
              },
              {
                title: '职位',
                dataIndex: 'jobTitle',
                width: 120,
              },
              {
                title: '性别',
                dataIndex: 'gender',
                width: 80,
                render: (_, record: any) => record.gender === 1 ? '女' : '男',
              },
            ]}
            actionRef={memberModalActionRef as any}
            request={async (params) => {
              if (!selectedGroupId) {
                return { data: [], success: true, total: 0 };
              }
              try {
                const requestParams: any = {
                  groupId: selectedGroupId,
                  pageNumber: params.current || 1,
                  pageSize: params.pageSize || 5,
                  ...memberModalSearchParams,
                };
                const result: any = await groupMembersService.memberOut(requestParams);
                let records: any[] = [];
                let total = 0;
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
                setAllUsers(records);
                return { data: records, success: true, total };
              } catch (error: any) {
                message.error('加载用户列表失败');
                return { data: [], success: false, total: 0 };
              }
            }}
            rowKey="id"
            search={false}
            pagination={{
              defaultPageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ['5', '15', '50'],
            }}
            size="small"
            bordered
            rowSelection={{
              selectedRowKeys: memberTargetKeys,
              onChange: (keys) => setMemberTargetKeys(keys as string[]),
            }}
            scroll={{ y: 300 }}
          />
        </Space>
      </Modal>

      {/* 为用户添加组对话框 */}
      <Modal
        title="新增"
        open={addGroupModalVisible}
        onCancel={() => {
          setAddGroupModalVisible(false);
          setGroupTargetKeys([]);
          setGroupModalSearchParams({});
        }}
        onOk={handleSaveGroups}
        width={700}
        confirmLoading={groupLoading}
        footer={[
          <Button key="cancel" onClick={() => {
            setAddGroupModalVisible(false);
            setGroupTargetKeys([]);
            setGroupModalSearchParams({});
          }}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={groupLoading} onClick={handleSaveGroups}>
            确认
          </Button>,
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {/* 搜索表单 */}
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={16} md={14}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <span style={{ fontSize: '13px' }}>用户组名称</span>
                <Input
                  placeholder="用户组名称"
                  value={groupModalSearchParams.groupName || ''}
                  onChange={(e) => {
                    setGroupModalSearchParams({ ...groupModalSearchParams, groupName: e.target.value });
                  }}
                  onPressEnter={() => {
                    loadGroupModalData();
                  }}
                />
              </Space>
            </Col>
            <Col xs={24} sm={8} md={10}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <span style={{ fontSize: '13px', opacity: 0 }}>操作</span>
                <Space>
                  <Button
                    type="primary"
                    onClick={() => {
                      loadGroupModalData();
                    }}
                  >
                    查询
                  </Button>
                  <Button
                    onClick={() => {
                      setGroupModalSearchParams({});
                      loadGroupModalData();
                    }}
                  >
                    重置
                  </Button>
                </Space>
              </Space>
            </Col>
          </Row>
          <ProTable
            columns={[
              {
                title: '用户组名称',
                dataIndex: 'groupName',
                width: 200,
              },
              {
                title: '类型',
                dataIndex: 'category',
                width: 120,
                render: (_, record: any) => {
                  const categoryMap: Record<string, { text: string; color: string }> = {
                    dynamic: { text: '动态组', color: 'blue' },
                    static: { text: '静态组', color: 'green' },
                    app: { text: '应用组', color: 'orange' },
                  };
                  const category = categoryMap[record.category || 'static'] || { text: record.category || '静态组', color: 'default' };
                  return <Tag color={category.color}>{category.text}</Tag>;
                },
              },
            ]}
            actionRef={groupModalActionRef as any}
            request={async (params) => {
              if (!selectedUsername) {
                return { data: [], success: true, total: 0 };
              }
              try {
                const requestParams: any = {
                  username: selectedUsername,
                  pageNumber: params.current || 1,
                  pageSize: params.pageSize || 5,
                  ...groupModalSearchParams,
                };
                const result: any = await groupMembersService.noMember(requestParams);
                let records: Group[] = [];
                let total = 0;
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
                setAllGroups(records);
                return { data: records, success: true, total };
              } catch (error: any) {
                message.error('加载组列表失败');
                return { data: [], success: false, total: 0 };
              }
            }}
            rowKey="id"
            search={false}
            pagination={{
              defaultPageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ['5', '15', '50'],
            }}
            size="small"
            bordered
            rowSelection={{
              selectedRowKeys: groupTargetKeys,
              onChange: (keys) => setGroupTargetKeys(keys as string[]),
            }}
            scroll={{ y: 300 }}
          />
        </Space>
      </Modal>
    </PageContainer>
  );
};

export default GroupMembersList;
