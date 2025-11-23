import { useState, useRef, useEffect } from 'react';
import {
  PageContainer,
  ProTable,
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormRadio,
  ProFormTreeSelect,
  ProFormDependency,
} from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import {
  Button,
  Popconfirm,
  message,
  Modal,
  Transfer,
  Tag,
} from 'antd';
import type { DataNode } from 'antd/es/tree';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { Group, GroupMember, UserInfo } from '@/types/entity';
import groupsService from '@/services/groups.service';
import groupMembersService from '@/services/group-members.service';
import usersService from '@/services/user';
import organizationsService from '@/services/organizations.service';
import './GroupList.less';

const GroupList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const createFormRef = useRef<any>();
  const editFormRef = useRef<any>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<Group>();
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberTargetKeys, setMemberTargetKeys] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<UserInfo[]>([]);
  const [orgTreeSelectData, setOrgTreeSelectData] = useState<any[]>([]);

  // 表格列定义
  const columns: ProColumns<Group>[] = [
    {
      title: '用户组名称',
      dataIndex: 'groupName',
      width: 200,
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'category',
      width: 120,
      ellipsis: true,
      valueEnum: {
        dynamic: { text: '动态组', status: 'Success' },
        static: { text: '静态组', status: 'Default' },
        app: { text: '应用组', status: 'Processing' },
      },
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
    {
      title: '描述',
      dataIndex: 'description',
      width: 300,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 220,
      fixed: 'right',
      render: (_, record) => [
        <Button
          key="members"
          type="link"
          size="small"
          icon={<UserAddOutlined />}
          onClick={() => handleManageMembers(record)}
        >
          成员
        </Button>,
        record.dynamic === 1 && (
          <Button
            key="refresh"
            type="link"
            size="small"
            icon={<SyncOutlined />}
            onClick={() => handleRefreshDynamic(record)}
          >
            刷新
          </Button>
        ),
        <Button
          key="edit"
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={async () => {
            try {
              // 获取完整的用户组数据（包括 groupCode）
              const fullGroupData = await groupsService.get(record.id!);
              setCurrentGroup(fullGroupData);
              setEditModalVisible(true);
            } catch (error: any) {
              console.error('获取用户组详情失败:', error);
              message.error('获取用户组详情失败');
            }
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          key="delete"
          title="确定要删除此用户组吗？"
          onConfirm={() => handleDelete(record.id!)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  // 加载用户组列表
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
      
      console.log('用户组列表请求参数:', requestParams);
      
      const result: any = await groupsService.fetch(requestParams);
      console.log('用户组列表API响应:', result);
      
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

  // 加载组织树数据（用于动态组的组织选择）
  useEffect(() => {
    const loadOrgTree = async () => {
      try {
        const result: any = await organizationsService.tree({});
        let nodes: any[] = [];
        
        // 处理不同的响应格式
        if (result && typeof result === 'object') {
          if (result.data && typeof result.data === 'object') {
            if (result.data.nodes && Array.isArray(result.data.nodes)) {
              nodes = result.data.nodes;
            } else if (Array.isArray(result.data)) {
              nodes = result.data;
            }
          } else if (Array.isArray(result.nodes)) {
            nodes = result.nodes;
          } else if (Array.isArray(result)) {
            nodes = result;
          }
        }
        
        // 转换为 TreeSelect 数据格式
        const convertToTreeSelectData = (nodeList: any[], processedKeys: Set<string> = new Set(), depth: number = 0): any[] => {
          if (!nodeList || !Array.isArray(nodeList) || depth > 100) {
            return [];
          }
          
          return nodeList.map((node) => {
            const value = node.id || node.key || node.orgId || '';
            const title = node.name || node.title || node.orgName || '';
            
            if (value && processedKeys.has(value)) {
              return { value, title: `${title} (循环引用)`, children: [] };
            }
            
            if (value) {
              processedKeys.add(value);
            }
            
            const children = node.children && Array.isArray(node.children) && node.children.length > 0
              ? convertToTreeSelectData(node.children, processedKeys, depth + 1)
              : undefined;
            
            if (value) {
              processedKeys.delete(value);
            }
            
            const result: any = { value, title };
            if (children && children.length > 0) {
              result.children = children;
            }
            return result;
          });
        };
        
        const treeSelectData = convertToTreeSelectData(nodes);
        setOrgTreeSelectData(treeSelectData);
      } catch (error: any) {
        console.error('加载组织树失败:', error);
      }
    };
    
    loadOrgTree();
  }, []);

  // 创建用户组
  const handleCreate = async (values: any) => {
    try {
      // 处理 category 和 dynamic 字段
      const submitData: any = {
        ...values,
        category: values.category || 'static',
      };
      
      // 如果是动态组，处理 orgIdsList
      if (submitData.category === 'dynamic') {
        if (Array.isArray(submitData.orgIdsList)) {
          submitData.orgIdsList = submitData.orgIdsList.join(',');
        }
      } else {
        // 静态组不需要 orgIdsList
        delete submitData.orgIdsList;
        delete submitData.filters;
      }
      
      await groupsService.add(submitData);
      message.success('创建用户组成功');
      setCreateModalVisible(false);
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      console.error('创建用户组失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '创建用户组失败';
      message.error(errorMessage);
      return false;
    }
  };

  // 更新用户组
  const handleUpdate = async (values: any) => {
    if (!currentGroup) return false;
    try {
      // 处理 category 和 dynamic 字段
      const submitData: any = {
        ...currentGroup,
        ...values,
        category: values.category || currentGroup.category || 'static',
        // 确保 id 和 groupCode 都存在
        id: currentGroup.id,
        groupCode: values.groupCode || currentGroup.groupCode,
      };
      
      // 如果是动态组，处理 orgIdsList
      if (submitData.category === 'dynamic') {
        if (Array.isArray(submitData.orgIdsList)) {
          // 过滤空值并连接
          submitData.orgIdsList = submitData.orgIdsList.filter(id => id && id.trim() !== '').join(',');
        } else if (!submitData.orgIdsList && currentGroup.orgIdsList) {
          submitData.orgIdsList = currentGroup.orgIdsList;
        }
      } else {
        // 静态组不需要 orgIdsList
        delete submitData.orgIdsList;
        delete submitData.filters;
      }
      
      await groupsService.update(submitData);
      message.success('更新用户组成功');
      setEditModalVisible(false);
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      console.error('更新用户组失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '更新用户组失败';
      message.error(errorMessage);
      return false;
    }
  };

  // 删除用户组
  const handleDelete = async (id: string) => {
    try {
      await groupsService.delete(id);
      message.success('删除用户组成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('删除用户组失败');
    }
  };

  // 刷新动态组
  const handleRefreshDynamic = async (group: Group) => {
    try {
      await groupsService.refreshDynamic(group.id!);
      message.success('刷新动态组成功');
    } catch (error) {
      message.error('刷新动态组失败');
    }
  };

  // 管理组成员
  const handleManageMembers = async (group: Group) => {
    setCurrentGroup(group);
    setMemberModalVisible(true);
    setMemberLoading(true);

    try {
      // 加载所有用户
      const usersResult: any = await usersService.fetch({
        pageNumber: 1,
        pageSize: 1000,
      });
      
      let users: UserInfo[] = [];
      if (usersResult && typeof usersResult === 'object') {
        if (usersResult.data && typeof usersResult.data === 'object') {
          if (Array.isArray(usersResult.data.rows)) {
            users = usersResult.data.rows;
          } else if (Array.isArray(usersResult.data.records)) {
            users = usersResult.data.records;
          } else if (Array.isArray(usersResult.data)) {
            users = usersResult.data;
          }
        } else if (Array.isArray(usersResult.rows)) {
          users = usersResult.rows;
        } else if (Array.isArray(usersResult.records)) {
          users = usersResult.records;
        } else if (Array.isArray(usersResult)) {
          users = usersResult;
        }
      }
      setAllUsers(users);

      // 加载当前组成员
      const membersResult: any = await groupMembersService.member({
        groupId: group.id,
        pageNumber: 1,
        pageSize: 1000,
      });
      
      let members: GroupMember[] = [];
      if (membersResult && typeof membersResult === 'object') {
        if (membersResult.data && typeof membersResult.data === 'object') {
          if (Array.isArray(membersResult.data.rows)) {
            members = membersResult.data.rows;
          } else if (Array.isArray(membersResult.data.records)) {
            members = membersResult.data.records;
          } else if (Array.isArray(membersResult.data)) {
            members = membersResult.data;
          }
        } else if (Array.isArray(membersResult.rows)) {
          members = membersResult.rows;
        } else if (Array.isArray(membersResult.records)) {
          members = membersResult.records;
        } else if (Array.isArray(membersResult)) {
          members = membersResult;
        }
      }
      
      const memberIds = members.map((m: GroupMember) => m.userId!).filter(Boolean);
      setMemberTargetKeys(memberIds);
    } catch (error: any) {
      console.error('加载成员信息失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '加载成员信息失败';
      message.error(errorMessage);
    } finally {
      setMemberLoading(false);
    }
  };

  // 保存组成员
  const handleSaveMembers = async () => {
    if (!currentGroup) return;

    setMemberLoading(true);
    try {
      // 加载当前组成员
      const membersResult: any = await groupMembersService.member({
        groupId: currentGroup.id,
        pageNumber: 1,
        pageSize: 1000,
      });
      
      let members: GroupMember[] = [];
      if (membersResult && typeof membersResult === 'object') {
        if (membersResult.data && typeof membersResult.data === 'object') {
          if (Array.isArray(membersResult.data.rows)) {
            members = membersResult.data.rows;
          } else if (Array.isArray(membersResult.data.records)) {
            members = membersResult.data.records;
          } else if (Array.isArray(membersResult.data)) {
            members = membersResult.data;
          }
        } else if (Array.isArray(membersResult.rows)) {
          members = membersResult.rows;
        } else if (Array.isArray(membersResult.records)) {
          members = membersResult.records;
        } else if (Array.isArray(membersResult)) {
          members = membersResult;
        }
      }
      
      const currentMemberIds = members.map((m: GroupMember) => m.userId!).filter(Boolean);

      // 计算需要添加和删除的成员
      const toAdd = memberTargetKeys.filter(
        (id) => !currentMemberIds.includes(id)
      );
      const toRemove = currentMemberIds.filter(
        (id) => !memberTargetKeys.includes(id)
      );

      // 添加新成员
      if (toAdd.length > 0) {
        // 获取要添加的用户信息
        const usersToAdd = allUsers.filter((user) => toAdd.includes(user.id!));
        const memberIds = usersToAdd.map((user) => user.id!).join(',');
        const memberNames = usersToAdd.map((user) => user.username || '').join(',');
        
        await groupMembersService.add({
          type: 'USER',
          groupId: currentGroup.id!,
          memberId: memberIds,
          memberName: memberNames,
        });
      }

      // 删除成员
      if (toRemove.length > 0) {
        const memberIdsToDelete = members
          .filter((m: GroupMember) => toRemove.includes(m.userId!))
          .map((m: GroupMember) => m.id!)
          .filter(Boolean);
        
        if (memberIdsToDelete.length > 0) {
          await groupMembersService.delete(memberIdsToDelete);
        }
      }

      message.success('保存成员成功');
      setMemberModalVisible(false);
    } catch (error: any) {
      console.error('保存成员失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '保存成员失败';
      message.error(errorMessage);
    } finally {
      setMemberLoading(false);
    }
  };

  return (
    <PageContainer
      header={{
        title: '用户组管理',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '身份管理' },
            { title: '用户组管理' },
          ],
        },
      }}
    >
      <ProTable<Group>
        columns={columns}
        actionRef={actionRef}
        request={loadGroups}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        dateFormatter="string"
        scroll={{ x: 'max-content' }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            新建用户组
          </Button>,
        ]}
      />

      {/* 创建用户组对话框 */}
      <ModalForm
        title="创建用户组"
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        onFinish={handleCreate}
        formRef={createFormRef}
        width={600}
        initialValues={{
          category: 'static',
        }}
        modalProps={{
          destroyOnClose: true,
        }}
      >
        <ProFormText
          name="groupCode"
          label="组编码"
          placeholder="请输入组编码"
          rules={[{ required: true, message: '请输入组编码' }]}
        />
        <ProFormText
          name="groupName"
          label="组名称"
          placeholder="请输入组名称"
          rules={[{ required: true, message: '请输入组名称' }]}
        />
        <ProFormRadio.Group
          name="category"
          label="类型"
          initialValue="static"
          options={[
            { label: '静态组', value: 'static' },
            { label: '动态组', value: 'dynamic' },
          ]}
        />
        <ProFormDependency name={['category']}>
          {({ category }) => {
            if (category === 'dynamic') {
              return (
                <>
                  <ProFormTreeSelect
                    name="orgIdsList"
                    label="组织范围"
                    placeholder="请选择组织范围"
                    fieldProps={{
                      treeData: orgTreeSelectData,
                      multiple: true,
                      treeCheckable: true,
                      showCheckedStrategy: 'SHOW_PARENT',
                      treeDefaultExpandAll: true,
                      maxTagCount: 3,
                      style: { width: '100%' },
                    }}
                  />
                  <ProFormTextArea
                    name="filters"
                    label="过滤条件"
                    placeholder="请输入过滤条件（JSON格式）"
                    fieldProps={{ rows: 4 }}
                  />
                </>
              );
            }
            return null;
          }}
        </ProFormDependency>
        <ProFormTextArea
          name="description"
          label="描述"
          placeholder="请输入描述信息"
          fieldProps={{ rows: 3 }}
        />
      </ModalForm>

      {/* 编辑用户组对话框 */}
      <ModalForm
        title="编辑用户组"
        open={editModalVisible}
        onOpenChange={setEditModalVisible}
        onFinish={handleUpdate}
        formRef={editFormRef}
        width={600}
        initialValues={{
          ...currentGroup,
          category: currentGroup?.category || 'static',
          // 解析 orgIdsList，处理多个逗号的情况
          orgIdsList: currentGroup?.orgIdsList && currentGroup.orgIdsList.trim() 
            ? currentGroup.orgIdsList.split(',').filter(id => id && id.trim() !== '') 
            : [],
        }}
        modalProps={{
          destroyOnClose: true,
        }}
      >
        <ProFormText
          name="groupCode"
          label="组编码"
          placeholder="请输入组编码"
          rules={[{ required: true, message: '请输入组编码' }]}
        />
        <ProFormText
          name="groupName"
          label="组名称"
          placeholder="请输入组名称"
          rules={[{ required: true, message: '请输入组名称' }]}
        />
        <ProFormRadio.Group
          name="category"
          label="类型"
          options={[
            { label: '静态组', value: 'static' },
            { label: '动态组', value: 'dynamic' },
          ]}
        />
        <ProFormDependency name={['category']}>
          {({ category }) => {
            if (category === 'dynamic') {
              return (
                <>
                  <ProFormTreeSelect
                    name="orgIdsList"
                    label="组织范围"
                    placeholder="请选择组织范围"
                    fieldProps={{
                      treeData: orgTreeSelectData,
                      multiple: true,
                      treeCheckable: true,
                      showCheckedStrategy: 'SHOW_PARENT',
                      treeDefaultExpandAll: true,
                      maxTagCount: 3,
                      style: { width: '100%' },
                    }}
                  />
                  <ProFormTextArea
                    name="filters"
                    label="过滤条件"
                    placeholder="请输入过滤条件（JSON格式）"
                    fieldProps={{ rows: 4 }}
                  />
                </>
              );
            }
            return null;
          }}
        </ProFormDependency>
        <ProFormTextArea
          name="description"
          label="描述"
          placeholder="请输入描述信息"
          fieldProps={{ rows: 3 }}
        />
      </ModalForm>

      {/* 组成员管理对话框 */}
      <Modal
        title={`管理组成员 - ${currentGroup?.groupName || ''}`}
        open={memberModalVisible}
        onCancel={() => setMemberModalVisible(false)}
        onOk={handleSaveMembers}
        width={800}
        confirmLoading={memberLoading}
      >
        <Transfer
          dataSource={allUsers.map((user) => ({
            key: user.id!,
            title: `${user.displayName} (${user.username})`,
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
    </PageContainer>
  );
};

export default GroupList;
