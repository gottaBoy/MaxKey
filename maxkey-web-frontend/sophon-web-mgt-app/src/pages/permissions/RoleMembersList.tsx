import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  PageContainer,
  ProCard,
  ProTable,
  ModalForm,
  ProFormText,
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
  Modal,
  Transfer,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import type { Role, RoleMember, UserInfo } from '@/types/entity';
import rolesService from '@/services/roles.service';
import roleMembersService from '@/services/role-members.service';
import usersService from '@/services/user';
import './RoleMembersList.less';

const RoleMembersList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const leftActionRef = useRef<ActionType>();
  const rightActionRef = useRef<ActionType>();
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [selectedRoleName, setSelectedRoleName] = useState<string>('');
  const [memberName, setMemberName] = useState<string>('');
  const [appId, setAppId] = useState<string>('');
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [addRoleModalVisible, setAddRoleModalVisible] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberTargetKeys, setMemberTargetKeys] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<UserInfo[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');

  // 从 URL 参数初始化
  useEffect(() => {
    const urlAppId = searchParams.get('appId');
    const urlRoleId = searchParams.get('roleId');
    const urlRoleName = searchParams.get('roleName');
    const urlUsername = searchParams.get('username');
    
    if (urlAppId) {
      setAppId(urlAppId);
    }
    if (urlRoleId) {
      setSelectedRoleId(urlRoleId);
    }
    if (urlRoleName) {
      setSelectedRoleName(decodeURIComponent(urlRoleName));
    }
    if (urlUsername) {
      setMemberName(decodeURIComponent(urlUsername));
      setSelectedUser(decodeURIComponent(urlUsername));
    }
  }, [searchParams]);

  // 左侧角色列表列定义
  const leftColumns: ProColumns<Role>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 200,
      ellipsis: true,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      width: 200,
      ellipsis: true,
    },
  ];

  // 右侧成员列表列定义
  const rightColumns: ProColumns<RoleMember>[] = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 120,
      hideInSearch: true,
      render: (_, record) => {
        const typeMap: Record<string, { text: string; color: string }> = {
          USER: { text: '用户', color: 'blue' },
          'USER-DYNAMIC': { text: '动态用户', color: 'green' },
          POST: { text: '岗位', color: 'orange' },
        };
        const type = typeMap[record.type || 'USER'] || { text: record.type || '用户', color: 'default' };
        return <Tag color={type.color}>{type.text}</Tag>;
      },
    },
    {
      title: '成员名称',
      dataIndex: 'memberName',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '职位',
      dataIndex: 'jobTitle',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 80,
      hideInSearch: true,
      render: (_, record) => {
        if (record.type === 'POST') return '-';
        return record.gender === 1 ? '女' : '男';
      },
    },
    {
      title: '部门',
      dataIndex: 'department',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      fixed: 'right',
      render: (_, record) => [
        record.type !== 'USER-DYNAMIC' && (
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

  // 加载左侧角色列表
  const loadLeftRoles = async (params: any) => {
    try {
      const requestParams: any = {
        appId: appId || '',
        roleName: params.roleName || '',
        pageNumber: params.current || 1,
        pageSize: params.pageSize || 10,
        pageSizeOptions: [10, 20, 50],
      };

      const result = await rolesService.fetch(requestParams);
      
      const data = (result as any).rows || (result as any).records || [];
      const total = (result as any).records || (result as any).total || 0;
      
      return {
        data: Array.isArray(data) ? data : [],
        success: true,
        total: typeof total === 'number' ? total : 0,
      };
    } catch (error: any) {
      console.error('加载角色列表失败:', error);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // 加载右侧成员列表
  const loadRightMembers = async (params: any) => {
    if (!selectedRoleId) {
      return {
        data: [],
        success: true,
        total: 0,
      };
    }
    try {
      const requestParams: any = {
        roleId: selectedRoleId,
        memberName: params.memberName || memberName || '',
        pageNumber: params.current || 1,
        pageSize: params.pageSize || 10,
        pageSizeOptions: [10, 20, 50],
      };

      const result = await roleMembersService.member(requestParams);
      
      const data = (result as any).rows || (result as any).records || [];
      const total = (result as any).records || (result as any).total || 0;
      
      return {
        data: Array.isArray(data) ? data : [],
        success: true,
        total: typeof total === 'number' ? total : 0,
      };
    } catch (error: any) {
      console.error('加载成员列表失败:', error);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // 选择左侧角色
  const handleSelectRole = (record: Role) => {
    setSelectedRoleId(record.id!);
    setSelectedRoleName(record.roleName);
    rightActionRef.current?.reload();
  };

  // 删除成员
  const handleDeleteMember = async (id: string) => {
    try {
      await roleMembersService.delete([id]);
      message.success('删除成员成功');
      rightActionRef.current?.reload();
    } catch (error) {
      message.error('删除成员失败');
    }
  };

  // 批量删除成员
  const handleBatchDeleteMembers = async (ids: string[]) => {
    try {
      await roleMembersService.delete(ids);
      message.success('批量删除成功');
      rightActionRef.current?.reload();
    } catch (error) {
      message.error('批量删除失败');
    }
  };

  // 打开添加成员对话框（从角色添加）
  const handleAddMemberFromRole = async () => {
    if (!selectedRoleId) {
      message.warning('请先选择角色');
      return;
    }
    setMemberLoading(true);
    try {
      // 加载所有用户（未加入该角色的）
      const result = await roleMembersService.memberOut({
        roleId: selectedRoleId,
        pageNumber: 1,
        pageSize: 1000,
        pageSizeOptions: [1000],
      });
      const data = (result as any).rows || (result as any).records || [];
      setAllUsers(data);
      setMemberTargetKeys([]);
      setAddMemberModalVisible(true);
    } catch (error) {
      message.error('加载用户列表失败');
    } finally {
      setMemberLoading(false);
    }
  };

  // 保存添加的成员
  const handleSaveMembers = async () => {
    if (!selectedRoleId || memberTargetKeys.length === 0) {
      message.warning('请选择要添加的成员');
      return;
    }
    setMemberLoading(true);
    try {
      const selectedUsers = allUsers.filter((u) => memberTargetKeys.includes(u.id!));
      const userIds = selectedUsers.map((u) => u.id!).join(',');
      const userNames = selectedUsers.map((u) => u.username || '').join(',');
      
      await roleMembersService.add({
        roleId: selectedRoleId,
        userIds: memberTargetKeys,
      });
      
      message.success('添加成员成功');
      setAddMemberModalVisible(false);
      rightActionRef.current?.reload();
    } catch (error) {
      message.error('添加成员失败');
    } finally {
      setMemberLoading(false);
    }
  };

  // 打开添加角色对话框（从用户添加）
  const handleAddRoleFromUser = async () => {
    if (!selectedUser) {
      message.warning('请先输入用户名');
      return;
    }
    setMemberLoading(true);
    try {
      // 加载用户未加入的角色
      const result = await roleMembersService.rolesNoMember({
        username: selectedUser,
        appId: appId || '',
        pageNumber: 1,
        pageSize: 1000,
        pageSizeOptions: [1000],
      });
      const data = (result as any).rows || (result as any).records || [];
      setAllRoles(data);
      setMemberTargetKeys([]);
      setAddRoleModalVisible(true);
    } catch (error) {
      message.error('加载角色列表失败');
    } finally {
      setMemberLoading(false);
    }
  };

  // 保存添加的角色
  const handleSaveRoles = async () => {
    if (!selectedUser || memberTargetKeys.length === 0) {
      message.warning('请选择要添加的角色');
      return;
    }
    setMemberLoading(true);
    try {
      const selectedRoles = allRoles.filter((r) => memberTargetKeys.includes(r.id!));
      const roleIds = selectedRoles.map((r) => r.id!).join(',');
      const roleNames = selectedRoles.map((r) => r.roleName || '').join(',');
      
      await roleMembersService.addMember2Roles({
        username: selectedUser,
        roleId: roleIds,
        roleName: roleNames,
      });
      
      message.success('添加角色成功');
      setAddRoleModalVisible(false);
      rightActionRef.current?.reload();
    } catch (error) {
      message.error('添加角色失败');
    } finally {
      setMemberLoading(false);
    }
  };

  return (
    <PageContainer
      header={{
        title: '角色成员管理',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '权限管理' },
            { title: '角色成员管理' },
          ],
        },
      }}
    >
      <ProCard>
        <Row gutter={16}>
          {/* 左侧：角色列表 */}
          <Col span={8}>
            <ProCard title="角色列表" size="small">
              <ProTable<Role>
                actionRef={leftActionRef}
                columns={leftColumns}
                request={loadLeftRoles}
                rowKey="id"
                search={{
                  labelWidth: 'auto',
                  collapsed: false,
                }}
                pagination={{
                  defaultPageSize: 10,
                  showSizeChanger: true,
                }}
                rowSelection={{
                  type: 'radio',
                  selectedRowKeys: selectedRoleId ? [selectedRoleId] : [],
                  onSelect: (record) => {
                    handleSelectRole(record);
                  },
                }}
              />
            </ProCard>
          </Col>

          {/* 右侧：成员列表 */}
          <Col span={16}>
            <ProCard
              title={`成员列表 - ${selectedRoleName || '请选择角色'}`}
              size="small"
              extra={
                <Space>
                  {selectedRoleId && (
                    <Button
                      type="primary"
                      icon={<UserAddOutlined />}
                      onClick={handleAddMemberFromRole}
                    >
                      添加成员
                    </Button>
                  )}
                  {selectedUser && (
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddRoleFromUser}
                    >
                      添加角色
                    </Button>
                  )}
                </Space>
              }
            >
              <ProTable<RoleMember>
                actionRef={rightActionRef}
                columns={rightColumns}
                request={loadRightMembers}
                rowKey="id"
                search={{
                  labelWidth: 'auto',
                  collapsed: false,
                  defaultFormData: {
                    memberName: memberName,
                  },
                }}
                pagination={{
                  defaultPageSize: 10,
                  showSizeChanger: true,
                }}
                rowSelection={{
                  onChange: (selectedRowKeys) => {
                    // Can handle selected keys here if needed
                  },
                }}
                tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
                  <Space size={16}>
                    <span>
                      已选择 {selectedRowKeys.length} 项
                      <Button
                        type="link"
                        onClick={() => {
                          handleBatchDeleteMembers(selectedRowKeys as string[]);
                          onCleanSelected();
                        }}
                      >
                        批量删除
                      </Button>
                    </span>
                  </Space>
                )}
              />
            </ProCard>
          </Col>
        </Row>
      </ProCard>

      {/* 添加成员对话框 */}
      <Modal
        title="添加成员"
        open={addMemberModalVisible}
        onCancel={() => setAddMemberModalVisible(false)}
        onOk={handleSaveMembers}
        width={800}
        confirmLoading={memberLoading}
      >
        <Transfer
          dataSource={allUsers.map((user) => ({
            key: user.id!,
            title: `${user.displayName || user.username} (${user.username})`,
            description: user.email || user.mobile || '',
          }))}
          targetKeys={memberTargetKeys}
          onChange={(keys) => setMemberTargetKeys(keys as string[])}
          render={(item) => item.title}
          showSearch
          listStyle={{
            width: 350,
            height: 400,
          }}
          locale={{
            itemUnit: '项',
            itemsUnit: '项',
            searchPlaceholder: '搜索用户',
          }}
        />
      </Modal>

      {/* 添加角色对话框 */}
      <Modal
        title="添加角色"
        open={addRoleModalVisible}
        onCancel={() => setAddRoleModalVisible(false)}
        onOk={handleSaveRoles}
        width={800}
        confirmLoading={memberLoading}
      >
        <Transfer
          dataSource={allRoles.map((role) => ({
            key: role.id!,
            title: role.roleName,
            description: role.description || '',
          }))}
          targetKeys={memberTargetKeys}
          onChange={(keys) => setMemberTargetKeys(keys as string[])}
          render={(item) => item.title}
          showSearch
          listStyle={{
            width: 350,
            height: 400,
          }}
          locale={{
            itemUnit: '项',
            itemsUnit: '项',
            searchPlaceholder: '搜索角色',
          }}
        />
      </Modal>
    </PageContainer>
  );
};

export default RoleMembersList;

