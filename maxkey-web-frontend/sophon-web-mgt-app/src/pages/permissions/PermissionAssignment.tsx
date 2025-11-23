import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  PageContainer,
  ProCard,
  ProTable,
} from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import {
  Button,
  message,
  Tree,
  Row,
  Col,
  Select,
  Tag,
  Space,
} from 'antd';
import type { DataNode } from 'antd/es/tree';
import {
  SaveOutlined,
  FolderOutlined,
  FileOutlined,
} from '@ant-design/icons';
import type { Group, TreeNode, Application, Permission } from '@/types/entity';
import permissionsService from '@/services/permissions.service';
import resourcesService from '@/services/resources.service';
import groupsService from '@/services/groups.service';
import appsService from '@/services/apps.service';
import './PermissionAssignment.less';

const PermissionAssignment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>();
  const [appId, setAppId] = useState<string>('');
  const [appName, setAppName] = useState<string>('');
  const [appList, setAppList] = useState<Application[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  // 从 URL 参数初始化
  useEffect(() => {
    const urlAppId = searchParams.get('appId');
    const urlAppName = searchParams.get('appName');
    if (urlAppId) {
      setAppId(urlAppId);
      if (urlAppName) {
        setAppName(decodeURIComponent(urlAppName));
      } else {
        setAppName('');
      }
    } else {
      setAppId('');
      setAppName('');
    }
    loadAppList();
  }, [searchParams]);

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
      message.error('加载应用列表失败');
    }
  };

  // 加载资源树
  const loadResourceTree = async () => {
    if (!appId) {
      console.log('loadResourceTree: appId 为空，跳过加载');
      return;
    }
    console.log('loadResourceTree: 开始加载资源树', { appId, appName });
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
      
      // 默认展开根节点
      if (rootNode.key) {
        setExpandedKeys([rootNode.key]);
      }
      
      console.log('loadResourceTree: 资源树加载完成，treeData长度:', treeNodes.length);
    } catch (error: any) {
      console.error('加载资源树失败:', error);
      console.error('错误详情:', error?.response?.data || error?.response);
      // 不显示错误消息，因为响应拦截器已经显示了
    } finally {
      setLoading(false);
    }
  };

  // 加载用户组权限
  const loadGroupPermissions = async () => {
    if (!selectedGroupId || !appId) return;
    try {
      const permissions = await permissionsService.getByGroup(selectedGroupId, appId);
      const resourceIds = permissions.map((p) => p.resourceId).filter(Boolean) as string[];
      setCheckedKeys(resourceIds);
    } catch (error: any) {
      console.error('加载用户组权限失败:', error);
      message.error('加载用户组权限失败');
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
          const nodeType = node.attrs && node.attrs.type ? node.attrs.type : '';
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

  // 选择应用
  const handleAppChange = (value: string) => {
    const app = appList.find((a) => a.id === value);
    setAppId(value);
    setAppName(app?.appName || '');
    setCheckedKeys([]);
    setSelectedGroupId(undefined);
    loadResourceTree();
    actionRef.current?.reload();
  };

  // 选择用户组
  const handleGroupSelect = (record: Group) => {
    setSelectedGroupId(record.id);
    // 移除这里的 loadGroupPermissions 调用，由 useEffect 统一处理
    // useEffect 会在 selectedGroupId 变化时自动调用 loadGroupPermissions
  };

  // 保存权限
  const handleSave = async () => {
    if (!selectedGroupId) {
      message.warning('请先选择用户组');
      return;
    }
    if (!appId) {
      message.warning('请先选择应用');
      return;
    }
    if (checkedKeys.length === 0) {
      message.warning('请至少选择一个资源');
      return;
    }
    try {
      // 构建资源ID字符串（逗号分隔）
      const resourceId = (checkedKeys as string[]).join(',');
      
      // 更新用户组权限
      await permissionsService.updateGroupPermission({
        appId,
        groupId: selectedGroupId,
        resourceId,
      });

      message.success('权限分配成功');
    } catch (error: any) {
      console.error('权限分配失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '权限分配失败';
      message.error(errorMessage);
    }
  };

  // 当 appId 变化时，自动加载资源树
  useEffect(() => {
    if (appId) {
      console.log('appId 变化，加载资源树:', appId, appName);
      // 使用 setTimeout 确保 appName 已经设置
      const timer = setTimeout(() => {
        loadResourceTree();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [appId, appName]);

  // 当选中用户组和应用时，加载该用户组的权限
  useEffect(() => {
    if (selectedGroupId && appId) {
      loadGroupPermissions();
    }
  }, [selectedGroupId, appId]);

  // 表格列定义
  const columns: ProColumns<Group>[] = [
    {
      title: '用户组名称',
      dataIndex: 'groupName',
      width: 200,
    },
    {
      title: '用户组类型',
      dataIndex: 'category',
      width: 120,
      render: (_, record) => {
        const categoryMap: Record<string, { text: string; color: string }> = {
          static: { text: '静态用户组', color: 'blue' },
          dynamic: { text: '动态用户组', color: 'green' },
        };
        const category = categoryMap[record.category || 'static'] || { text: record.category || '静态用户组', color: 'default' };
        return <Tag color={category.color}>{category.text}</Tag>;
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 200,
      ellipsis: true,
    },
  ];

  // 加载用户组列表数据
  const loadGroupData = async (params: any) => {
    try {
      const requestParams: any = {
        groupName: params.groupName || '',
        displayName: params.displayName || '',
        employeeNumber: params.employeeNumber || '',
        appId: appId || '',
        appName: appName || '',
        startDate: params.startDate || '',
        endDate: params.endDate || '',
        pageNumber: params.current || 1,
        pageSize: params.pageSize || 10,
        pageSizeOptions: [10, 20, 50],
      };

      // 如果有日期范围，添加时间戳参数
      if (params.startDate && params.endDate) {
        requestParams.startDatePicker = new Date(params.startDate).getTime();
        requestParams.endDatePicker = new Date(params.endDate).getTime();
      }

      const result = await groupsService.fetch(requestParams);
      
      // 处理返回类型：MaxKey API 返回 { records: number, rows: [] }
      const data = (result as any).rows || (result as any).records || [];
      const total = (result as any).records || (result as any).total || 0;
      
      return {
        data: Array.isArray(data) ? data : [],
        success: true,
        total: typeof total === 'number' ? total : 0,
      };
    } catch (error: any) {
      console.error('加载用户组列表失败:', error);
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
        title: '权限分配',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '权限管理' },
            { title: '权限分配' },
          ],
        },
      }}
    >
      <ProCard>
        {/* 应用选择 */}
        <Space style={{ marginBottom: 16 }}>
          <span>应用：</span>
          <Select
            style={{ width: 300 }}
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
        </Space>

        <Row gutter={16}>
          {/* 左侧：用户组列表 */}
          <Col span={10}>
            <ProCard title="用户组列表" size="small">
              <ProTable<Group>
                actionRef={actionRef}
                columns={columns}
                request={loadGroupData}
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
                  selectedRowKeys: selectedGroupId ? [selectedGroupId] : [],
                  onSelect: (record) => {
                    handleGroupSelect(record);
                  },
                }}
              />
            </ProCard>
          </Col>

          {/* 右侧：资源树 */}
          <Col span={14}>
            <ProCard
              title="资源权限"
              size="small"
              extra={
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  disabled={!selectedGroupId || !appId}
                >
                  保存权限
                </Button>
              }
            >
              {appId ? (
                loading ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                    加载中...
                  </div>
                ) : treeData.length > 0 ? (
                  <>
                    {/* 调试信息 - 生产环境可以移除 */}
                    {process.env.NODE_ENV === 'development' && (
                      <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>
                        调试: treeData长度={treeData.length}, expandedKeys={expandedKeys.length}, checkedKeys={checkedKeys.length}
                      </div>
                    )}
                    <Tree
                      checkable
                      showLine
                      blockNode
                      treeData={treeData}
                      expandedKeys={expandedKeys}
                      onExpand={setExpandedKeys}
                      checkedKeys={checkedKeys}
                      onCheck={(checked) => {
                        setCheckedKeys(checked as React.Key[]);
                      }}
                      icon={(props: any) => {
                        return props.isLeaf ? (
                          <FileOutlined />
                        ) : (
                          <FolderOutlined />
                        );
                      }}
                    />
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                    <div>暂无资源数据</div>
                    <div style={{ marginTop: 8, fontSize: 12 }}>
                      treeData长度: {treeData.length}, appId: {appId}, loading: {loading ? 'true' : 'false'}
                    </div>
                  </div>
                )
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                  请先选择应用
                </div>
              )}
            </ProCard>
          </Col>
        </Row>
      </ProCard>
    </PageContainer>
  );
};

export default PermissionAssignment;
