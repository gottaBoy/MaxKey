import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  PageContainer,
  ProCard,
  ProTable,
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
  ProFormDigit,
  ProFormTreeSelect,
  ProFormRadio,
} from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import {
  Button,
  Space,
  Popconfirm,
  message,
  Tree,
  Row,
  Col,
  Select,
  Tag,
} from 'antd';
import type { DataNode } from 'antd/es/tree';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  FileOutlined,
} from '@ant-design/icons';
import type { Resource, Application } from '@/types/entity';
import resourcesService from '@/services/resources.service';
import appsService from '@/services/apps.service';
import './ResourcesList.less';

const ResourcesList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [selectedResourceId, setSelectedResourceId] = useState<string>();
  const [appId, setAppId] = useState<string>();
  const [appName, setAppName] = useState<string>();
  const [appList, setAppList] = useState<Application[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Resource>();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [treeSelectData, setTreeSelectData] = useState<any[]>([]);

  // 加载应用列表
  const loadAppList = async () => {
    try {
      const params = { 
        pageNumber: 1, 
        pageSize: 1000,
        pageSizeOptions: [1000],
      };
      console.log('loadAppList: 请求参数', params);
      const result: any = await appsService.fetch(params);
      console.log('loadAppList: 返回结果', result);
      
      // 处理返回结果：可能是 { rows: [], records: number } 或 { records: [], total: number }
      const data = (result as any)?.rows || (result as any)?.records || [];
      setAppList(Array.isArray(data) ? data : []);
      console.log('loadAppList: 解析后的应用列表', Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('加载应用列表失败:', error);
      console.error('错误详情:', error?.response?.data || error?.response);
      console.error('错误堆栈:', error?.stack);
      // 不显示错误消息，因为响应拦截器已经显示了
      // 只在控制台记录错误
    }
  };

  // 加载资源树
  const loadResourceTree = async () => {
    if (!appId) {
      console.log('loadResourceTree: appId 为空，跳过加载');
      return;
    }
    setLoading(true);
    try {
      const params = { appId, appName: appName || '' };
      console.log('loadResourceTree: 请求参数', params);
      const result: any = await resourcesService.tree(params);
      console.log('loadResourceTree: 返回结果 (原始)', result);
      
      // API 返回格式: { rootNode: {...}, nodeCount: number, nodes: [...] }
      // 响应拦截器已经提取了 data 部分，所以 result 应该是 { rootNode, nodeCount, nodes }
      if (!result || !result.rootNode) {
        console.warn('loadResourceTree: result 中没有 rootNode', result);
        setTreeData([]);
        setTreeSelectData([]);
        setExpandedKeys([]);
        return;
      }
      
      const rootNode = result.rootNode;
      const flatNodes = result.nodes || [];
      
      console.log('loadResourceTree: rootNode', rootNode);
      console.log('loadResourceTree: flatNodes 数量', flatNodes.length);
      console.log('loadResourceTree: nodeCount', result.nodeCount);
      
      // 按照 Angular TreeNodes.buildTree 的逻辑构建树
      const treeNodes = buildTreeFromFlatNodes(rootNode, flatNodes);
      console.log('loadResourceTree: 构建后的树节点', treeNodes);
      
      setTreeData(treeNodes);
      
      // 构建 TreeSelect 数据格式
      const treeSelectNodes = buildTreeSelectFromFlatNodes(rootNode, flatNodes);
      setTreeSelectData(treeSelectNodes);
      
      // 默认展开根节点
      if (rootNode.key) {
        setExpandedKeys([rootNode.key]);
      }
      
      console.log('loadResourceTree: 资源树加载完成，treeData长度:', treeNodes.length);
    } catch (error: any) {
      console.error('加载资源树失败:', error);
      console.error('错误详情:', error?.response?.data || error?.response);
      console.error('错误堆栈:', error?.stack);
      // 不显示错误消息，因为响应拦截器已经显示了
      // 只在控制台记录错误
    } finally {
      setLoading(false);
    }
  };

  // 从扁平节点数组构建树结构（按照 Angular TreeNodes.buildTree 的逻辑）
  const buildTreeFromFlatNodes = (rootNode: any, flatNodes: any[]): DataNode[] => {
    if (!rootNode) {
      return [];
    }
    
    // 转换根节点
    const rootDataNode: DataNode = {
      key: String(rootNode.key || rootNode.id || ''),
      title: String(rootNode.title || rootNode.name || ''),
      isLeaf: rootNode.isLeaf !== undefined ? rootNode.isLeaf : false,
      children: [],
    };
    
    // 递归构建子树
    const buildChildren = (parentNode: DataNode, parentKey: string) => {
      const children: DataNode[] = [];
      
      for (const node of flatNodes) {
        // 找到 parentKey 匹配的节点作为子节点
        if (node.key !== parentKey && node.parentKey === parentKey) {
          const childNode: DataNode = {
            key: String(node.key || node.id || ''),
            title: String(node.title || node.name || ''),
            isLeaf: node.isLeaf !== undefined ? node.isLeaf : true,
            children: [],
          };
          
          // 递归构建子节点的子节点
          buildChildren(childNode, String(node.key || node.id || ''));
          
          // 如果有子节点，则不是叶子节点
          if (childNode.children && childNode.children.length > 0) {
            childNode.isLeaf = false;
          }
          
          children.push(childNode);
          parentNode.isLeaf = false; // 有子节点，父节点不是叶子
        }
      }
      
      if (children.length > 0) {
        parentNode.children = children;
      }
    };
    
    // 从根节点开始构建
    buildChildren(rootDataNode, String(rootNode.key || rootNode.id || ''));
    
    return [rootDataNode];
  };

  // 从扁平节点数组构建 TreeSelect 数据格式
  const buildTreeSelectFromFlatNodes = (rootNode: any, flatNodes: any[]): any[] => {
    if (!rootNode) {
      return [];
    }
    
    // 转换根节点
    const rootDataNode: any = {
      value: String(rootNode.key || rootNode.id || ''),
      title: String(rootNode.title || rootNode.name || ''),
      children: [],
    };
    
    // 递归构建子树
    const buildChildren = (parentNode: any, parentKey: string) => {
      const children: any[] = [];
      
      for (const node of flatNodes) {
        // 找到 parentKey 匹配的节点作为子节点
        if (node.key !== parentKey && node.parentKey === parentKey) {
          const childNode: any = {
            value: String(node.key || node.id || ''),
            title: String(node.title || node.name || ''),
            children: [],
          };
          
          // 递归构建子节点的子节点
          buildChildren(childNode, String(node.key || node.id || ''));
          
          children.push(childNode);
        }
      }
      
      if (children.length > 0) {
        parentNode.children = children;
      }
    };
    
    // 从根节点开始构建
    buildChildren(rootDataNode, String(rootNode.key || rootNode.id || ''));
    
    return [rootDataNode];
  };

  // 选择资源节点
  const handleSelectNode = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      setSelectedResourceId(selectedKeys[0] as string);
      actionRef.current?.reload();
    } else {
      setSelectedResourceId(undefined);
    }
  };

  // 选择应用
  const handleAppChange = (value: string) => {
    const app = appList.find((a) => a.id === value);
    setAppId(value);
    setAppName(app?.appName || '');
    setSelectedResourceId(undefined);
    loadResourceTree();
    actionRef.current?.reload();
  };

  // 创建资源
  const handleCreate = async (values: any) => {
    if (!appId) {
      message.warning('请先选择应用');
      return false;
    }
    try {
      await resourcesService.add({
        ...values,
        appId,
        appName,
        parentId: selectedResourceId || undefined,
      });
      message.success('创建资源成功');
      setCreateModalVisible(false);
      loadResourceTree();
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('创建资源失败');
      return false;
    }
  };

  // 更新资源
  const handleUpdate = async (values: any, record: Resource) => {
    try {
      const submitData = {
        ...record,
        ...values,
        id: record.id,
        appId: appId || record.appId,
      };
      await resourcesService.update(submitData);
      message.success('更新资源成功');
      setEditModalVisible(false);
      setCurrentRecord(undefined);
      loadResourceTree();
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      console.error('更新资源失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '更新资源失败';
      message.error(errorMessage);
      return false;
    }
  };

  // 删除资源
  const handleDelete = async (id: string) => {
    try {
      await resourcesService.delete(id);
      message.success('删除资源成功');
      loadResourceTree();
      actionRef.current?.reload();
      if (selectedResourceId === id) {
        setSelectedResourceId(undefined);
      }
    } catch (error) {
      message.error('删除资源失败');
    }
  };

  // 批量删除
  const handleBatchDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => resourcesService.delete(id)));
      message.success('批量删除成功');
      loadResourceTree();
      actionRef.current?.reload();
    } catch (error) {
      message.error('批量删除失败');
    }
  };

  // 从 URL 参数初始化
  useEffect(() => {
    const urlAppId = searchParams.get('appId');
    const urlAppName = searchParams.get('appName');
    if (urlAppId) {
      setAppId(urlAppId);
      if (urlAppName) {
        setAppName(decodeURIComponent(urlAppName));
      }
    }
    loadAppList();
  }, [searchParams]);

  useEffect(() => {
    if (appId) {
      // 使用 setTimeout 确保 appName 已经更新
      const timer = setTimeout(() => {
        loadResourceTree();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [appId, appName]);

  // 表格列定义
  const columns: ProColumns<Resource>[] = [
    {
      title: '应用名称',
      dataIndex: 'appName',
      width: 150,
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '资源名称',
      dataIndex: 'resourceName',
      width: 200,
      fixed: 'left',
    },
    {
      title: '资源类型',
      dataIndex: 'resourceType',
      width: 120,
      valueEnum: {
        MENU: { text: '菜单' },
        PAGE: { text: '页面' },
        MODULE: { text: '模块' },
        ELEMENT: { text: '元素' },
        BUTTON: { text: '按钮' },
        FILE: { text: '文件' },
        DATA: { text: '数据' },
        OTHER: { text: '其他' },
      },
      render: (_, record) => {
        const typeMap: Record<string, { text: string; color: string }> = {
          MENU: { text: '菜单', color: 'blue' },
          PAGE: { text: '页面', color: 'cyan' },
          MODULE: { text: '模块', color: 'purple' },
          ELEMENT: { text: '元素', color: 'orange' },
          BUTTON: { text: '按钮', color: 'green' },
          FILE: { text: '文件', color: 'magenta' },
          DATA: { text: '数据', color: 'red' },
          OTHER: { text: '其他', color: 'default' },
        };
        const type = typeMap[record.resourceType || 'MENU'] || { text: record.resourceType || '其他', color: 'default' };
        return <Tag color={type.color}>{type.text}</Tag>;
      },
    },
    {
      title: '排序号',
      dataIndex: 'sortIndex',
      width: 100,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueEnum: {
        0: { text: '禁用', status: 'Error' },
        1: { text: '启用', status: 'Success' },
      },
      render: (_, record) => (
        record.status === 1 ? (
          <Tag color="success">启用</Tag>
        ) : (
          <Tag color="default">禁用</Tag>
        )
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      fixed: 'right',
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={async () => {
            try {
              // 获取完整的资源数据
              const fullResourceData = await resourcesService.get(record.id);
              setCurrentRecord(fullResourceData);
              setEditModalVisible(true);
            } catch (error: any) {
              console.error('获取资源详情失败:', error);
              message.error('获取资源详情失败');
            }
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          key="delete"
          title="确定要删除这个资源吗？"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  // 加载表格数据
  const loadData = async (params: any) => {
    if (!appId) {
      return {
        data: [],
        success: true,
        total: 0,
      };
    }
    try {
      // 转换参数格式：ProTable 使用 current，但 MaxKey API 使用 pageNumber
      const requestParams: any = {
        resourceName: params.resourceName || '',
        displayName: params.displayName || '',
        appId,
        parentId: selectedResourceId || '',
        pageNumber: params.current || 1,
        pageSize: params.pageSize || 10,
        pageSizeOptions: [10, 20, 50],
      };

      const result = await resourcesService.fetch(requestParams);
      
      // 处理返回类型：MaxKey API 返回 { records: number, rows: [] }
      const data = (result as any).rows || (result as any).records || [];
      const total = (result as any).records || (result as any).total || 0;
      
      return {
        data: Array.isArray(data) ? data : [],
        success: true,
        total: typeof total === 'number' ? total : 0,
      };
    } catch (error: any) {
      console.error('加载资源列表失败:', error);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  return (
    <PageContainer
      header={{
        title: '资源管理',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '权限管理' },
            { title: '资源管理' },
          ],
        },
      }}
    >
      <ProCard>
        <Row gutter={16}>
          {/* 左侧：应用选择和资源树 */}
          <Col span={6}>
            <ProCard
              title="应用选择"
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Select
                style={{ width: '100%' }}
                placeholder="请选择应用"
                value={appId}
                onChange={handleAppChange}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={appList.map((app) => ({
                  label: app.appName,
                  value: app.id,
                }))}
              />
            </ProCard>
            {appId && (
              <ProCard title="资源树" size="small">
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                    加载中...
                  </div>
                ) : treeData.length > 0 ? (
                  <Tree
                    showLine
                    blockNode
                    treeData={treeData}
                    expandedKeys={expandedKeys}
                    onExpand={setExpandedKeys}
                    selectedKeys={selectedResourceId ? [selectedResourceId] : []}
                    onSelect={handleSelectNode}
                    icon={(props: any) => {
                      return props.isLeaf ? (
                        <FileOutlined />
                      ) : (
                        <FolderOutlined />
                      );
                    }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                    暂无资源数据
                  </div>
                )}
              </ProCard>
            )}
          </Col>

          {/* 右侧：资源列表 */}
          <Col span={18}>
            <ProTable<Resource>
              actionRef={actionRef}
              columns={columns}
              request={loadData}
              rowKey="id"
              search={{
                labelWidth: 'auto',
                collapsed: false,
              }}
              toolBarRender={() => [
                <Button
                  key="add"
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    if (!appId) {
                      message.warning('请先选择应用');
                      return;
                    }
                    setCreateModalVisible(true);
                  }}
                >
                  新建资源
                </Button>,
              ]}
              rowSelection={{
                onChange: () => {
                  // 可以在这里处理批量操作
                },
              }}
              tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
                <Space size={16}>
                  <span>
                    已选择 {selectedRowKeys.length} 项
                    <Button
                      type="link"
                      onClick={() => {
                        handleBatchDelete(selectedRowKeys as string[]);
                        onCleanSelected();
                      }}
                    >
                      批量删除
                    </Button>
                  </span>
                </Space>
              )}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
              }}
            />
          </Col>
        </Row>
      </ProCard>

      {/* 创建资源表单 */}
      <ModalForm
        title="新建资源"
        open={createModalVisible}
        onOpenChange={(visible) => {
          setCreateModalVisible(visible);
          if (!visible) {
            setCurrentRecord(undefined);
          }
        }}
        onFinish={handleCreate}
        width={600}
        initialValues={{
          appId,
          appName,
          parentId: selectedResourceId,
          resourceType: 'MENU',
          status: 1,
          sortIndex: 0,
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
          name="resourceName"
          label="资源名称"
          placeholder="请输入资源名称"
          rules={[{ required: true, message: '请输入资源名称' }]}
        />
        <ProFormSelect
          name="resourceType"
          label="资源类型"
          options={[
            { label: '菜单', value: 'MENU' },
            { label: '页面', value: 'PAGE' },
            { label: '模块', value: 'MODULE' },
            { label: '元素', value: 'ELEMENT' },
            { label: '按钮', value: 'BUTTON' },
            { label: '文件', value: 'FILE' },
            { label: '数据', value: 'DATA' },
            { label: '其他', value: 'OTHER' },
          ]}
          rules={[{ required: true, message: '请选择资源类型' }]}
        />
        <ProFormTreeSelect
          name="parentId"
          label="上级资源"
          fieldProps={{
            treeData: treeSelectData,
            placeholder: '请选择上级资源',
            allowClear: true,
            onChange: () => {
              // 可以在这里设置 parentName
            },
          }}
        />
        <ProFormText
          name="resourceUrl"
          label="资源URL"
          placeholder="请输入资源URL"
        />
        <ProFormText
          name="permission"
          label="权限标识"
          placeholder="请输入权限标识"
        />
        <ProFormText
          name="resourceAction"
          label="资源操作"
          placeholder="请输入资源操作"
        />
        <ProFormText
          name="resourceStyle"
          label="资源样式"
          placeholder="请输入资源样式"
        />
        <ProFormText
          name="resourceIcon"
          label="资源图标"
          placeholder="请输入资源图标"
        />
        <ProFormDigit
          name="sortIndex"
          label="排序号"
          min={0}
          initialValue={0}
        />
        <ProFormRadio.Group
          name="status"
          label="状态"
          initialValue={1}
          options={[
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 },
          ]}
        />
        <ProFormTextArea
          name="description"
          label="描述"
          placeholder="请输入描述信息"
          fieldProps={{ rows: 3 }}
        />
      </ModalForm>

      {/* 编辑资源表单 */}
      <ModalForm
        title="编辑资源"
        open={editModalVisible}
        onOpenChange={(visible) => {
          setEditModalVisible(visible);
          if (!visible) {
            setCurrentRecord(undefined);
          }
        }}
        onFinish={async (values) => {
          if (currentRecord) {
            return handleUpdate(values, currentRecord);
          }
          return false;
        }}
        width={600}
        initialValues={currentRecord}
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
          name="resourceName"
          label="资源名称"
          placeholder="请输入资源名称"
          rules={[{ required: true, message: '请输入资源名称' }]}
        />
        <ProFormSelect
          name="resourceType"
          label="资源类型"
          options={[
            { label: '菜单', value: 'MENU' },
            { label: '页面', value: 'PAGE' },
            { label: '模块', value: 'MODULE' },
            { label: '元素', value: 'ELEMENT' },
            { label: '按钮', value: 'BUTTON' },
            { label: '文件', value: 'FILE' },
            { label: '数据', value: 'DATA' },
            { label: '其他', value: 'OTHER' },
          ]}
          rules={[{ required: true, message: '请选择资源类型' }]}
        />
        <ProFormTreeSelect
          name="parentId"
          label="上级资源"
          fieldProps={{
            treeData: treeSelectData,
            placeholder: '请选择上级资源',
            allowClear: true,
          }}
        />
        <ProFormText
          name="resourceUrl"
          label="资源URL"
          placeholder="请输入资源URL"
        />
        <ProFormText
          name="permission"
          label="权限标识"
          placeholder="请输入权限标识"
        />
        <ProFormText
          name="resourceAction"
          label="资源操作"
          placeholder="请输入资源操作"
        />
        <ProFormText
          name="resourceStyle"
          label="资源样式"
          placeholder="请输入资源样式"
        />
        <ProFormText
          name="resourceIcon"
          label="资源图标"
          placeholder="请输入资源图标"
        />
        <ProFormDigit
          name="sortIndex"
          label="排序号"
          min={0}
        />
        <ProFormRadio.Group
          name="status"
          label="状态"
          options={[
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 },
          ]}
        />
        <ProFormTextArea
          name="description"
          label="描述"
          placeholder="请输入描述信息"
          fieldProps={{ rows: 3 }}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default ResourcesList;

