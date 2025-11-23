import { useState, useEffect, useRef } from 'react';
import {
  PageContainer,
  ProCard,
  ProTable,
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormTreeSelect,
  ProFormSelect,
  ProFormSwitch,
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
  Tag,
  Tabs,
  Spin,
} from 'antd';
import type { DataNode } from 'antd/es/tree';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { Organization } from '@/types/entity';
import organizationsService from '@/services/organizations.service';
import './OrganizationList.less';

const OrganizationList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const selectedParentIdRef = useRef<string>(''); // 使用 ref 存储当前值，确保 loadData 能访问到最新值
  const [selectedOrgId, setSelectedOrgId] = useState<string>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Organization>();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [treeSelectData, setTreeSelectData] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchParams, setSearchParams] = useState<any>({});
  const [refreshKey, setRefreshKey] = useState<number>(0); // 用于强制刷新

  // 加载组织树
  const loadOrgTree = async () => {
    setLoading(true);
    try {
      const result: any = await organizationsService.tree();
      console.log('组织树API响应:', result);
      
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
        console.log('根节点:', rootNode);
        console.log('所有节点:', nodes);
        
        // 按照 Angular 版本的逻辑构建树
        const buildTree = (parentNode: any): any[] => {
          const children: any[] = [];
          
          // 遍历所有节点，查找父节点为当前节点的子节点
          for (const node of nodes) {
            // 检查是否是当前节点的子节点
            // 注意：Angular 版本使用 node.parentKey == rootNode.key
            const parentKey = node.parentKey || node.parentId || node.parent_id;
            const nodeKey = node.key || node.id;
            
            if (nodeKey && nodeKey !== parentNode.key && parentKey === parentNode.key) {
              const childNode: any = {
                id: nodeKey,
                name: node.title || node.name,
                key: nodeKey,
                title: node.title || node.name,
                code: node.code, // 保留 code 字段
                isLeaf: true, // 初始设为叶子节点
                // 保留原始数据，方便后续使用
                dataRef: node,
              };
              
              // 递归构建子节点
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
        console.log('构建后的树形数据:', treeDataArray);
      }
      // 情况3: 包含 data 属性的对象
      else if (result && typeof result === 'object' && result.data) {
        if (Array.isArray(result.data)) {
          treeDataArray = result.data;
        } else if (result.data.rootNode && result.data.nodes) {
          const rootNode = result.data.rootNode;
          const nodes = result.data.nodes || [];
          console.log('根节点:', rootNode);
          console.log('所有节点:', nodes);
          
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
                  code: node.code, // 保留 code 字段
                  isLeaf: true,
                  // 保留原始数据，方便后续使用
                  dataRef: node,
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
          console.log('构建后的树形数据:', treeDataArray);
        }
      }
      // 情况4: 包含 records 属性的对象
      else if (result && typeof result === 'object' && Array.isArray(result.records)) {
        treeDataArray = result.records;
      }
      else {
        console.error('组织树数据格式不正确:', result);
        message.error('组织树数据格式不正确，请检查API响应');
        return;
      }
      
      const nodes = convertToTreeData(treeDataArray);
      setTreeData(nodes);
      setTreeSelectData(convertToTreeSelectData(treeDataArray));
      
      // 递归收集所有有子节点的 key，用于展开所有节点
      const collectAllKeys = (nodeList: DataNode[]): React.Key[] => {
        const keys: React.Key[] = [];
        nodeList.forEach((node: DataNode) => {
          if (node.key) {
            // 只有当节点有子节点时才添加到展开列表中
            if (node.children && Array.isArray(node.children) && node.children.length > 0) {
              keys.push(node.key);
              keys.push(...collectAllKeys(node.children));
            }
          }
        });
        return keys;
      };
      
      if (nodes.length > 0) {
        const allKeys = collectAllKeys(nodes);
        setExpandedKeys(allKeys);
      }
    } catch (error: any) {
      console.error('加载组织树失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '加载组织树失败';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 转换为 Tree 组件数据格式
  const convertToTreeData = (nodes: any[], processedKeys: Set<string> = new Set(), depth: number = 0): DataNode[] => {
    if (!nodes || !Array.isArray(nodes)) {
      return [];
    }
    
    if (depth > 100) {
      console.warn('树形结构深度超过限制');
      return [];
    }
    
    return nodes.map((node) => {
      const key = node.id || node.key || node.orgId || '';
      const title = node.name || node.title || node.orgName || '';
      
      if (key && processedKeys.has(key)) {
        console.warn(`检测到循环引用: ${key}`);
        return {
          key,
          title: `${title} (循环引用)`,
          children: [],
          isLeaf: true,
        };
      }
      
      if (key) {
        processedKeys.add(key);
      }
      
      const children = node.children && Array.isArray(node.children) && node.children.length > 0
        ? convertToTreeData(node.children, processedKeys, depth + 1) 
        : undefined;
      
      if (key) {
        processedKeys.delete(key);
      }
      
      // 只有当有子节点时才设置 children 字段，否则不设置（让 Tree 组件识别为叶子节点）
      const result: DataNode = {
        key,
        title,
        isLeaf: !children || children.length === 0,
      };
      
      if (children && children.length > 0) {
        result.children = children;
      }
      
      return result;
    });
  };

  // 转换为 TreeSelect 组件数据格式
  const convertToTreeSelectData = (nodes: any[], processedKeys: Set<string> = new Set(), depth: number = 0): any[] => {
    if (!nodes || !Array.isArray(nodes)) {
      return [];
    }
    
    if (depth > 100) {
      return [];
    }
    
    return nodes.map((node) => {
      const value = node.id || node.key || node.orgId || '';
      const title = node.name || node.title || node.orgName || '';
      
      if (value && processedKeys.has(value)) {
        return {
          value,
          title: `${title} (循环引用)`,
          children: [],
        };
      }
      
      if (value) {
        processedKeys.add(value);
      }
      
      const children = node.children && Array.isArray(node.children)
        ? convertToTreeSelectData(node.children, processedKeys, depth + 1)
        : [];
      
      if (value) {
        processedKeys.delete(value);
      }
      
      return {
        value,
        title,
        children,
      };
    });
  };

  // 选择组织节点 - 更新父组织ID并刷新表格
  const handleSelectNode = (selectedKeys: React.Key[], info: any) => {
    if (selectedKeys.length > 0) {
      const nodeInfo = info?.node;
      // 优先使用节点的原始数据中的 id，如果没有则使用 key
      // 因为树节点的 key 可能和实际数据的 id 不一致
      // 同时检查节点的原始数据（通过 info.node.props 或 info.node.dataRef）
      const nodeData = nodeInfo?.dataRef || nodeInfo?.props?.dataRef || nodeInfo;
      const orgId = String(nodeData?.id || nodeData?.key || nodeInfo?.key || selectedKeys[0]);
      
      console.log('选择组织节点:', {
        selectedKeys,
        orgId,
        nodeInfo: nodeInfo ? {
          key: nodeInfo.key,
          id: nodeData?.id,
          code: nodeData?.code,
          title: nodeInfo.title,
          children: nodeInfo.children?.length || 0,
          dataRef: nodeData,
        } : null,
      });
      
      // 检查是否是同一个节点
      const isSameNode = selectedParentIdRef.current === orgId;
      
      // 同时更新 state 和 ref，确保 loadData 能立即访问到最新值
      setSelectedParentId(orgId);
      selectedParentIdRef.current = orgId;
      setSelectedOrgId(orgId);
      
      // 如果是同一个节点，通过刷新计数器强制刷新
      if (isSameNode) {
        console.log('点击同一个节点，强制刷新');
        setRefreshKey(prev => prev + 1);
      }
      
      // 立即刷新表格数据，使用 ref 中的最新值
      // 使用 setTimeout 确保状态更新后再刷新
      setTimeout(() => {
        actionRef.current?.reload();
      }, 0);
    } else {
      console.log('取消选择组织节点');
      setSelectedParentId('');
      selectedParentIdRef.current = '';
      setSelectedOrgId(undefined);
      setRefreshKey(prev => prev + 1); // 取消选择时也刷新
      actionRef.current?.reload();
    }
  };

  // 创建组织
  const handleCreate = async (values: any) => {
    try {
      // 处理状态字段
      const submitData = {
        ...values,
        status: values.status ? 1 : 0,
        type: values.type || 'department',
        sortOrder: values.sortOrder || 11,
      };
      await organizationsService.addOrg(submitData);
      message.success('创建组织成功');
      setCreateModalVisible(false);
      loadOrgTree();
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('创建组织失败');
      return false;
    }
  };

  // 更新组织
  const handleUpdate = async (values: any) => {
    if (!currentRecord) return false;
    try {
      const submitData = {
        ...currentRecord,
        ...values,
        status: values.status ? 1 : 0,
      };
      await organizationsService.editOrg(submitData);
      message.success('更新组织成功');
      setEditModalVisible(false);
      setCurrentRecord(undefined);
      loadOrgTree();
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('更新组织失败');
      return false;
    }
  };

  // 删除组织
  const handleDelete = async (id: string) => {
    try {
      await organizationsService.removeOrg(id);
      message.success('删除组织成功');
      loadOrgTree();
      actionRef.current?.reload();
      if (selectedOrgId === id) {
        setSelectedOrgId(undefined);
        setSelectedParentId('');
        selectedParentIdRef.current = '';
      }
    } catch (error) {
      message.error('删除组织失败');
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的组织');
      return;
    }
    try {
      await organizationsService.batchDeleteOrg(selectedRowKeys as string[]);
      message.success('批量删除成功');
      setSelectedRowKeys([]);
      loadOrgTree();
      actionRef.current?.reload();
    } catch (error) {
      message.error('批量删除失败');
    }
  };

  useEffect(() => {
    loadOrgTree();
  }, []);

  // 组织类型映射
  const orgTypeMap: Record<string, { text: string; color: string }> = {
    company: { text: '公司', color: 'blue' },
    division: { text: '事业部', color: 'cyan' },
    department: { text: '部门', color: 'green' },
    team: { text: '团队', color: 'orange' },
    entity: { text: '实体', color: 'purple' },
    virtual: { text: '虚拟', color: 'default' },
  };

  // 表格列定义
  const columns: ProColumns<Organization>[] = [
    {
      title: '组织编码',
      dataIndex: 'orgCode',
      width: 150,
      fixed: 'left',
      search: false,
    },
    {
      title: '组织名称',
      dataIndex: 'orgName',
      width: 200,
    },
    {
      title: '组织类型',
      dataIndex: 'type',
      width: 120,
      valueEnum: {
        company: { text: '公司' },
        division: { text: '事业部' },
        department: { text: '部门' },
        team: { text: '团队' },
        entity: { text: '实体' },
        virtual: { text: '虚拟' },
      },
      render: (_, record) => {
        const type = orgTypeMap[record.type || 'department'] || { text: record.type, color: 'default' };
        return <Tag color={type.color}>{type.text}</Tag>;
      },
    },
    {
      title: '排序号',
      dataIndex: 'sortOrder',
      width: 100,
      sorter: true,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueEnum: {
        0: { text: '禁用', status: 'Error' },
        1: { text: '启用', status: 'Success' },
      },
      search: false,
      render: (_, record) => {
        return record.status === 1 ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            启用
          </Tag>
        ) : (
          <Tag color="default">禁用</Tag>
        );
      },
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
          onClick={() => {
            setCurrentRecord(record);
            setEditModalVisible(true);
          }}
        >
          编辑
        </Button>,
        // 删除权限检查：根节点和机构节点不能删除
        record.parentId &&
        record.parentId !== '-1' &&
        record.parentId !== '0' &&
        record.id !== record.instId ? (
          <Popconfirm
            key="delete"
            title="确定要删除这个组织吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        ) : null,
      ],
    },
  ];

  // 加载表格数据
  const loadData = async (params: any) => {
    try {
      // 使用 ref 中的最新值，确保获取到最新的 parentId
      // 同时使用 refreshKey 来确保每次点击都会触发刷新
      const currentParentId = selectedParentIdRef.current || selectedParentId;
      // 确保 parentId 是字符串类型（与树节点的 key 保持一致）
      const parentIdStr = currentParentId ? String(currentParentId) : undefined;
      
      const requestParams: any = {
        ...params,
        ...searchParams,
        // 添加时间戳确保每次请求都是新的（用于强制刷新）
        _t: Date.now(),
      };
      
      // 只有当选择了节点时才添加 parentId 参数
      // 默认不传 parentId 会返回所有数据（Angular 版本逻辑）
      if (parentIdStr) {
        requestParams.parentId = parentIdStr;
      }
      
      // 移除空值参数（但保留 _t 时间戳和 parentId）
      Object.keys(requestParams).forEach(key => {
        if (key !== '_t' && key !== 'parentId' && (requestParams[key] === '' || requestParams[key] === null || requestParams[key] === undefined)) {
          delete requestParams[key];
        }
      });
      
      console.log('=== 加载组织列表 ===');
      console.log('当前选中的 parentId (ref):', selectedParentIdRef.current);
      console.log('当前选中的 parentId (state):', selectedParentId);
      console.log('使用的 parentId:', parentIdStr);
      console.log('请求参数:', requestParams);
      
      const result: any = await organizationsService.fetch(requestParams);
      console.log('组织列表API原始响应:', JSON.stringify(result, null, 2));
      console.log('响应类型:', typeof result);
      console.log('响应是否为数组:', Array.isArray(result));
      
      // 处理响应数据格式 - 增强解析逻辑
      let records: Organization[] = [];
      let total = 0;
      
      // 先检查是否有 code 字段，如果有且不为 0，说明是错误响应
      if (result && typeof result === 'object' && result.code !== undefined && result.code !== 0) {
        console.error('API 返回错误:', result.message || result.msg || '未知错误');
        console.error('错误代码:', result.code);
        message.error(result.message || result.msg || '加载组织列表失败');
        return {
          data: [],
          success: false,
          total: 0,
        };
      }
      
      // MaxKey 标准响应格式: { code: 0, data: { rows: [], records: number, total: number, page: number } }
      if (result && typeof result === 'object') {
        // 情况1: result.data 是 PageResults 对象（包含 rows 和 records）
        if (result.data && typeof result.data === 'object') {
          if (Array.isArray(result.data.rows)) {
            records = result.data.rows;
            total = result.data.records || result.data.total || result.data.rows.length;
            console.log('使用 result.data.rows，记录数:', records.length, '总数:', total);
          } else if (Array.isArray(result.data.records)) {
            records = result.data.records;
            total = result.data.total || result.data.records.length;
            console.log('使用 result.data.records，记录数:', records.length, '总数:', total);
          } else if (Array.isArray(result.data)) {
            records = result.data;
            total = result.data.length;
            console.log('使用 result.data（数组），记录数:', records.length);
          }
        }
        // 情况2: result 直接是 PageResults 对象
        else if (Array.isArray(result.rows)) {
          records = result.rows;
          total = result.records || result.total || result.rows.length;
          console.log('使用 result.rows，记录数:', records.length, '总数:', total);
        }
        // 情况3: result.records 是数组
        else if (Array.isArray(result.records)) {
          records = result.records;
          total = result.total || result.records.length;
          console.log('使用 result.records，记录数:', records.length, '总数:', total);
        }
        // 情况4: result 直接是数组
        else if (Array.isArray(result)) {
          records = result;
          total = result.length;
          console.log('使用 result（数组），记录数:', records.length);
        }
      }
      
      // 确保 records 始终是数组
      if (!Array.isArray(records)) {
        console.warn('组织列表数据格式不正确，返回空数组。原始数据:', result);
        console.warn('原始数据类型:', typeof result);
        console.warn('原始数据 keys:', result ? Object.keys(result) : 'null');
        records = [];
        total = 0;
      }
      
      console.log('最终返回数据，记录数:', records.length, '总数:', total);
      if (records.length > 0) {
        console.log('第一条记录:', records[0]);
      } else {
        console.log('没有数据，可能原因：');
        console.log('1. 该节点确实没有子组织');
        console.log('2. API 返回的数据格式不正确');
        console.log('3. parentId 参数不正确');
      }
      
      return {
        data: records,
        success: true,
        total,
      };
    } catch (error: any) {
      console.error('=== 加载组织列表失败 ===');
      console.error('错误详情:', error);
      console.error('错误响应:', error?.response);
      console.error('错误数据:', error?.response?.data);
      const errorMessage = error?.response?.data?.message || error?.message || '加载组织列表失败';
      message.error(errorMessage);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  return (
    <div className="organization-list">
    <PageContainer
      header={{
        title: '组织管理',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '身份管理' },
            { title: '组织管理' },
          ],
        },
      }}
    >
        <ProCard>
      <Row gutter={16}>
        {/* 左侧组织树 */}
            <Col span={6}>
          <ProCard
            title="组织树"
            extra={
              <Space>
                <Button
                  type="primary"
                      size="small"
                  icon={<PlusOutlined />}
                  onClick={() => setCreateModalVisible(true)}
                >
                  新建
                </Button>
                    <Button size="small" icon={<ReloadOutlined />} onClick={loadOrgTree}>
                  刷新
                </Button>
              </Space>
            }
                bodyStyle={{ 
                  padding: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                className="grid-border organization-tree-card"
          >
            <Spin spinning={loading}>
                  <div className="organization-tree-container">
              <Tree
                      showLine={false}
                      blockNode
                expandedKeys={expandedKeys}
                      onExpand={(keys) => {
                        setExpandedKeys(keys as React.Key[]);
                      }}
                selectedKeys={selectedOrgId ? [selectedOrgId] : []}
                onSelect={(selectedKeys, info) => {
                  console.log('Tree onSelect 事件:', { selectedKeys, info });
                  handleSelectNode(selectedKeys, info);
                }}
                treeData={treeData}
              />
                  </div>
            </Spin>
          </ProCard>
        </Col>

            {/* 右侧组织列表 */}
            <Col span={18}>
              <div className="grid-border">
                <ProTable<Organization>
              actionRef={actionRef}
              columns={columns}
              request={loadData}
              rowKey="id"
              search={{
                labelWidth: 'auto',
                collapsed: false,
              }}
              form={{
                onValuesChange: (_changedValues, allValues) => {
                  setSearchParams(allValues);
                },
              }}
              toolBarRender={() => [
                <Button
                  key="add"
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setCreateModalVisible(true)}
                >
                  新建组织
                </Button>,
                <Popconfirm
                  key="batchDelete"
                  title="确定要批量删除选中的组织吗？"
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
              rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys,
              }}
              tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
                <Space size={16}>
                  <span>
                    已选择 {selectedRowKeys.length} 项
                    <Button
                      type="link"
                      onClick={() => {
                        handleBatchDelete();
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
              size="small"
              bordered
            />
              </div>
        </Col>
      </Row>
        </ProCard>

      {/* 创建组织表单 */}
      <ModalForm
        title="新建组织"
        open={createModalVisible}
        onOpenChange={(visible) => {
          setCreateModalVisible(visible);
        }}
        onFinish={handleCreate}
        width={800}
        modalProps={{
          destroyOnClose: true,
        }}
        initialValues={{
          type: 'department',
          sortOrder: 11,
          status: true,
        }}
      >
        <Tabs
          items={[
            {
              key: 'basic',
              label: '基本信息',
              children: (
                <>
        <ProFormTreeSelect
          name="parentId"
          label="上级组织"
          placeholder="请选择上级组织（留空为顶级组织）"
          allowClear
                    request={async () => {
                      // 确保返回数组
                      if (Array.isArray(treeSelectData)) {
                        return treeSelectData;
                      }
                      return [];
                    }}
          fieldProps={{
            showSearch: true,
            treeNodeFilterProp: 'title',
          }}
        />
        <ProFormText
          name="orgCode"
          label="组织编码"
          placeholder="请输入组织编码"
          rules={[{ required: true, message: '请输入组织编码' }]}
        />
        <ProFormText
          name="orgName"
          label="组织名称"
          placeholder="请输入组织名称"
          rules={[{ required: true, message: '请输入组织名称' }]}
        />
        <ProFormText
          name="fullName"
          label="组织全称"
          placeholder="请输入组织全称"
        />
                  <ProFormSelect
          name="type"
          label="组织类型"
                    options={[
                      { label: '公司', value: 'company' },
                      { label: '事业部', value: 'division' },
                      { label: '部门', value: 'department' },
                      { label: '团队', value: 'team' },
                      { label: '实体', value: 'entity' },
                      { label: '虚拟', value: 'virtual' },
                    ]}
                    rules={[{ required: true, message: '请选择组织类型' }]}
        />
        <ProFormDigit
          name="sortOrder"
          label="排序号"
                    min={0}
                    initialValue={11}
                    fieldProps={{ precision: 0 }}
                  />
                  <ProFormSwitch
                    name="status"
                    label="状态"
                    checkedChildren="启用"
                    unCheckedChildren="禁用"
                  />
                </>
              ),
            },
            {
              key: 'extra',
              label: '扩展信息',
              children: (
                <>
                  <ProFormText
                    name="codePath"
                    label="编码路径"
                    placeholder="请输入编码路径"
                  />
                  <ProFormText
                    name="namePath"
                    label="名称路径"
                    placeholder="请输入名称路径"
                  />
                  <ProFormDigit
                    name="level"
                    label="层级"
          min={0}
          fieldProps={{ precision: 0 }}
        />
                  <ProFormText
                    name="division"
                    label="部门"
                    placeholder="请输入部门"
                  />
                </>
              ),
            },
            {
              key: 'address',
              label: '地址信息',
              children: (
                <>
                  <ProFormText
                    name="country"
                    label="国家"
                    placeholder="请输入国家"
                  />
                  <ProFormText
                    name="region"
                    label="地区"
                    placeholder="请输入地区"
                  />
                  <ProFormText
                    name="locality"
                    label="城市"
                    placeholder="请输入城市"
                  />
                  <ProFormText
                    name="street"
                    label="街道"
                    placeholder="请输入街道"
                  />
                  <ProFormText
                    name="address"
                    label="详细地址"
                    placeholder="请输入详细地址"
                  />
                  <ProFormText
                    name="postalCode"
                    label="邮编"
                    placeholder="请输入邮编"
                  />
                </>
              ),
            },
            {
              key: 'contact',
              label: '联系方式',
              children: (
                <>
                  <ProFormText
                    name="contact"
                    label="联系人"
                    placeholder="请输入联系人"
                  />
                  <ProFormText
                    name="phone"
                    label="电话"
                    placeholder="请输入电话"
                  />
                  <ProFormText
                    name="email"
                    label="邮箱"
                    placeholder="请输入邮箱"
                  />
                  <ProFormText
                    name="fax"
                    label="传真"
                    placeholder="请输入传真"
                  />
                </>
              ),
            },
          ]}
        />
      </ModalForm>

      {/* 编辑组织表单 */}
      <ModalForm
        title="编辑组织"
        open={editModalVisible}
        onOpenChange={(visible) => {
          setEditModalVisible(visible);
          if (!visible) {
            setCurrentRecord(undefined);
          }
        }}
        onFinish={handleUpdate}
        width={800}
        modalProps={{
          destroyOnClose: true,
        }}
        initialValues={currentRecord ? { ...currentRecord, status: currentRecord.status === 1 } : undefined}
      >
        <Tabs
          items={[
            {
              key: 'basic',
              label: '基本信息',
              children: (
                <>
        <ProFormTreeSelect
          name="parentId"
          label="上级组织"
          placeholder="请选择上级组织（留空为顶级组织）"
          allowClear
                    request={async () => {
                      // 确保返回数组
                      if (Array.isArray(treeSelectData)) {
                        return treeSelectData;
                      }
                      return [];
                    }}
          fieldProps={{
            showSearch: true,
            treeNodeFilterProp: 'title',
          }}
        />
        <ProFormText
          name="orgCode"
          label="组织编码"
          placeholder="请输入组织编码"
          rules={[{ required: true, message: '请输入组织编码' }]}
        />
        <ProFormText
          name="orgName"
          label="组织名称"
          placeholder="请输入组织名称"
          rules={[{ required: true, message: '请输入组织名称' }]}
        />
        <ProFormText
          name="fullName"
          label="组织全称"
          placeholder="请输入组织全称"
        />
                  <ProFormSelect
          name="type"
          label="组织类型"
                    options={[
                      { label: '公司', value: 'company' },
                      { label: '事业部', value: 'division' },
                      { label: '部门', value: 'department' },
                      { label: '团队', value: 'team' },
                      { label: '实体', value: 'entity' },
                      { label: '虚拟', value: 'virtual' },
                    ]}
                    rules={[{ required: true, message: '请选择组织类型' }]}
        />
        <ProFormDigit
          name="sortOrder"
          label="排序号"
                    min={0}
                    fieldProps={{ precision: 0 }}
                  />
                  <ProFormSwitch
                    name="status"
                    label="状态"
                    checkedChildren="启用"
                    unCheckedChildren="禁用"
                  />
                </>
              ),
            },
            {
              key: 'extra',
              label: '扩展信息',
              children: (
                <>
                  <ProFormText
                    name="codePath"
                    label="编码路径"
                    placeholder="请输入编码路径"
                  />
                  <ProFormText
                    name="namePath"
                    label="名称路径"
                    placeholder="请输入名称路径"
                  />
                  <ProFormDigit
                    name="level"
                    label="层级"
          min={0}
          fieldProps={{ precision: 0 }}
        />
                  <ProFormText
                    name="division"
                    label="部门"
                    placeholder="请输入部门"
                  />
                </>
              ),
            },
            {
              key: 'address',
              label: '地址信息',
              children: (
                <>
                  <ProFormText
                    name="country"
                    label="国家"
                    placeholder="请输入国家"
                  />
                  <ProFormText
                    name="region"
                    label="地区"
                    placeholder="请输入地区"
                  />
                  <ProFormText
                    name="locality"
                    label="城市"
                    placeholder="请输入城市"
                  />
                  <ProFormText
                    name="street"
                    label="街道"
                    placeholder="请输入街道"
                  />
                  <ProFormText
                    name="address"
                    label="详细地址"
                    placeholder="请输入详细地址"
                  />
                  <ProFormText
                    name="postalCode"
                    label="邮编"
                    placeholder="请输入邮编"
                  />
                </>
              ),
            },
            {
              key: 'contact',
              label: '联系方式',
              children: (
                <>
                  <ProFormText
                    name="contact"
                    label="联系人"
                    placeholder="请输入联系人"
                  />
                  <ProFormText
                    name="phone"
                    label="电话"
                    placeholder="请输入电话"
                  />
                  <ProFormText
                    name="email"
                    label="邮箱"
                    placeholder="请输入邮箱"
                  />
                  <ProFormText
                    name="fax"
                    label="传真"
                    placeholder="请输入传真"
                  />
                </>
              ),
            },
          ]}
        />
      </ModalForm>
    </PageContainer>
    </div>
  );
};

export default OrganizationList;
