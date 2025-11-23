import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageContainer,
  ProTable,
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
  ProFormRadio,
} from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import {
  Button,
  Popconfirm,
  message,
  Tag,
  Image,
  Modal,
  Table,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  KeyOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import type { Application } from '@/types/entity';
import appsService from '@/services/apps.service';
import './ApplicationList.less';

const ApplicationList: React.FC = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectProtocolModalVisible, setSelectProtocolModalVisible] = useState(false);
  const [currentApp, setCurrentApp] = useState<Application>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  // 协议标签颜色映射
  const protocolColors: Record<string, string> = {
    'OAuth_v2.0': 'blue',
    'OAuth_v2.1': 'blue',
    'OpenID_Connect_v1.0': 'cyan',
    'SAML_v2.0': 'green',
    CAS: 'orange',
    JWT: 'purple',
    'Form_Based': 'cyan',
    'Token_Based': 'magenta',
    'Extend_API': 'purple',
    Basic: 'default',
    OAUTH20: 'blue',
    SAML20: 'green',
    FORMBASED: 'cyan',
    TOKENBASED: 'magenta',
  };

  // 协议选项
  const protocolOptions = [
    { label: 'OAuth v2.0', value: 'OAuth_v2.0' },
    { label: 'OAuth v2.1', value: 'OAuth_v2.1' },
    { label: 'OpenID Connect v1.0', value: 'OpenID_Connect_v1.0' },
    { label: 'SAML v2.0', value: 'SAML_v2.0' },
    { label: 'CAS', value: 'CAS' },
    { label: 'JWT', value: 'JWT' },
    { label: 'Token Based', value: 'Token_Based' },
    { label: 'Form Based', value: 'Form_Based' },
    { label: 'Extend API', value: 'Extend_API' },
    { label: 'Basic', value: 'Basic' },
  ];

  // 表格列定义
  const columns: ProColumns<Application>[] = [
    {
      title: '应用图标',
      dataIndex: 'icon',
      width: 80,
      hideInSearch: true,
      render: (_, record) => (
        record.iconBase64 ? (
          <Image
            src={record.iconBase64}
            alt={record.appName}
            width={30}
            height={30}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          />
        ) : (
          <Image
            src={appsService.getIconUrl(record.id!)}
            alt={record.appName}
            width={30}
            height={30}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          />
        )
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: 120,
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '应用名称',
      dataIndex: 'appName',
      width: 200,
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: '协议',
      dataIndex: 'protocol',
      width: 150,
      valueType: 'select',
      valueEnum: {
        'OAuth_v2.0': { text: 'OAuth v2.0' },
        'OAuth_v2.1': { text: 'OAuth v2.1' },
        'OpenID_Connect_v1.0': { text: 'OpenID Connect v1.0' },
        'SAML_v2.0': { text: 'SAML v2.0' },
        CAS: { text: 'CAS' },
        JWT: { text: 'JWT' },
        'Token_Based': { text: 'Token Based' },
        'Form_Based': { text: 'Form Based' },
        'Extend_API': { text: 'Extend API' },
        Basic: { text: 'Basic' },
      },
      render: (_, record) => (
        <Tag color={protocolColors[record.protocol] || 'default'}>
          {record.protocol}
        </Tag>
      ),
    },
    {
      title: '类别',
      dataIndex: 'category',
      width: 120,
      ellipsis: true,
      hideInSearch: true,
      render: (_, record) => {
        const categoryMap: Record<string, string> = {
          none: '无',
          '1011': '办公协作',
          '1012': '项目管理',
          '1013': '文档管理',
          '1014': '即时通讯',
          '1015': '邮件系统',
          '1016': '视频会议',
          '1017': '其他办公',
          '1111': '财务系统',
          '1112': 'ERP系统',
          '1113': 'CRM系统',
          '1114': '其他业务',
          '1211': '开发工具',
          '1212': '代码仓库',
          '1213': 'CI/CD',
          '1214': '监控运维',
          '1215': '其他技术',
          '1311': '云服务',
          '1411': '安全工具',
          '1511': '数据分析',
          '1512': 'BI系统',
          '1611': '学习平台',
          '1711': '人力资源',
          '1712': '考勤系统',
          '1811': '客户服务',
          '1812': '工单系统',
          '1911': '其他',
          '1912': '自定义',
        };
        return categoryMap[record.category || ''] || record.category || '-';
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
      valueType: 'select',
      valueEnum: {
        0: { text: '停用', status: 'Default' },
        1: { text: '启用', status: 'Success' },
      },
      render: (_, record) => (
        record.status === 1 ? (
          <Tag color="success" icon={<AppstoreOutlined />}>启用</Tag>
        ) : (
          <Tag color="default">停用</Tag>
        )
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      width: 350,
      fixed: 'right',
      render: (_, record) => [
        <Button
          key="permission"
          type="link"
          size="small"
          icon={<KeyOutlined />}
          onClick={() => {
            navigate(`/permissions/apps/permission?appId=${record.id}&appName=${encodeURIComponent(record.appName || '')}`);
          }}
        >
          权限
        </Button>,
        <Button
          key="roles"
          type="link"
          size="small"
          icon={<UsergroupAddOutlined />}
          onClick={() => {
            navigate(`/permissions/apps/roles?appId=${record.id}&appName=${encodeURIComponent(record.appName || '')}`);
          }}
        >
          角色
        </Button>,
        <Button
          key="resources"
          type="link"
          size="small"
          icon={<AppstoreOutlined />}
          onClick={() => handleResourcesMgmt(record)}
        >
          资源
        </Button>,
        <Button
          key="edit"
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={async () => {
            try {
              // 获取完整的应用数据
              const fullAppData = await appsService.get(record.id!);
              setCurrentApp(fullAppData);
              setEditModalVisible(true);
            } catch (error: any) {
              console.error('获取应用详情失败:', error);
              message.error('获取应用详情失败');
            }
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          key="delete"
          title="确定要删除此应用吗？"
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

  // 加载应用列表
  const loadApps = async (params: any) => {
    try {
      // 转换参数格式：ProTable 使用 current，但 MaxKey API 使用 pageNumber
      const requestParams: any = {
        appName: params.appName || '',
        displayName: params.displayName || '',
        protocol: params.protocol || (activeTab === 'all' ? '' : activeTab),
        pageNumber: params.current || 1,
        pageSize: params.pageSize || 10,
        pageSizeOptions: [10, 20, 50],
      };

      // 如果有日期范围
      if (params.startDate && params.endDate) {
        requestParams.startDate = params.startDate;
        requestParams.endDate = params.endDate;
        requestParams.startDatePicker = new Date(params.startDate).getTime();
        requestParams.endDatePicker = new Date(params.endDate).getTime();
      }

      console.log('请求参数:', requestParams);
      const result = await appsService.fetch(requestParams);
      console.log('API 响应:', result);
      
      // 处理返回类型：MaxKey API 返回 { records: number, rows: [] }
      // 响应拦截器已经提取了 data 部分，所以这里直接使用 result
      // 如果 result 是 { records: number, rows: [] } 格式
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
      
      console.log('处理后的数据:', { data, total });
      
      return {
        data: Array.isArray(data) ? data : [],
        success: true,
        total: typeof total === 'number' ? total : 0,
      };
    } catch (error: any) {
      console.error('加载应用列表失败:', error);
      console.error('错误详情:', error?.response?.data);
      const errorMessage = error?.response?.data?.message || error?.message || '加载应用列表失败';
      message.error(errorMessage);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // 选择协议后创建应用
  const handleSelectProtocol = (protocol: string) => {
    setSelectProtocolModalVisible(false);
    setCurrentApp({ protocol } as Application);
    setCreateModalVisible(true);
  };

  // 创建应用
  const handleCreate = async (values: any) => {
    try {
      await appsService.add(values);
      message.success('创建应用成功');
      setCreateModalVisible(false);
      setCurrentApp(undefined);
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      console.error('创建应用失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '创建应用失败';
      message.error(errorMessage);
      return false;
    }
  };

  // 更新应用
  const handleUpdate = async (values: any) => {
    if (!currentApp) return false;
    try {
      const submitData = {
        ...currentApp,
        ...values,
        id: currentApp.id,
      };
      await appsService.update(submitData);
      message.success('更新应用成功');
      setEditModalVisible(false);
      setCurrentApp(undefined);
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      console.error('更新应用失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '更新应用失败';
      message.error(errorMessage);
      return false;
    }
  };

  // 删除应用
  const handleDelete = async (id: string) => {
    try {
      await appsService.delete(id);
      message.success('删除应用成功');
      actionRef.current?.reload();
    } catch (error: any) {
      console.error('删除应用失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '删除应用失败';
      message.error(errorMessage);
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的应用');
      return;
    }
    try {
      await appsService.batchDelete(selectedRowKeys as string[]);
      message.success('批量删除成功');
      setSelectedRowKeys([]);
      actionRef.current?.reload();
    } catch (error: any) {
      console.error('批量删除失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '批量删除失败';
      message.error(errorMessage);
    }
  };

  // 资源管理
  const handleResourcesMgmt = (app: Application) => {
    navigate(`/permissions/apps/resources?appId=${app.id}&appName=${encodeURIComponent(app.appName || '')}`);
  };

  // 切换标签页
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    actionRef.current?.reload();
  };

  return (
    <PageContainer
      header={{
        title: '应用管理',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '应用管理' },
            { title: '应用列表' },
          ],
        },
      }}
      tabList={[
        { key: 'all', tab: '全部应用' },
        { key: 'OAuth_v2.0', tab: 'OAuth 2.0' },
        { key: 'SAML_v2.0', tab: 'SAML 2.0' },
        { key: 'CAS', tab: 'CAS' },
        { key: 'JWT', tab: 'JWT' },
        { key: 'Form_Based', tab: 'Form Based' },
        { key: 'Token_Based', tab: 'Token Based' },
      ]}
      tabActiveKey={activeTab}
      onTabChange={handleTabChange}
    >
      <ProTable<Application>
        columns={columns}
        actionRef={actionRef}
        request={loadApps}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          defaultCollapsed: true,
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50'],
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
            onClick={() => setSelectProtocolModalVisible(true)}
          >
            新建应用
          </Button>,
          <Popconfirm
            key="batchDelete"
            title="确定要批量删除选中的应用吗？"
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

      {/* 选择协议对话框 */}
      <Modal
        title="选择协议类型"
        open={selectProtocolModalVisible}
        onCancel={() => setSelectProtocolModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={[
            {
              title: '协议',
              dataIndex: 'protocol',
              key: 'protocol',
            },
            {
              title: '描述',
              dataIndex: 'description',
              key: 'description',
            },
            {
              title: '操作',
              key: 'action',
              render: (_, record) => (
                <Button
                  type="primary"
                  onClick={() => handleSelectProtocol(record.value)}
                >
                  选择
                </Button>
              ),
            },
          ]}
          dataSource={[
            { protocol: 'OAuth v2.0', value: 'OAuth_v2.0', description: 'OAuth 2.0 授权协议' },
            { protocol: 'OAuth v2.1', value: 'OAuth_v2.1', description: 'OAuth 2.1 授权协议' },
            { protocol: 'OpenID Connect v1.0', value: 'OpenID_Connect_v1.0', description: 'OpenID Connect 1.0 协议' },
            { protocol: 'SAML v2.0', value: 'SAML_v2.0', description: 'SAML 2.0 安全断言标记语言' },
            { protocol: 'CAS', value: 'CAS', description: 'CAS 中央认证服务' },
            { protocol: 'JWT', value: 'JWT', description: 'JWT JSON Web Token' },
            { protocol: 'Token Based', value: 'Token_Based', description: '基于 Token 的认证' },
            { protocol: 'Form Based', value: 'Form_Based', description: '基于表单的认证' },
            { protocol: 'Extend API', value: 'Extend_API', description: '扩展 API' },
            { protocol: 'Basic', value: 'Basic', description: '基础认证' },
          ]}
          pagination={false}
        />
      </Modal>

      {/* 创建应用对话框 */}
      <ModalForm
        title="创建应用"
        open={createModalVisible}
        onOpenChange={(visible) => {
          setCreateModalVisible(visible);
          if (!visible) {
            setCurrentApp(undefined);
          }
        }}
        onFinish={handleCreate}
        width={600}
        initialValues={{
          protocol: currentApp?.protocol,
          status: 1,
        }}
        modalProps={{
          destroyOnClose: true,
        }}
      >
        <ProFormText
          name="appCode"
          label="应用编码"
          placeholder="请输入应用编码"
          rules={[{ required: true, message: '请输入应用编码' }]}
        />
        <ProFormText
          name="appName"
          label="应用名称"
          placeholder="请输入应用名称"
          rules={[{ required: true, message: '请输入应用名称' }]}
        />
        <ProFormSelect
          name="protocol"
          label="协议类型"
          placeholder="请选择协议类型"
          rules={[{ required: true, message: '请选择协议类型' }]}
          options={protocolOptions}
          disabled={!!currentApp?.protocol}
        />
        <ProFormText
          name="category"
          label="应用类别"
          placeholder="请输入应用类别"
        />
        <ProFormText
          name="loginUrl"
          label="登录URL"
          placeholder="请输入登录URL"
        />
        <ProFormRadio.Group
          name="status"
          label="状态"
          initialValue={1}
          options={[
            { label: '启用', value: 1 },
            { label: '停用', value: 0 },
          ]}
        />
        <ProFormTextArea
          name="description"
          label="描述"
          placeholder="请输入描述信息"
          fieldProps={{ rows: 3 }}
        />
      </ModalForm>

      {/* 编辑应用对话框 */}
      <ModalForm
        title="编辑应用"
        open={editModalVisible}
        onOpenChange={(visible) => {
          setEditModalVisible(visible);
          if (!visible) {
            setCurrentApp(undefined);
          }
        }}
        onFinish={handleUpdate}
        width={600}
        initialValues={currentApp}
        modalProps={{
          destroyOnClose: true,
        }}
      >
        <ProFormText
          name="appCode"
          label="应用编码"
          placeholder="请输入应用编码"
          rules={[{ required: true, message: '请输入应用编码' }]}
        />
        <ProFormText
          name="appName"
          label="应用名称"
          placeholder="请输入应用名称"
          rules={[{ required: true, message: '请输入应用名称' }]}
        />
        <ProFormSelect
          name="protocol"
          label="协议类型"
          placeholder="请选择协议类型"
          rules={[{ required: true, message: '请选择协议类型' }]}
          options={protocolOptions}
        />
        <ProFormText
          name="category"
          label="应用类别"
          placeholder="请输入应用类别"
        />
        <ProFormText
          name="loginUrl"
          label="登录URL"
          placeholder="请输入登录URL"
        />
        <ProFormRadio.Group
          name="status"
          label="状态"
          options={[
            { label: '启用', value: 1 },
            { label: '停用', value: 0 },
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

export default ApplicationList;
