import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  PageContainer,
  ProTable,
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormRadio,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import {
  Button,
  Popconfirm,
  message,
  Modal,
  Transfer,
  Tree,
  Tag,
  Select,
} from 'antd';
import type { DataNode } from 'antd/es/tree';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  KeyOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { Role, RoleMember, UserInfo, Permission, Application, TreeNode } from '@/types/entity';
import rolesService from '@/services/roles.service';
import roleMembersService from '@/services/role-members.service';
import usersService from '@/services/user';
import permissionsService from '@/services/permissions.service';
import resourcesService from '@/services/resources.service';
import appsService from '@/services/apps.service';
import organizationsService from '@/services/organizations.service';
import './RoleList.less';

const RoleList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [selectAppModalVisible, setSelectAppModalVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role>();
  const [selectedAppId, setSelectedAppId] = useState<string>('');
  const [selectedAppName, setSelectedAppName] = useState<string>('');
  const [appList, setAppList] = useState<Application[]>([]);
  const [memberLoading, setMemberLoading] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState(false);
  const [memberTargetKeys, setMemberTargetKeys] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<UserInfo[]>([]);
  const [checkedResourceKeys, setCheckedResourceKeys] = useState<React.Key[]>([]);
  const [resourceTreeData, setResourceTreeData] = useState<DataNode[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [orgTreeSelectData, setOrgTreeSelectData] = useState<any[]>([]);
  const editFormRef = useRef<any>();

  // 从 URL 参数初始化
  useEffect(() => {
    const urlAppId = searchParams.get('appId');
    const urlAppName = searchParams.get('appName');
    if (urlAppId) {
      setSelectedAppId(urlAppId);
      if (urlAppName) {
        setSelectedAppName(decodeURIComponent(urlAppName));
      }
    }
    loadAppList();
    loadOrgTree();
    // 如果有 appId，自动加载资源树（用于权限管理）
    if (urlAppId) {
      loadResourceTreeForPermission(urlAppId);
    }
  }, [searchParams]);

  // 加载资源树（用于权限管理）
  const loadResourceTreeForPermission = async (appId: string) => {
    try {
      const result: any = await resourcesService.tree({ appId, appName: selectedAppName });
      // 处理返回结果：Angular 版本返回 { code: 0, data: TreeNode[] }
      let nodes: TreeNode[] = [];
      if (result && result.data && Array.isArray(result.data)) {
        nodes = result.data;
      } else if (Array.isArray(result)) {
        nodes = result;
      } else if (result && result.data && result.data.rows && Array.isArray(result.data.rows)) {
        nodes = result.data.rows;
      }
      
      const convertToTreeData = (treeNodes: TreeNode[]): DataNode[] => {
        return treeNodes.map((node) => ({
          key: node.id,
          title: node.name,
          isLeaf: node.isLeaf,
          children: node.children ? convertToTreeData(node.children) : [],
        }));
      };
      const treeData = convertToTreeData(nodes);
      setResourceTreeData(treeData);
    } catch (error: any) {
      console.error('加载资源树失败:', error);
      console.error('错误详情:', error?.response?.data || error?.response);
    }
  };

  // 加载应用列表
  const loadAppList = async () => {
    try {
      const result = await appsService.fetch({ 
        pageNumber: 1, 
        pageSize: 1000,
        pageSizeOptions: [1000],
      });
      const data = (result as any).rows || (result as any).records || [];
      setAppList(data);
    } catch (error: any) {
      console.error('加载应用列表失败:', error);
    }
  };

  // 加载组织树
  const loadOrgTree = async () => {
    try {
      const result: any = await organizationsService.tree();
      // 处理返回结果：可能是直接数组，也可能是包装在 data 中
      let nodes: TreeNode[] = [];
      if (Array.isArray(result)) {
        nodes = result;
      } else if (result && Array.isArray(result.data)) {
        nodes = result.data;
      } else if (result && result.data && Array.isArray(result.data.rows)) {
        nodes = result.data.rows;
      }
      
      const convertToTreeSelectData = (treeNodes: TreeNode[]): any[] => {
        return treeNodes.map((node) => ({
          value: node.id,
          title: node.name,
          children: node.children ? convertToTreeSelectData(node.children) : [],
        }));
      };
      setOrgTreeSelectData(convertToTreeSelectData(nodes));
    } catch (error: any) {
      console.error('加载组织树失败:', error);
    }
  };

  // 表格列定义
  const columns: ProColumns<Role>[] = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      width: 200,
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: '角色类别',
      dataIndex: 'category',
      width: 120,
      hideInSearch: true,
      render: (_, record) => {
        const categoryMap: Record<string, { text: string; color: string }> = {
          static: { text: '静态角色', color: 'blue' },
          dynamic: { text: '动态角色', color: 'green' },
          app: { text: '应用角色', color: 'orange' },
        };
        const category = categoryMap[record.category || 'static'] || { text: record.category || '静态角色', color: 'default' };
        return <Tag color={category.color}>{category.text}</Tag>;
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      width: 180,
      hideInSearch: true,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 350,
      fixed: 'right',
      render: (_, record) => {
        // 特殊角色保护
        const protectedRoles = ['ROLE_ADMINISTRATORS', 'ROLE_ALL_USER', 'ROLE_MANAGERS'];
        const canDelete = !protectedRoles.includes(record.roleCode || '');
        
        return [
          <Button
            key="members"
            type="link"
            size="small"
            icon={<UserAddOutlined />}
            onClick={() => {
              navigate(`/permissions/apps/rolemembers?roleId=${record.id}&roleName=${encodeURIComponent(record.roleName || '')}${selectedAppId ? `&appId=${selectedAppId}` : ''}`);
            }}
          >
            成员
          </Button>,
          <Button
            key="permissions"
            type="link"
            size="small"
            icon={<KeyOutlined />}
            onClick={async () => {
              setCurrentRole(record);
              // 如果 URL 中有 appId，直接打开权限管理对话框
              if (selectedAppId) {
                setPermissionModalVisible(true);
                setPermissionLoading(true);
                try {
                  // 加载角色当前权限
                  const permissions = await permissionsService.getByRolePermission({
                    roleId: record.id!,
                    appId: selectedAppId,
                  });
                  const resourceIds = permissions.map((p: Permission) => p.resourceId).filter(Boolean) as string[];
                  setCheckedResourceKeys(resourceIds);
                } catch (error: any) {
                  console.error('加载权限信息失败:', error);
                  message.error('加载权限信息失败');
                } finally {
                  setPermissionLoading(false);
                }
              } else {
                // 如果没有 appId，先选择应用
                setSelectAppModalVisible(true);
              }
            }}
          >
            权限
          </Button>,
          record.category === 'dynamic' && (
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
                // 获取完整的角色数据
                const fullRoleData = await rolesService.get(record.id!);
                setCurrentRole(fullRoleData);
                setEditModalVisible(true);
              } catch (error: any) {
                console.error('获取角色详情失败:', error);
                message.error('获取角色详情失败');
              }
            }}
          >
            编辑
          </Button>,
          canDelete && (
            <Popconfirm
              key="delete"
              title="确定要删除此角色吗？"
              onConfirm={() => handleDelete(record.id!)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          ),
        ];
      },
    },
  ];

  // 加载角色列表
  const loadRoles = async (params: any) => {
    try {
      // 转换参数格式：ProTable 使用 current，但 MaxKey API 使用 pageNumber
      // 优先使用 URL 参数中的 appId 和 appName，如果没有则使用搜索表单中的值
      const requestParams: any = {
        appId: selectedAppId || params.appId || '',
        appName: selectedAppName || params.appName || '',
        roleName: params.roleName || '',
        displayName: params.displayName || '',
        employeeNumber: params.employeeNumber || '',
        startDate: params.startDate || '',
        endDate: params.endDate || '',
        pageNumber: params.current || 1,
        pageSize: params.pageSize || 10,
        pageSizeOptions: [10, 20, 50],
      };

      // 如果有日期范围
      if (params.startDate && params.endDate) {
        requestParams.startDatePicker = new Date(params.startDate).getTime();
        requestParams.endDatePicker = new Date(params.endDate).getTime();
      }

      console.log('角色列表请求参数:', requestParams);
      const result = await rolesService.fetch(requestParams);
      console.log('角色列表 API 响应:', result);
      
      // 处理返回类型：MaxKey API 返回 { records: number, rows: [] }
      let data: any[] = [];
      let total = 0;
      
      if (result && typeof result === 'object') {
        // 检查是否是 { records: number, rows: [] } 格式
        if ('rows' in result && Array.isArray((result as any).rows)) {
          data = (result as any).rows;
          total = (result as any).records || 0;
        } 
        // 检查是否是 { records: [], total: number } 格式（PageResponse）
        else if ('records' in result && Array.isArray((result as any).records)) {
          data = (result as any).records;
          total = (result as any).total || 0;
        }
        // 如果直接是数组
        else if (Array.isArray(result)) {
          data = result;
          total = result.length;
        }
        // 如果是其他格式，尝试提取 data 字段
        else if ('data' in result) {
          const dataValue = (result as any).data;
          if (Array.isArray(dataValue)) {
            data = dataValue;
            total = (result as any).total || dataValue.length;
          } else if (dataValue && typeof dataValue === 'object') {
            // 如果 data 是对象，可能是 { records: number, rows: [] }
            if ('rows' in dataValue && Array.isArray(dataValue.rows)) {
              data = dataValue.rows;
              total = dataValue.records || 0;
            }
          }
        }
      }
      
      console.log('处理后的角色数据:', { data, total });
      
      return {
        data: Array.isArray(data) ? data : [],
        success: true,
        total: typeof total === 'number' ? total : 0,
      };
    } catch (error: any) {
      console.error('加载角色列表失败:', error);
      console.error('错误详情:', error?.response?.data);
      const errorMessage = error?.response?.data?.message || error?.message || '加载角色列表失败';
      message.error(errorMessage);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // 创建角色
  const handleCreate = async (values: any) => {
    try {
      const submitData = {
        ...values,
        category: values.category || 'static',
        appId: selectedAppId || '',
        appName: selectedAppName || '',
        // 处理 orgIdsList
        orgIdsList: values.orgIdsList && Array.isArray(values.orgIdsList)
          ? values.orgIdsList.join(',')
          : values.orgIdsList || '',
      };
      await rolesService.add(submitData);
      message.success('创建角色成功');
      setCreateModalVisible(false);
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      console.error('创建角色失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '创建角色失败';
      message.error(errorMessage);
      return false;
    }
  };

  // 更新角色
  const handleUpdate = async (values: any) => {
    if (!currentRole) return false;
    try {
      const submitData = {
        ...currentRole,
        ...values,
        id: currentRole.id,
        category: values.category || currentRole.category || 'static',
        // 处理 orgIdsList
        orgIdsList: values.orgIdsList && Array.isArray(values.orgIdsList)
          ? values.orgIdsList.join(',')
          : values.orgIdsList || currentRole.orgIdsList || '',
      };
      await rolesService.update(submitData);
      message.success('更新角色成功');
      setEditModalVisible(false);
      setCurrentRole(undefined);
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      console.error('更新角色失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '更新角色失败';
      message.error(errorMessage);
      return false;
    }
  };

  // 删除角色
  const handleDelete = async (id: string) => {
    try {
      await rolesService.delete(id);
      message.success('删除角色成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('删除角色失败');
    }
  };

  // 刷新动态角色
  const handleRefreshDynamic = async (role: Role) => {
    try {
      await rolesService.refreshDynamic(role.id!);
      message.success('刷新动态角色成功');
    } catch (error) {
      message.error('刷新动态角色失败');
    }
  };

  // 管理角色成员
  const handleManageMembers = async (role: Role) => {
    setCurrentRole(role);
    setMemberModalVisible(true);
    setMemberLoading(true);

    try {
      // 加载所有用户
      const usersResult: any = await usersService.fetch({
        current: 1,
        pageSize: 1000,
      });
      const records = usersResult?.records || usersResult?.rows || usersResult?.data?.records || usersResult?.data?.rows || [];
      setAllUsers(records);

      // 加载当前角色成员
      const membersResult = await roleMembersService.fetch({
        roleId: role.id,
        pageNumber: 1,
        pageSize: 1000,
        pageSizeOptions: [1000],
      });
      const data = (membersResult as any).rows || (membersResult as any).records || [];
      const memberIds = data.map((m: RoleMember) => m.userId!);
      setMemberTargetKeys(memberIds);
    } catch (error) {
      message.error('加载成员信息失败');
    } finally {
      setMemberLoading(false);
    }
  };

  // 保存角色成员
  const handleSaveMembers = async () => {
    if (!currentRole) return;

    setMemberLoading(true);
    try {
      // 加载当前角色成员
      const membersResult = await roleMembersService.fetch({
        roleId: currentRole.id,
        pageNumber: 1,
        pageSize: 1000,
        pageSizeOptions: [1000],
      });
      const data = (membersResult as any).rows || (membersResult as any).records || [];
      const currentMemberIds = data.map((m: RoleMember) => m.userId!);

      // 计算需要添加和删除的成员
      const toAdd = memberTargetKeys.filter(
        (id: string) => !currentMemberIds.includes(id)
      );
      const toRemove = currentMemberIds.filter(
        (id: string) => !memberTargetKeys.includes(id)
      );

      // 添加新成员
      for (const userId of toAdd as string[]) {
        await roleMembersService.add({
          roleId: currentRole.id!,
          userIds: [userId],
        });
      }

      // 删除成员
      for (const userId of toRemove) {
        const member = (membersResult.records || []).find(
          (m: RoleMember) => m.userId === userId
        );
        if (member && member.id) {
          await roleMembersService.delete([member.id]);
        }
      }

      message.success('保存成员成功');
      setMemberModalVisible(false);
    } catch (error) {
      message.error('保存成员失败');
    } finally {
      setMemberLoading(false);
    }
  };

  // 选择应用后打开权限管理
  const handleSelectAppForPermission = async (appId: string) => {
    if (!currentRole || !appId) return;
    
    setSelectedAppId(appId);
    const app = appList.find(a => a.id === appId);
    setSelectedAppName(app?.appName || '');
    setSelectAppModalVisible(false);
    setPermissionModalVisible(true);
    setPermissionLoading(true);

    try {
      // 加载资源树
      await loadResourceTreeForPermission(appId);

      // 加载角色当前权限
      const permissions = await permissionsService.getByRolePermission({
        roleId: currentRole.id!,
        appId,
      });
      const resourceIds = permissions.map((p: Permission) => p.resourceId).filter(Boolean) as string[];
      setCheckedResourceKeys(resourceIds);
    } catch (error: any) {
      console.error('加载权限信息失败:', error);
      message.error('加载权限信息失败');
    } finally {
      setPermissionLoading(false);
    }
  };

  // 保存角色权限
  const handleSavePermissions = async () => {
    if (!currentRole || !selectedAppId) {
      message.warning('请先选择应用');
      return;
    }

    setPermissionLoading(true);
    try {
      // 收集所有勾选的节点（包括子节点和半选节点）
      // 注意：Ant Design Tree 的 checkedKeys 已经包含了所有勾选的节点
      // 但我们需要手动收集子节点和半选节点
      const collectAllResourceIds = (nodes: DataNode[], checkedKeys: React.Key[]): string[] => {
        const resourceIds: string[] = [];
        const checkedSet = new Set(checkedKeys.map(k => String(k)));
        
        const traverse = (node: DataNode) => {
          const nodeKey = String(node.key);
          // 如果节点被勾选，添加它和所有子节点
          if (checkedSet.has(nodeKey)) {
            resourceIds.push(nodeKey);
            // 递归添加所有子节点
            if (node.children) {
              const addChildren = (children: DataNode[]) => {
                children.forEach(child => {
                  resourceIds.push(String(child.key));
                  if (child.children) {
                    addChildren(child.children);
                  }
                });
              };
              addChildren(node.children);
            }
          }
          // 继续遍历子节点
          if (node.children) {
            node.children.forEach(traverse);
          }
        };
        
        nodes.forEach(traverse);
        return [...new Set(resourceIds)]; // 去重
      };

      const allResourceIds = collectAllResourceIds(resourceTreeData, checkedResourceKeys);
      
      if (allResourceIds.length === 0) {
        message.warning('请至少选择一个资源');
        return;
      }

      // 构建资源ID字符串（逗号分隔）
      const resourceId = allResourceIds.join(',');

      // 更新角色权限
      await permissionsService.updateRolePermission({
        appId: selectedAppId,
        roleId: currentRole.id!,
        resourceId,
      });

      message.success('保存权限成功');
      setPermissionModalVisible(false);
    } catch (error: any) {
      console.error('保存权限失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '保存权限失败';
      message.error(errorMessage);
    } finally {
      setPermissionLoading(false);
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的角色');
      return;
    }
    try {
      await rolesService.batchDelete(selectedRowKeys as string[]);
      message.success('批量删除成功');
      setSelectedRowKeys([]);
      actionRef.current?.reload();
    } catch (error: any) {
      console.error('批量删除失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '批量删除失败';
      message.error(errorMessage);
    }
  };

  return (
    <PageContainer
      header={{
        title: '角色管理',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '权限管理' },
            { title: '角色管理' },
          ],
        },
      }}
    >
      <ProTable<Role>
        columns={columns}
        actionRef={actionRef}
        request={loadRoles}
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
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            新建角色
          </Button>,
          <Popconfirm
            key="batchDelete"
            title="确定要批量删除选中的角色吗？"
            onConfirm={handleBatchDelete}
            okText="确定"
            cancelText="取消"
            disabled={selectedRowKeys.length === 0}
          >
            <Button
              type="primary"
              danger
              disabled={selectedRowKeys.length === 0}
              icon={<DeleteOutlined />}
            >
              批量删除
            </Button>
          </Popconfirm>,
        ]}
      />

      {/* 选择应用对话框（用于权限管理） */}
      <Modal
        title="选择应用"
        open={selectAppModalVisible}
        onCancel={() => {
          setSelectAppModalVisible(false);
          setCurrentRole(undefined);
        }}
        footer={null}
        width={600}
      >
        <Select
          style={{ width: '100%' }}
          placeholder="请选择应用"
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={appList.map((app) => ({
            label: app.appName,
            value: app.id,
          }))}
          onChange={(value) => {
            if (value && currentRole) {
              handleSelectAppForPermission(value);
            }
          }}
        />
      </Modal>

      {/* 创建角色对话框 */}
      <ModalForm
        title="创建角色"
        open={createModalVisible}
        onOpenChange={(visible) => {
          setCreateModalVisible(visible);
          if (!visible) {
            setCurrentRole(undefined);
          }
        }}
        onFinish={handleCreate}
        width={600}
        initialValues={{
          category: 'static',
          appId: selectedAppId,
          appName: selectedAppName,
        }}
        modalProps={{
          destroyOnClose: true,
        }}
      >
        <ProFormText
          name="appName"
          label="应用名称"
          disabled
        />
        <ProFormText
          name="roleCode"
          label="角色编码"
          placeholder="请输入角色编码"
          rules={[{ required: true, message: '请输入角色编码' }]}
        />
        <ProFormText
          name="roleName"
          label="角色名称"
          placeholder="请输入角色名称"
          rules={[{ required: true, message: '请输入角色名称' }]}
        />
        <ProFormRadio.Group
          name="category"
          label="角色类别"
          initialValue="static"
          options={[
            { label: '静态角色', value: 'static' },
            { label: '动态角色', value: 'dynamic' },
            { label: '应用角色', value: 'app', disabled: true },
          ]}
        />
        <ProFormTreeSelect
          name="orgIdsList"
          label="组织范围"
          fieldProps={{
            treeData: orgTreeSelectData,
            multiple: true,
            treeCheckable: true,
            showCheckedStrategy: 'SHOW_PARENT',
            placeholder: '请选择组织范围（动态角色）',
            allowClear: true,
          }}
          dependencies={['category']}
          shouldUpdate={(prevValues: any, currentValues: any) => {
            return prevValues.category !== currentValues.category;
          }}
          noStyle
        >
          {({ category }: any) => {
            if (category === 'dynamic') {
              return (
                <ProFormTreeSelect
                  name="orgIdsList"
                  label="组织范围"
                  fieldProps={{
                    treeData: orgTreeSelectData,
                    multiple: true,
                    treeCheckable: true,
                    showCheckedStrategy: 'SHOW_PARENT',
                    placeholder: '请选择组织范围',
                    allowClear: true,
                  }}
                />
              );
            }
            return null;
          }}
        </ProFormTreeSelect>
        <ProFormTextArea
          name="filters"
          label="过滤条件"
          placeholder="请输入过滤条件（动态角色，如：USERTYPE='EMPLOYEE'）"
          dependencies={['category']}
          shouldUpdate={(prevValues: any, currentValues: any) => {
            return prevValues.category !== currentValues.category;
          }}
          noStyle
        >
          {({ category }: any) => {
            if (category === 'dynamic') {
              return (
                <ProFormTextArea
                  name="filters"
                  label="过滤条件"
                  placeholder="请输入过滤条件（如：USERTYPE='EMPLOYEE'）"
                  fieldProps={{ rows: 3 }}
                />
              );
            }
            return null;
          }}
        </ProFormTextArea>
        <ProFormTextArea
          name="description"
          label="描述"
          placeholder="请输入描述信息"
          fieldProps={{ rows: 3 }}
        />
      </ModalForm>

      {/* 编辑角色对话框 */}
      <ModalForm
        title="编辑角色"
        open={editModalVisible}
        onOpenChange={(visible) => {
          setEditModalVisible(visible);
          if (!visible) {
            setCurrentRole(undefined);
          }
        }}
        onFinish={handleUpdate}
        formRef={editFormRef}
        width={600}
        initialValues={{
          ...currentRole,
          category: currentRole?.category || 'static',
          orgIdsList: currentRole?.orgIdsList && currentRole.orgIdsList.trim() 
            ? currentRole.orgIdsList.split(',').filter(id => id && id.trim() !== '') 
            : [],
        }}
        modalProps={{
          destroyOnClose: true,
        }}
      >
        <ProFormText
          name="roleCode"
          label="角色编码"
          placeholder="请输入角色编码"
          rules={[{ required: true, message: '请输入角色编码' }]}
          disabled
        />
        <ProFormText
          name="roleName"
          label="角色名称"
          placeholder="请输入角色名称"
          rules={[{ required: true, message: '请输入角色名称' }]}
        />
        <ProFormRadio.Group
          name="category"
          label="角色类别"
          options={[
            { label: '静态角色', value: 'static' },
            { label: '动态角色', value: 'dynamic' },
            { label: '应用角色', value: 'app', disabled: true },
          ]}
        />
        <ProFormTreeSelect
          name="orgIdsList"
          label="组织范围"
          fieldProps={{
            treeData: orgTreeSelectData,
            multiple: true,
            treeCheckable: true,
            showCheckedStrategy: 'SHOW_PARENT',
            placeholder: '请选择组织范围（动态角色）',
            allowClear: true,
          }}
          dependencies={['category']}
          shouldUpdate={(prevValues: any, currentValues: any) => {
            return prevValues.category !== currentValues.category;
          }}
          noStyle
        >
          {({ category }: any) => {
            if (category === 'dynamic') {
              return (
                <ProFormTreeSelect
                  name="orgIdsList"
                  label="组织范围"
                  fieldProps={{
                    treeData: orgTreeSelectData,
                    multiple: true,
                    treeCheckable: true,
                    showCheckedStrategy: 'SHOW_PARENT',
                    placeholder: '请选择组织范围',
                    allowClear: true,
                  }}
                />
              );
            }
            return null;
          }}
        </ProFormTreeSelect>
        <ProFormTextArea
          name="filters"
          label="过滤条件"
          placeholder="请输入过滤条件（动态角色，如：USERTYPE='EMPLOYEE'）"
          dependencies={['category']}
          shouldUpdate={(prevValues: any, currentValues: any) => {
            return prevValues.category !== currentValues.category;
          }}
          noStyle
        >
          {({ category }: any) => {
            if (category === 'dynamic') {
              return (
                <ProFormTextArea
                  name="filters"
                  label="过滤条件"
                  placeholder="请输入过滤条件（如：USERTYPE='EMPLOYEE'）"
                  fieldProps={{ rows: 3 }}
                />
              );
            }
            return null;
          }}
        </ProFormTextArea>
        <ProFormTextArea
          name="description"
          label="描述"
          placeholder="请输入描述信息"
          fieldProps={{ rows: 3 }}
        />
      </ModalForm>

      {/* 角色成员管理对话框 */}
      <Modal
        title={`管理角色成员 - ${currentRole?.roleName || ''}`}
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

      {/* 角色权限管理对话框 */}
      <Modal
        title={`管理角色权限 - ${currentRole?.roleName || ''} (${selectedAppName || ''})`}
        open={permissionModalVisible}
        onCancel={() => {
          setPermissionModalVisible(false);
          setCurrentRole(undefined);
          setSelectedAppId('');
          setSelectedAppName('');
        }}
        onOk={handleSavePermissions}
        width={800}
        confirmLoading={permissionLoading}
      >
        {selectedAppId ? (
          <Tree
            checkable
            showLine
            blockNode
            defaultExpandAll
            checkedKeys={checkedResourceKeys}
            onCheck={(keys: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }) => {
              // 处理半选状态
              if (Array.isArray(keys)) {
                setCheckedResourceKeys(keys);
              } else {
                setCheckedResourceKeys(keys.checked || []);
              }
            }}
            treeData={resourceTreeData}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            请先选择应用
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default RoleList;
