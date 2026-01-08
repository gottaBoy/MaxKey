import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  PageContainer,
  ProTable,
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProForm,
  ProCard,
} from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import {
  Button,
  Popconfirm,
  message,
  Modal,
  Select,
  Space,
  Row,
  Col,
  Tree,
  Input,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FolderOutlined,
  FileOutlined,
} from '@ant-design/icons';
import type { Accounts, Application, UserInfo } from '@/types/entity';
import type { DataNode } from 'antd/es/tree';
import accountsService from '@/services/accounts.service';
import appsService from '@/services/apps.service';
import usersService from '@/services/user';
import organizationsService from '@/services/organizations.service';
import accountsStrategyService from '@/services/accounts-strategy.service';

const AccountsList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [appList, setAppList] = useState<Application[]>([]);
  const [selectAppModalVisible, setSelectAppModalVisible] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string>('');
  const [selectedAppName, setSelectedAppName] = useState<string>('');
  const [createFormRef] = ProForm.useForm();
  const [selectUserModalVisible, setSelectUserModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  // 用户选择弹框相关状态
  const [orgTreeData, setOrgTreeData] = useState<DataNode[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [userSearchParams, setUserSearchParams] = useState<any>({});
  const [accountSearchParams, setAccountSearchParams] = useState<any>({});
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const userModalActionRef = useRef<ActionType>();

  useEffect(() => {
    loadAppList();
  }, [searchParams]);

  // 加载组织树（用于用户选择弹框）
  const loadOrgTree = async () => {
    try {
      const result: any = await organizationsService.tree();
      
      // 处理响应数据格式
      let treeDataArray: any[] = [];
      
      // 情况1: 直接是数组
      if (Array.isArray(result)) {
        treeDataArray = result;
      }
      // 情况2: 包含 rootNode 和 nodes 的对象（MaxKey 标准格式）
      else if (result && typeof result === 'object' && result.rootNode && result.nodes) {
        const rootNode = result.rootNode;
        const nodes = result.nodes || [];
        
        // 按照 Angular 版本的逻辑构建树
        const buildTree = (parentNode: any): any[] => {
          const children: any[] = [];
          
          for (const node of nodes) {
            const parentKey = node.parentKey || node.parentId || node.parent_id;
            const nodeKey = node.key || node.id;
            
            if (nodeKey && nodeKey !== parentNode.key && parentKey === parentNode.key) {
              const childNode: any = {
                id: nodeKey,
                name: node.title || node.name,
                key: nodeKey,
                title: node.title || node.name,
                isLeaf: true,
              };
              
              const grandChildren = buildTree(childNode);
              if (grandChildren.length > 0) {
                childNode.children = grandChildren;
                childNode.isLeaf = false;
                parentNode.isLeaf = false;
              }
              
              children.push(childNode);
            }
          }
          
          return children;
        };
        
        const rootNodeData: any = {
          id: rootNode.key,
          name: rootNode.title,
          key: rootNode.key,
          title: rootNode.title,
          isLeaf: false,
        };
        
        const children = buildTree(rootNodeData);
        if (children.length > 0) {
          rootNodeData.children = children;
        }
        
        treeDataArray = [rootNodeData];
      }
      // 情况3: 包含 data 属性的对象
      else if (result && typeof result === 'object' && result.data) {
        if (Array.isArray(result.data)) {
          treeDataArray = result.data;
        } else if (result.data.rootNode && result.data.nodes) {
          const rootNode = result.data.rootNode;
          const nodes = result.data.nodes || [];
          
          const buildTree = (parentNode: any): any[] => {
            const children: any[] = [];
            
            for (const node of nodes) {
              const parentKey = node.parentKey || node.parentId || node.parent_id;
              const nodeKey = node.key || node.id;
              
              if (nodeKey && nodeKey !== parentNode.key && parentKey === parentNode.key) {
                const childNode: any = {
                  id: nodeKey,
                  name: node.title || node.name,
                  key: nodeKey,
                  title: node.title || node.name,
                  isLeaf: true,
                };
                
                const grandChildren = buildTree(childNode);
                if (grandChildren.length > 0) {
                  childNode.children = grandChildren;
                  childNode.isLeaf = false;
                  parentNode.isLeaf = false;
                }
                
                children.push(childNode);
              }
            }
            
            return children;
          };
          
          const rootNodeData: any = {
            id: rootNode.key,
            name: rootNode.title,
            key: rootNode.key,
            title: rootNode.title,
            isLeaf: false,
          };
          
          const children = buildTree(rootNodeData);
          if (children.length > 0) {
            rootNodeData.children = children;
          }
          
          treeDataArray = [rootNodeData];
        }
      }
      
      // 转换为 DataNode 格式
      const convertToDataNode = (nodes: any[]): DataNode[] => {
        return nodes.map(node => ({
          key: String(node.key || node.id || ''),
          title: String(node.title || node.name || ''),
          isLeaf: node.isLeaf !== undefined ? node.isLeaf : !node.children || node.children.length === 0,
          children: node.children && node.children.length > 0 ? convertToDataNode(node.children) : undefined,
        }));
      };
      
      const dataNodes = convertToDataNode(treeDataArray);
      setOrgTreeData(dataNodes);
      
      // 默认展开第一层
      const firstLevelKeys: React.Key[] = [];
      dataNodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          firstLevelKeys.push(node.key);
        }
      });
      setExpandedKeys(firstLevelKeys);
    } catch (error: any) {
      console.error('加载组织树失败:', error);
    }
  };

  const loadAppList = async () => {
    try {
      const result = await appsService.fetch({ 
        pageNumber: 1, 
        pageSize: 1000,
      });
      const data = (result as any).rows || (result as any).records || [];
      setAppList(data);
    } catch (error: any) {
      console.error('加载应用列表失败:', error);
    }
  };


  const handleDelete = async (id: string) => {
    try {
      await accountsService.delete(id);
      message.success('删除成功');
      actionRef.current?.reload();
    } catch (error: any) {
      message.error('删除失败');
    }
  };

  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的记录');
      return;
    }
    try {
      const ids = selectedRowKeys.join(',');
      await accountsService.delete(ids);
      message.success(`成功删除 ${selectedRowKeys.length} 条记录`);
      setSelectedRowKeys([]);
      actionRef.current?.reload();
    } catch (error: any) {
      message.error('批量删除失败');
    }
  };

  const handleSelectApp = () => {
    setSelectAppModalVisible(true);
  };

  const handleAppSelected = async (appId: string) => {
    const app = appList.find(a => a.id === appId);
    if (app) {
      setSelectedAppId(app.id);
      setSelectedAppName(app.appName);
      
      // 查询该应用对应的账号策略
      try {
        const strategyResult: any = await accountsStrategyService.fetch({
          appId: app.id,
          pageNumber: 1,
          pageSize: 1,
        });
        
        const strategies = (strategyResult as any)?.rows || (strategyResult as any)?.records || [];
        let strategyId = '';
        let strategyName = '';
        
        if (strategies.length > 0) {
          strategyId = strategies[0].id;
          strategyName = strategies[0].name || '';
        }
        
        // 更新表单中的应用信息和策略信息
        createFormRef.setFieldsValue({
          appId: app.id,
          appName: app.appName,
          strategyId: strategyId,
          strategyName: strategyName,
        });
      } catch (error: any) {
        console.error('查询账号策略失败:', error);
        // 即使查询失败，也设置应用信息
        createFormRef.setFieldsValue({
          appId: app.id,
          appName: app.appName,
        });
      }
      
      // 更新搜索表单中的应用名称
      actionRef.current?.reload();
    }
    setSelectAppModalVisible(false);
  };

  const handleSelectUser = () => {
    // 加载组织树
    if (orgTreeData.length === 0) {
      loadOrgTree();
    }
    setSelectUserModalVisible(true);
  };

  const handleUserSelected = (user: UserInfo) => {
    createFormRef.setFieldsValue({
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
    });
    // 不关闭弹框，允许再次选择
    // setSelectUserModalVisible(false);
  };

  const handleConfirmUser = () => {
    // 确认选择用户，关闭弹框
    setSelectUserModalVisible(false);
  };

  const handleOrgTreeSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      setSelectedDepartmentId(selectedKeys[0] as string);
      userModalActionRef.current?.reload();
    } else {
      setSelectedDepartmentId('');
    }
  };

  const handleGenerateUsername = async () => {
    const formValues = createFormRef.getFieldsValue();
    if (!formValues.appId || !formValues.userId) {
      message.warning('请先选择应用和用户');
      return;
    }
    
    // 如果没有 strategyId，尝试根据 appId 查询
    let strategyId = formValues.strategyId;
    if (!strategyId && formValues.appId) {
      try {
        const strategyResult: any = await accountsStrategyService.fetch({
          appId: formValues.appId,
          pageNumber: 1,
          pageSize: 1,
        });
        
        const strategies = (strategyResult as any)?.rows || (strategyResult as any)?.records || [];
        if (strategies.length > 0) {
          strategyId = strategies[0].id;
          // 更新表单中的策略信息
          createFormRef.setFieldsValue({
            strategyId: strategyId,
            strategyName: strategies[0].name || '',
          });
        } else {
          message.warning('该应用没有配置账号策略，无法生成应用账号');
          return;
        }
      } catch (error: any) {
        console.error('查询账号策略失败:', error);
        message.error('查询账号策略失败，无法生成应用账号');
        return;
      }
    }
    
    if (!strategyId) {
      message.warning('请先选择应用和用户');
      return;
    }
    
    try {
      const relatedUsername = await accountsService.generate({
        strategyId: strategyId,
        userId: formValues.userId,
      });
      createFormRef.setFieldsValue({ relatedUsername });
    } catch (error: any) {
      message.error('生成应用账号失败');
    }
  };

  const handleGeneratePassword = async () => {
    try {
      const password = await usersService.generatePassword();
      createFormRef.setFieldsValue({ relatedPassword: password });
    } catch (error: any) {
      message.error('生成密码失败');
    }
  };



  const columns: ProColumns<Accounts>[] = [
    {
      title: '应用名称',
      dataIndex: 'appName',
      width: 200,
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 150,
    },
    {
      title: '显示名称',
      dataIndex: 'displayName',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '应用名称',
      dataIndex: 'appName',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '关联用户名',
      dataIndex: 'relatedUsername',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      fixed: 'right',
      render: (_, record) => [
        <Popconfirm
          key="delete"
          title="确定要删除吗？"
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

  const loadData = async (params: any) => {
    try {
      const requestParams: any = {
        username: accountSearchParams.username || params.username || '',
        displayName: accountSearchParams.displayName || params.displayName || '',
        employeeNumber: params.employeeNumber || '',
        appId: selectedAppId || params.appId || '',
        appName: selectedAppName || params.appName || '',
        startDate: params.startDate || '',
        endDate: params.endDate || '',
        pageNumber: params.current || 1,
        pageSize: params.pageSize || 10,
      };

      // 如果有日期范围，添加时间戳参数
      if (params.startDate && params.endDate) {
        requestParams.startDatePicker = new Date(params.startDate).getTime();
        requestParams.endDatePicker = new Date(params.endDate).getTime();
      }

      // 移除空值参数
      Object.keys(requestParams).forEach(key => {
        if (requestParams[key] === '' || requestParams[key] === null || requestParams[key] === undefined) {
          delete requestParams[key];
        }
      });

      const result: any = await accountsService.fetch(requestParams);
      
      let rows: Accounts[] = [];
      let records = 0;
      
      if (result) {
        if (Array.isArray(result.rows)) {
          rows = result.rows;
          records = result.records || result.total || 0;
        } else if (result.data && Array.isArray(result.data.rows)) {
          rows = result.data.rows;
          records = result.data.records || result.data.total || 0;
        } else if (Array.isArray(result.records)) {
          rows = result.records;
          records = result.total || 0;
        } else if (Array.isArray(result.data)) {
          rows = result.data;
          records = result.total || result.records || 0;
        } else if (Array.isArray(result)) {
          rows = result;
        }
      }

      return {
        data: rows,
        success: true,
        total: records,
      };
    } catch (error: any) {
      console.error('加载账号列表失败:', error);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  const handleAdd = () => {
    setCreateModalVisible(true);
    setPasswordVisible(false); // 重置密码可见性
    // 使用 setTimeout 确保模态框打开后再重置表单
    setTimeout(() => {
      createFormRef.resetFields();
      createFormRef.setFieldsValue({
        createType: 'manual',
        status: 1,
      });
    }, 100);
  };

  const handleSubmit = async (values: any) => {
    try {
      await accountsService.add(values);
      message.success('创建成功');
      setCreateModalVisible(false);
      actionRef.current?.reload();
    } catch (error: any) {
      message.error('创建失败');
    }
  };

  return (
    <PageContainer
      header={{
        // title: '账号管理',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '配置管理' },
            { title: '账号管理' },
          ],
        },
      }}
    >
      {/* 搜索表单 */}
      <ProCard bordered={false} style={{ marginBottom: 16 }} bodyStyle={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>应用名称：</span>
              <Select
                  style={{ width: 220 }}
                  placeholder="请选择应用"
                  value={selectedAppId}
                  onChange={(value) => {
                    setSelectedAppId(value);
                    const app = appList.find(a => a.id === value);
                    setSelectedAppName(app?.appName || '');
                    actionRef.current?.reload();
                  }}
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={appList.map((app) => ({
                    label: app.appName,
                    value: app.id,
                  }))}
                />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>用户名：</span>
              <Input
                style={{ width: 220 }}
                placeholder="请输入用户名"
                value={accountSearchParams.username || ''}
                onChange={(e) => {
                  setAccountSearchParams({ ...accountSearchParams, username: e.target.value });
                }}
                onPressEnter={() => {
                  actionRef.current?.reload();
                }}
              />
          </div>
          <Button type="primary" onClick={() => actionRef.current?.reload()}>
              查询
          </Button>
          <Button onClick={() => {
            setAccountSearchParams({});
            setSelectedAppId('');
            setSelectedAppName('');
            // 确保 reload 在状态更新后执行
            setTimeout(() => actionRef.current?.reload(), 0);
          }}>
              重置
          </Button>
        </div>
      </ProCard>

      <ProTable<Accounts>
        columns={columns}
        actionRef={actionRef}
        request={loadData}
        rowKey="id"
        search={false}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
        }}
        scroll={{ x: 'max-content' }}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增
          </Button>,
          <Popconfirm
            key="batchDelete"
            title="确定要批量删除吗？"
            onConfirm={handleBatchDelete}
            disabled={selectedRowKeys.length === 0}
          >
            <Button danger disabled={selectedRowKeys.length === 0}>
              批量删除
            </Button>
          </Popconfirm>,
        ]}
        form={{
          onValuesChange: (changedValues) => {
            // 如果应用名称被清空，重置选中的应用
            if (changedValues.appName === undefined || changedValues.appName === '') {
              setSelectedAppId('');
              setSelectedAppName('');
            }
          },
        }}
      />

      {/* 创建表单 */}
      <ModalForm
        title="创建账号"
        form={createFormRef}
        open={createModalVisible}
        onOpenChange={(visible) => {
          if (!visible) {
            setCreateModalVisible(false);
            setPasswordVisible(false);
            createFormRef.resetFields();
          }
        }}
        onFinish={handleSubmit}
        width={600}
        modalProps={{
          destroyOnClose: true,
          zIndex: 1000,
          getContainer: false,
        }}
        key="create"
      >
        {/* 姓名 - 始终显示选择按钮，可以重新选择 */}
        <ProFormText
          name="displayName"
          label="姓名"
          rules={[{ required: true, message: '请选择用户' }]}
          fieldProps={{
            readOnly: true,
            addonAfter: (
              <Button type="primary" onClick={handleSelectUser}>
                选择
              </Button>
            ),
          }}
        />
        <ProFormText name="userId" hidden />
        
        {/* 登录账号 - 始终禁用 */}
        <ProFormText
          name="username"
          label="登录账号"
          fieldProps={{
            disabled: true,
          }}
        />
        
        {/* 应用名称 - 下拉选择 */}
        <ProFormSelect
          name="appId"
          label="应用名称"
          rules={[{ required: true, message: '请选择应用' }]}
          showSearch
          options={appList.map((app) => ({
            label: app.appName,
            value: app.id,
          }))}
          fieldProps={{
            optionFilterProp: 'label',
            onChange: async (value) => {
              const app = appList.find((a) => a.id === value);
              if (app) {
                createFormRef.setFieldsValue({
                  appName: app.appName,
                  strategyId: undefined,
                  strategyName: undefined,
                });
                
                // 查询该应用对应的账号策略
                try {
                  const strategyResult: any = await accountsStrategyService.fetch({
                    appId: app.id,
                    pageNumber: 1,
                    pageSize: 1,
                  });
                  
                  const strategies = (strategyResult as any)?.rows || (strategyResult as any)?.records || [];
                  if (strategies.length > 0) {
                    createFormRef.setFieldsValue({
                      strategyId: strategies[0].id,
                      strategyName: strategies[0].name || '',
                    });
                  }
                } catch (error: any) {
                  console.error('查询账号策略失败:', error);
                }
              }
            }
          }}
        />
        <ProFormText name="appName" hidden />
        <ProFormText name="strategyId" hidden />
        
        {/* 应用账号 - 可编辑，带生成按钮 */}
        <ProFormText
          name="relatedUsername"
          label="应用账号"
          rules={[{ required: true, message: '请输入应用账号' }]}
          fieldProps={{
            addonAfter: (
              <Button type="primary" onClick={handleGenerateUsername}>
                生成
              </Button>
            ),
          }}
        />
        
        {/* 应用密码 - 带生成按钮和显示/隐藏按钮 */}
        <ProFormText.Password
          name="relatedPassword"
          label="应用密码"
          rules={[{ required: true, message: '请输入应用密码' }]}
          fieldProps={{
            visibilityToggle: {
              visible: passwordVisible,
              onVisibleChange: setPasswordVisible,
            },
            addonAfter: (
              <Button type="primary" onClick={handleGeneratePassword}>
                生成
              </Button>
            ),
            iconRender: (visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />),
          }}
        />
      </ModalForm>

      {/* 选择应用对话框 */}
      <Modal
        title="选择应用"
        open={selectAppModalVisible}
        onCancel={() => setSelectAppModalVisible(false)}
        footer={null}
        width={600}
        zIndex={2000} // 设置更高的 z-index，确保显示在主表单之上
        getContainer={false} // 使用默认容器
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
          onChange={handleAppSelected}
        />
      </Modal>

      {/* 选择用户对话框 - 左右结构 */}
      <Modal
        title="选择用户"
        open={selectUserModalVisible}
        onCancel={() => setSelectUserModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setSelectUserModalVisible(false)}>
            取消
          </Button>,
          <Button key="confirm" type="primary" onClick={handleConfirmUser}>
            确认
          </Button>,
        ]}
        width={1000}
        zIndex={2000}
        getContainer={false}
      >
        <Row gutter={16}>
          {/* 左侧：组织结构树 */}
          <Col span={6}>
            <ProCard
              title="组织结构"
              className="grid-border"
              bodyStyle={{ padding: '12px', maxHeight: '500px', overflow: 'auto' }}
            >
              {orgTreeData.length > 0 ? (
                <Tree
                  showLine={false}
                  blockNode
                  treeData={orgTreeData}
                  expandedKeys={expandedKeys}
                  onExpand={setExpandedKeys}
                  selectedKeys={selectedDepartmentId ? [selectedDepartmentId] : []}
                  onSelect={handleOrgTreeSelect}
                  icon={(props: any) => {
                    return props.isLeaf ? (
                      <FileOutlined />
                    ) : (
                      <FolderOutlined />
                    );
                  }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#999' }}>
                  加载中...
                </div>
              )}
            </ProCard>
          </Col>

          {/* 右侧：用户列表 */}
          <Col span={18}>
            <ProCard
              className="grid-border"
              bodyStyle={{ padding: '12px' }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {/* 搜索表单 */}
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={12} md={8}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <span style={{ fontSize: '13px' }}>用户名</span>
                      <Input
                        placeholder="用户名"
                        value={userSearchParams.username || ''}
                        onChange={(e) => {
                          setUserSearchParams({ ...userSearchParams, username: e.target.value });
                        }}
                        onPressEnter={() => {
                          userModalActionRef.current?.reload();
                        }}
                      />
                    </Space>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <span style={{ fontSize: '13px' }}>显示名称</span>
                      <Input
                        placeholder="显示名称"
                        value={userSearchParams.displayName || ''}
                        onChange={(e) => {
                          setUserSearchParams({ ...userSearchParams, displayName: e.target.value });
                        }}
                        onPressEnter={() => {
                          userModalActionRef.current?.reload();
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
                            userModalActionRef.current?.reload();
                          }}
                        >
                          查询
                        </Button>
                        <Button
                          onClick={() => {
                            setUserSearchParams({});
                            userModalActionRef.current?.reload();
                          }}
                        >
                          重置
                        </Button>
                      </Space>
                    </Space>
                  </Col>
                </Row>

                <ProTable<UserInfo>
                  actionRef={userModalActionRef}
                  columns={[
                    {
                      title: '用户名',
                      dataIndex: 'username',
                      width: 150,
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
                      hideInSearch: true,
                    },
                    {
                      title: '部门',
                      dataIndex: 'department',
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
                        return record.gender === 1 ? '女' : '男';
                      },
                    },
                  ]}
                  request={async (params) => {
                    try {
                      const requestParams: any = {
                        username: userSearchParams.username || params.username || '',
                        displayName: userSearchParams.displayName || params.displayName || '',
                        departmentId: selectedDepartmentId || '',
                        pageNumber: params.current || 1,
                        pageSize: params.pageSize || 10,
                      };

                      // 移除空值参数
                      Object.keys(requestParams).forEach(key => {
                        if (requestParams[key] === '' || requestParams[key] === null || requestParams[key] === undefined) {
                          delete requestParams[key];
                        }
                      });

                      const result: any = await usersService.fetch(requestParams);
                      
                      let rows: UserInfo[] = [];
                      let records = 0;
                      
                      if (result) {
                        if (Array.isArray(result.rows)) {
                          rows = result.rows;
                          records = result.records || result.total || 0;
                        } else if (result.data && Array.isArray(result.data.rows)) {
                          rows = result.data.rows;
                          records = result.data.records || result.data.total || 0;
                        } else if (Array.isArray(result.records)) {
                          rows = result.records;
                          records = result.total || 0;
                        } else if (Array.isArray(result.data)) {
                          rows = result.data;
                          records = result.total || result.records || 0;
                        } else if (Array.isArray(result)) {
                          rows = result;
                        }
                      }

                      return {
                        data: rows,
                        success: true,
                        total: records,
                      };
                    } catch (error: any) {
                      console.error('加载用户列表失败:', error);
                      return {
                        data: [],
                        success: false,
                        total: 0,
                      };
                    }
                  }}
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
                  rowSelection={{
                    type: 'radio',
                    onChange: (_selectedRowKeys, selectedRows) => {
                      if (selectedRows.length > 0) {
                        handleUserSelected(selectedRows[0] as UserInfo);
                      }
                    },
                  }}
                />
              </Space>
            </ProCard>
          </Col>
        </Row>
      </Modal>
    </PageContainer>
  );
};

export default AccountsList;

