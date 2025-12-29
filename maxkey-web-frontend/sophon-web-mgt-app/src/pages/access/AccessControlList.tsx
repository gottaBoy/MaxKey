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
  Image,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { Group, Application } from '@/types/entity';
import groupsService from '@/services/groups.service';
import accessService from '@/services/access.service';
import { generateAppIcon } from '@/utils/iconGenerator';

const AccessControlList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const groupActionRef = useRef<ActionType>();
  const appActionRef = useRef<ActionType>();
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [selectedGroupName, setSelectedGroupName] = useState<string>('');
  const [selectedGroupRowKeys, setSelectedGroupRowKeys] = useState<React.Key[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [groupSearchParams, setGroupSearchParams] = useState<any>({});
  const [appSearchParams, setAppSearchParams] = useState<any>({});
  const [addAppModalVisible, setAddAppModalVisible] = useState(false);
  const [addAppTargetKeys, setAddAppTargetKeys] = useState<string[]>([]);
  const [allApps, setAllApps] = useState<Application[]>([]);
  const [addAppLoading, setAddAppLoading] = useState(false);
  const addAppModalActionRef = useRef<ActionType>();
  const [addAppModalSearchParams, setAddAppModalSearchParams] = useState<any>({});

  // 从 URL 参数初始化
  useEffect(() => {
    const urlGroupId = searchParams.get('groupId');
    const urlGroupName = searchParams.get('groupName');
    
    if (urlGroupId) {
      setSelectedGroupId(urlGroupId);
      setSelectedGroupRowKeys([urlGroupId]);
      if (urlGroupName) {
        setSelectedGroupName(decodeURIComponent(urlGroupName));
      }
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

  // 应用表格列定义
  const appColumns: ProColumns<Application>[] = [
    {
      title: '用户组名称',
      dataIndex: 'groupName',
      width: 150,
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '图标',
      dataIndex: 'iconBase64',
      width: 80,
      hideInSearch: true,
      render: (_, record) => {
        if (record.iconBase64) {
          return <Image src={record.iconBase64} width={30} height={30} preview={false} />;
        }
        const generatedIcon = generateAppIcon(record.appName || '');
        return generatedIcon ? <Image src={generatedIcon} width={30} height={30} preview={false} /> : '-';
      },
    },
    {
      title: '应用名称',
      dataIndex: 'appName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '应用类别',
      dataIndex: 'category',
      width: 150,
      hideInSearch: true,
      render: (_, record) => {
        const categoryMap: Record<string, string> = {
          none: '无',
          '1011': 'OAuth 2.0',
          '1012': 'SAML 2.0',
          '1013': 'CAS',
          '1014': 'JWT',
          '1015': 'Token Based',
          '1016': 'Form Based',
          '1017': 'Extend API',
          '1111': 'Basic',
          '1112': 'OAuth 2.0',
          '1113': 'SAML 2.0',
          '1114': 'CAS',
          '1211': 'OAuth 2.0',
          '1212': 'SAML 2.0',
          '1213': 'CAS',
          '1214': 'JWT',
          '1215': 'Token Based',
          '1311': 'OAuth 2.0',
          '1411': 'OAuth 2.0',
          '1511': 'OAuth 2.0',
          '1512': 'SAML 2.0',
          '1611': 'OAuth 2.0',
          '1711': 'OAuth 2.0',
          '1712': 'SAML 2.0',
          '1811': 'OAuth 2.0',
          '1812': 'SAML 2.0',
          '1911': 'OAuth 2.0',
          '1912': 'SAML 2.0',
        };
        return categoryMap[record.category || 'none'] || record.category || '无';
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      fixed: 'right',
      render: (_, record) => [
        <Popconfirm
          key="delete"
          title="确定要删除此应用访问权限吗？"
          onConfirm={() => handleDeleteApp(record.id!)}
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
      const requestParams: any = {
        groupName: groupSearchParams.groupName || params.groupName || '',
        pageNumber: params.current || 1,
        pageSize: params.pageSize || 10,
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

  // 加载应用列表（用户组可以访问的应用）
  const loadApps = async (params: any) => {
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
        appName: appSearchParams.appName || params.appName || '',
        pageNumber: params.current || 1,
        pageSize: params.pageSize || 10,
      };
      
      // 移除空值参数（但保留 groupId）
      Object.keys(requestParams).forEach(key => {
        if (key !== 'groupId' && (requestParams[key] === '' || requestParams[key] === null || requestParams[key] === undefined)) {
          delete requestParams[key];
        }
      });
      
      const result: any = await accessService.member(requestParams);
      
      let records: Application[] = [];
      let total = 0;
      
      // 响应拦截器已经返回了 res.data，所以 result 直接是分页对象
      if (result && typeof result === 'object') {
        if (Array.isArray(result.rows)) {
          records = result.rows;
          total = result.records || result.total || result.rows.length;
        } else if (Array.isArray(result.records)) {
          records = result.records;
          total = result.total || result.records.length;
        } else if (Array.isArray(result)) {
          records = result;
          total = result.length;
        } else if (result.data && typeof result.data === 'object') {
          // 兼容处理：如果还有嵌套的 data 结构
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
        }
      }
      
      return {
        data: records,
        success: true,
        total: total,
      };
    } catch (error: any) {
      console.error('加载应用列表失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '加载应用列表失败';
      message.error(errorMessage);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // 选择用户组（checkbox 单选逻辑）
  const handleSelectGroup = (record: Group, checked: boolean) => {
    // 先取消所有选择
    setSelectedGroupRowKeys([]);
    
    if (checked) {
      // 只选择当前项
      setSelectedGroupRowKeys([record.id!]);
      setSelectedGroupId(record.id!);
      setSelectedGroupName(record.groupName || '');
      setSelectedRowKeys([]);
      // 刷新应用列表
      setTimeout(() => {
        appActionRef.current?.reload();
      }, 0);
    } else {
      setSelectedGroupId('');
      setSelectedGroupName('');
      setSelectedRowKeys([]);
    }
  };

  // 删除应用访问权限
  const handleDeleteApp = async (id: string) => {
    try {
      await accessService.delete(id);
      message.success('删除应用访问权限成功');
      appActionRef.current?.reload();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || '删除应用访问权限失败';
      message.error(errorMessage);
    }
  };

  // 批量删除应用访问权限
  const handleBatchDeleteApps = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的应用');
      return;
    }
    try {
      await accessService.delete(selectedRowKeys as string[]);
      message.success('批量删除成功');
      setSelectedRowKeys([]);
      appActionRef.current?.reload();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || '批量删除失败';
      message.error(errorMessage);
    }
  };

  // 打开添加应用对话框
  const handleAddApp = async () => {
    if (!selectedGroupId) {
      message.warning('请先选择用户组');
      return;
    }
    setAddAppLoading(true);
    try {
      // 加载用户组不能访问的应用
      const result = await accessService.memberOut({
        groupId: selectedGroupId,
        pageNumber: 1,
        pageSize: 1000,
        ...addAppModalSearchParams,
      });
      const data = (result as any).rows || (result as any).records || [];
      setAllApps(data);
      setAddAppTargetKeys([]);
      setAddAppModalVisible(true);
    } catch (error: any) {
      message.error('加载应用列表失败');
    } finally {
      setAddAppLoading(false);
    }
  };

  // 保存添加的应用
  const handleSaveApps = async () => {
    if (!selectedGroupId || addAppTargetKeys.length === 0) {
      message.warning('请选择要添加的应用');
      return;
    }

    setAddAppLoading(true);
    try {
      const appsToAdd = allApps.filter((app) => addAppTargetKeys.includes(app.id!));
      const appIds = appsToAdd.map((app) => app.id!).join(',');
      const appNames = appsToAdd.map((app) => app.appName || '').join(',');
      
      await accessService.add({
        groupId: selectedGroupId,
        appId: appIds,
        appName: appNames,
      });

      message.success('添加应用访问权限成功');
      setAddAppModalVisible(false);
      setAddAppTargetKeys([]);
      appActionRef.current?.reload();
    } catch (error: any) {
      console.error('添加应用访问权限失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '添加应用访问权限失败';
      message.error(errorMessage);
    } finally {
      setAddAppLoading(false);
    }
  };

  return (
    <PageContainer
      header={{
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '访问控制' },
            { title: '访问控制' },
          ],
        },
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
                  rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: selectedGroupRowKeys,
                    onChange: (keys, selectedRows) => {
                      if (keys.length > 0) {
                        // 只保留最后一个选中的（单选逻辑）
                        const lastKey = keys[keys.length - 1];
                        const lastRecord = selectedRows.find((r: Group) => r.id === lastKey);
                        if (lastRecord) {
                          handleSelectGroup(lastRecord, true);
                        }
                      } else {
                        handleSelectGroup({} as Group, false);
                      }
                    },
                  }}
                />
              </Space>
            </ProCard>
          </Col>

          {/* 右侧应用列表 */}
          <Col xs={24} sm={24} md={16} lg={16} xl={16}>
            <ProCard
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
                      <span style={{ fontSize: '13px' }}>应用名称</span>
                      <Input
                        placeholder="应用名称"
                        value={appSearchParams.appName || ''}
                        onChange={(e) => {
                          setAppSearchParams({ ...appSearchParams, appName: e.target.value });
                        }}
                        onPressEnter={() => {
                          appActionRef.current?.reload();
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
                            appActionRef.current?.reload();
                          }}
                        >
                          查询
                        </Button>
                        <Button
                          onClick={() => {
                            setAppSearchParams({ appName: '' });
                            appActionRef.current?.reload();
                          }}
                        >
                          重置
                        </Button>
                      </Space>
                    </Space>
                  </Col>
                </Row>
                <ProTable<Application>
                  columns={appColumns}
                  actionRef={appActionRef}
                  request={loadApps}
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
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                  }}
                  toolBarRender={() => [
                    <Button
                      key="add"
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddApp}
                      disabled={!selectedGroupId}
                    >
                      新增
                    </Button>,
                    <Popconfirm
                      key="batchDelete"
                      title="确定要批量删除选中的应用访问权限吗？"
                      onConfirm={handleBatchDeleteApps}
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

      {/* 添加应用对话框 */}
      <Modal
        title="新增"
        open={addAppModalVisible}
        onCancel={() => {
          setAddAppModalVisible(false);
          setAddAppTargetKeys([]);
          setAddAppModalSearchParams({});
        }}
        onOk={handleSaveApps}
        width={900}
        confirmLoading={addAppLoading}
        footer={[
          <Button key="cancel" onClick={() => {
            setAddAppModalVisible(false);
            setAddAppTargetKeys([]);
            setAddAppModalSearchParams({});
          }}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={addAppLoading} onClick={handleSaveApps}>
            确认
          </Button>,
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {/* 搜索表单 */}
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={16} md={14}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <span style={{ fontSize: '13px' }}>应用名称</span>
                <Input
                  placeholder="应用名称"
                  value={addAppModalSearchParams.appName || ''}
                  onChange={(e) => {
                    setAddAppModalSearchParams({ ...addAppModalSearchParams, appName: e.target.value });
                  }}
                  onPressEnter={() => {
                    handleAddApp();
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
                      handleAddApp();
                    }}
                  >
                    查询
                  </Button>
                  <Button
                    onClick={() => {
                      setAddAppModalSearchParams({});
                      handleAddApp();
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
                title: '图标',
                dataIndex: 'iconBase64',
                width: 80,
                render: (_, record: any) => {
                  if (record.iconBase64) {
                    return <Image src={record.iconBase64} width={30} height={30} preview={false} />;
                  }
                  const generatedIcon = generateAppIcon(record.appName || '');
                  return generatedIcon ? <Image src={generatedIcon} width={30} height={30} preview={false} /> : '-';
                },
              },
              {
                title: '应用名称',
                dataIndex: 'appName',
                width: 200,
              },
              {
                title: '应用类别',
                dataIndex: 'category',
                width: 150,
                render: (_, record: any) => {
                  const categoryMap: Record<string, string> = {
                    none: '无',
                    '1011': 'OAuth 2.0',
                    '1012': 'SAML 2.0',
                    '1013': 'CAS',
                    '1014': 'JWT',
                    '1015': 'Token Based',
                    '1016': 'Form Based',
                    '1017': 'Extend API',
                    '1111': 'Basic',
                    '1112': 'OAuth 2.0',
                    '1113': 'SAML 2.0',
                    '1114': 'CAS',
                    '1211': 'OAuth 2.0',
                    '1212': 'SAML 2.0',
                    '1213': 'CAS',
                    '1214': 'JWT',
                    '1215': 'Token Based',
                    '1311': 'OAuth 2.0',
                    '1411': 'OAuth 2.0',
                    '1511': 'OAuth 2.0',
                    '1512': 'SAML 2.0',
                    '1611': 'OAuth 2.0',
                    '1711': 'OAuth 2.0',
                    '1712': 'SAML 2.0',
                    '1811': 'OAuth 2.0',
                    '1812': 'SAML 2.0',
                    '1911': 'OAuth 2.0',
                    '1912': 'SAML 2.0',
                  };
                  return categoryMap[record.category || 'none'] || record.category || '无';
                },
              },
              {
                title: '排序',
                dataIndex: 'sortIndex',
                width: 100,
              },
              {
                title: '状态',
                dataIndex: 'status',
                width: 80,
                render: (_, record: any) => {
                  return record.status === 1 ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                      启用
                    </Tag>
                  ) : (
                    <Tag color="default">禁用</Tag>
                  );
                },
              },
            ]}
            actionRef={addAppModalActionRef as any}
            request={async (params) => {
              if (!selectedGroupId) {
                return { data: [], success: true, total: 0 };
              }
              try {
                const requestParams: any = {
                  groupId: selectedGroupId,
                  appName: addAppModalSearchParams.appName || params.appName || '',
                  pageNumber: params.current || 1,
                  pageSize: params.pageSize || 5,
                };
                const result: any = await accessService.memberOut(requestParams);
                let records: Application[] = [];
                let total = 0;
                // 响应拦截器已经返回了 res.data，所以 result 直接是分页对象
                if (result && typeof result === 'object') {
                  if (Array.isArray(result.rows)) {
                    records = result.rows;
                    total = result.records || result.total || result.rows.length;
                  } else if (Array.isArray(result.records)) {
                    records = result.records;
                    total = result.total || result.records.length;
                  } else if (Array.isArray(result)) {
                    records = result;
                    total = result.length;
                  } else if (result.data && typeof result.data === 'object') {
                    // 兼容处理：如果还有嵌套的 data 结构
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
                  }
                }
                setAllApps(records);
                return { data: records, success: true, total };
              } catch (error: any) {
                message.error('加载应用列表失败');
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
              selectedRowKeys: addAppTargetKeys,
              onChange: (keys) => setAddAppTargetKeys(keys as string[]),
            }}
            scroll={{ y: 300 }}
          />
        </Space>
      </Modal>
    </PageContainer>
  );
};

export default AccessControlList;

