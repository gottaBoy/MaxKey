import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageContainer,
  ProTable,
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
  ProFormRadio,
  ProFormDigit,
  ProFormDependency,
} from '@ant-design/pro-components';
import type { ProColumns, ActionType, ProFormInstance } from '@ant-design/pro-components';
import {
  Button,
  Popconfirm,
  message,
  Tag,
  Image,
  Modal,
  Table,
  Upload,
  Tabs,
} from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  KeyOutlined,
  UsergroupAddOutlined,
  ReloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { Application } from '@/types/entity';
import appsService from '@/services/apps.service';
import request from '@/utils/request';
import './ApplicationList.less';
import { getAppIconUrl } from '@/utils/iconGenerator';

const ApplicationList: React.FC = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const editFormRef = useRef<ProFormInstance>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectProtocolModalVisible, setSelectProtocolModalVisible] = useState(false);
  const [currentApp, setCurrentApp] = useState<Application>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [editFileList, setEditFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewVisible, setPreviewVisible] = useState(false);

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

  // 类别选项
  const categoryOptions = [
    // { label: '无', value: 'none' },
    // { label: '办公协作', value: '1011' },
    // { label: '项目管理', value: '1012' },
    // { label: '文档管理', value: '1013' },
    // { label: '即时通讯', value: '1014' },
    // { label: '邮件系统', value: '1015' },
    { label: '视频平台', value: '1016' },
    // { label: '其他办公', value: '1017' },
    // { label: '财务系统', value: '1111' },
    // { label: 'ERP系统', value: '1112' },
    // { label: 'CRM系统', value: '1113' },
    // { label: '其他业务', value: '1114' },
    // { label: '开发工具', value: '1211' },
    // { label: '代码仓库', value: '1212' },
    // { label: 'CI/CD', value: '1213' },
    // { label: '监控运维', value: '1214' },
    // { label: '其他技术', value: '1215' },
    { label: 'IOT平台', value: '1311' },
    // { label: '安全工具', value: '1411' },
    // { label: '数据分析', value: '1511' },
    // { label: 'BI系统', value: '1512' },
    // { label: '学习平台', value: '1611' },
    // { label: '人力资源', value: '1711' },
    // { label: '考勤系统', value: '1712' },
    // { label: '客户服务', value: '1811' },
    // { label: '工单系统', value: '1812' },
    { label: '其他', value: '1911' },
    // { label: '自定义', value: '1912' },
  ];

  // 登出类型选项
  const logoutTypeOptions = [
    { label: '无', value: 0 },
    { label: '后端通道', value: 1 },
    { label: '前端通道', value: 2 },
  ];

  // 可见性选项
  const visibleOptions = [
    { label: '隐藏', value: 0 },
    { label: '全部', value: 1 },
    { label: '互联网', value: 2 },
    { label: '内网', value: 3 },
  ];

  // 资源管理
  const handleResourcesMgmt = (app: Application) => {
    if (!app.id) {
      message.error('应用ID不能为空');
      return;
    }
    const url = `/permissions/resources?appId=${app.id}&appName=${encodeURIComponent(app.appName || '')}`;
    console.log('跳转到资源管理页面:', url);
    navigate(url);
  };

  // 表格列定义
  const columns: ProColumns<Application>[] = [
    {
      title: '应用图标',
      dataIndex: 'icon',
      width: 80,
      hideInSearch: true,
      render: (_, record) => {
        // 优先使用 iconBase64，否则根据应用名称生成
        const iconUrl = getAppIconUrl(record.appName || '', record.iconBase64, record.id);
        return (
          <Image
            src={iconUrl}
            alt={record.appName || ''}
            width={30}
            height={30}
            fallback={getAppIconUrl(record.appName || '')}
            preview={false}
          />
        );
      },
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
              console.log('获取的应用数据:', fullAppData);
              
              // 应用编码字段显示 id 的值（因为表里只有 id，appCode 也是 id）
              const appCodeValue = fullAppData.id || '';
              const formData: any = {
                ...fullAppData,
                appCode: appCodeValue, // 应用编码使用 id 的值
              };
              console.log('处理后的表单数据:', formData);
              console.log('appCode 值（使用 id）:', appCodeValue);
              
              setCurrentApp(formData);
              setEditModalVisible(true);
              
              // 使用 requestAnimationFrame 确保 DOM 渲染完成后再设置表单值
              requestAnimationFrame(() => {
                setTimeout(() => {
                  if (editFormRef.current) {
                    console.log('设置表单值:', formData);
                    editFormRef.current.setFieldsValue(formData);
                    // 确保 appCode 字段被设置（使用 id 的值）
                    editFormRef.current.setFieldValue('appCode', appCodeValue);
                  }
                }, 50);
              });
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
      // 过滤空字符串参数，避免后端处理失败
      const requestParams: any = {
        pageNumber: params.current || 1,
        pageSize: params.pageSize || 10,
      };

      // 只添加非空的查询参数
      if (params.appName && params.appName.trim() !== '') {
        requestParams.appName = params.appName.trim();
      }
      if (params.displayName && params.displayName.trim() !== '') {
        requestParams.displayName = params.displayName.trim();
      }
      // 从 params 中获取 activeTab，如果没有则使用 state 中的 activeTab
      const currentActiveTab = params.activeTab || activeTab;
      const protocolValue = params.protocol || (currentActiveTab === 'all' ? '' : currentActiveTab);
      if (protocolValue && protocolValue.trim() !== '') {
        requestParams.protocol = protocolValue.trim();
      }

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
      // 如果后端返回 null 或 undefined，返回空列表
      let data: any[] = [];
      let total = 0;
      
      // 如果 result 为 null 或 undefined，直接返回空列表
      if (!result) {
        console.warn('后端返回 null 或 undefined，返回空列表');
        return {
          data: [],
          success: true,
          total: 0,
        };
      }
      
      if (typeof result === 'object') {
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
      // 处理数组字段：转换为逗号分隔的字符串
      const submitData: any = { ...values };
      
      // OAuth 相关字段
      if (Array.isArray(submitData.authorizedGrantTypes)) {
        submitData.authorizedGrantTypes = submitData.authorizedGrantTypes.filter((v: string) => v && v.trim() !== '').join(',');
      }
      if (Array.isArray(submitData.scope)) {
        submitData.scope = submitData.scope.filter((v: string) => v && v.trim() !== '').join(',');
      }
      
      await appsService.add(submitData);
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
      // 处理数组字段：转换为逗号分隔的字符串
      const submitData: any = {
        ...currentApp,
        ...values,
        id: currentApp.id,
      };
      
      // OAuth 相关字段
      if (Array.isArray(submitData.authorizedGrantTypes)) {
        submitData.authorizedGrantTypes = submitData.authorizedGrantTypes.filter((v: string) => v && v.trim() !== '').join(',');
      }
      if (Array.isArray(submitData.scope)) {
        submitData.scope = submitData.scope.filter((v: string) => v && v.trim() !== '').join(',');
      }
      
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

  // 切换标签页
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    actionRef.current?.reload();
  };

  // 生成 Secret
  const handleGenerateSecret = async (formRef: ProFormInstance | undefined) => {
    try {
      const result = await request.get('/maxkey-mgt-api/apps/generateSecret', {
        params: { type: 'base' },
      });
      if (formRef) {
        formRef.setFieldValue('secret', result);
      }
      message.success('Secret 生成成功');
    } catch (error: any) {
      console.error('生成 Secret 失败:', error);
      message.error('生成 Secret 失败');
    }
  };

  // 预览图标
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
  };

  // 获取 Base64
  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // 处理图标上传变化（编辑）
  const handleEditUploadChange: UploadProps['onChange'] = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1); // 只保留最后一个文件
    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    setEditFileList(newFileList);
    if (info.file.status === 'done') {
      message.success('图标上传成功');
      // 设置 iconId
      if (editFormRef.current) {
        editFormRef.current.setFieldValue('iconId', info.file.response?.data);
      }
    } else if (info.file.status === 'error') {
      message.error('图标上传失败');
    }
  };

  // 监听编辑弹框打开和数据变化，设置表单值
  useEffect(() => {
    if (editModalVisible && currentApp && editFormRef.current) {
      // 使用 requestAnimationFrame 确保表单已渲染
      const timer = setTimeout(() => {
        if (editFormRef.current && currentApp) {
          // 应用编码字段显示 id 的值（因为表里只有 id，appCode 也是 id）
          const appCodeValue = currentApp.id || '';
          const formData: any = {
            ...currentApp,
            appCode: appCodeValue, // 应用编码使用 id 的值
          };
          console.log('useEffect 设置表单值:', formData);
          console.log('appCode 值（使用 id）:', appCodeValue);
          editFormRef.current.setFieldsValue(formData);
          // 单独设置 appCode，确保它被正确填充
          editFormRef.current.setFieldValue('appCode', appCodeValue);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [editModalVisible, currentApp]);

  // 组件挂载时触发初始请求
  useEffect(() => {
    actionRef.current?.reload();
  }, []);

  return (
    <PageContainer
      header={{
        // title: '应用管理',
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
        params={{ activeTab }}
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
        width={900}
      >
        <Tabs
          items={[
            {
              key: 'standard',
              label: '标准协议',
              children: (
                <Table
                  columns={[
                    {
                      title: '图标',
                      dataIndex: 'icon',
                      key: 'icon',
                      width: 100,
                      render: (_, record: any) => (
                        record.icon ? (
                          <img 
                            src={record.icon} 
                            alt={record.protocol} 
                            style={{ height: 40 }} 
                            onError={(e) => {
                              // 如果图片加载失败，隐藏图片
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>-</div>
                        )
                      ),
                    },
                    {
                      title: '协议',
                      dataIndex: 'protocol',
                      key: 'protocol',
                      width: 200,
                    },
                    {
                      title: '描述',
                      dataIndex: 'description',
                      key: 'description',
                    },
                    {
                      title: '操作',
                      key: 'action',
                      width: 120,
                      render: (_, record) => (
                        <Button
                          type="primary"
                          onClick={() => handleSelectProtocol(record.value)}
                        >
                          新增
                        </Button>
                      ),
                    },
                  ]}
                  dataSource={[
                    { 
                      protocol: 'OAuth v2.0', 
                      value: 'OAuth_v2.0', 
                      description: 'OAuth 2.0 授权协议，用于第三方应用授权访问用户资源',
                      icon: '/assets/protocol/oauth2.png',
                    },
                    { 
                      protocol: 'OAuth v2.1', 
                      value: 'OAuth_v2.1', 
                      description: 'OAuth 2.1 授权协议，OAuth 2.0 的改进版本',
                      icon: '/assets/protocol/oauth2.png',
                    },
                    { 
                      protocol: 'OpenID Connect v1.0', 
                      value: 'OpenID_Connect_v1.0', 
                      description: 'OpenID Connect 1.0 协议，基于 OAuth 2.0 的身份认证层',
                      icon: '/assets/protocol/oidc.png',
                    },
                    { 
                      protocol: 'SAML v2.0', 
                      value: 'SAML_v2.0', 
                      description: 'SAML 2.0 安全断言标记语言，用于企业级单点登录',
                      icon: '/assets/protocol/saml.jpg',
                    },
                    { 
                      protocol: 'CAS', 
                      value: 'CAS', 
                      description: 'CAS 中央认证服务，提供单点登录解决方案',
                      icon: '/assets/protocol/cas.png',
                    },
                    { 
                      protocol: 'JWT', 
                      value: 'JWT', 
                      description: 'JWT JSON Web Token，用于安全传输信息的开放标准',
                      icon: '/assets/protocol/jwt.jpg',
                    },
                  ]}
                  pagination={false}
                  size="middle"
                  bordered
                />
              ),
            },
            {
              key: 'custom',
              label: '定制协议',
              children: (
                <Table
                  columns={[
                    {
                      title: '图标',
                      dataIndex: 'icon',
                      key: 'icon',
                      width: 100,
                      render: (_, record: any) => (
                        record.icon ? (
                          <img 
                            src={record.icon} 
                            alt={record.protocol} 
                            style={{ height: 40 }} 
                            onError={(e) => {
                              // 如果图片加载失败，隐藏图片
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>-</div>
                        )
                      ),
                    },
                    {
                      title: '协议',
                      dataIndex: 'protocol',
                      key: 'protocol',
                      width: 200,
                    },
                    {
                      title: '描述',
                      dataIndex: 'description',
                      key: 'description',
                    },
                    {
                      title: '操作',
                      key: 'action',
                      width: 120,
                      render: (_, record) => (
                        <Button
                          type="primary"
                          onClick={() => handleSelectProtocol(record.value)}
                        >
                          新增
                        </Button>
                      ),
                    },
                  ]}
                  dataSource={[
                    { 
                      protocol: 'Token Based', 
                      value: 'Token_Based', 
                      description: '基于 Token 的认证，使用令牌进行身份验证',
                      icon: '/assets/protocol/token.png',
                    },
                    { 
                      protocol: 'Form Based', 
                      value: 'Form_Based', 
                      description: '基于表单的认证，使用用户名密码表单登录',
                      icon: '/assets/protocol/form.png',
                    },
                    { 
                      protocol: 'Extend API', 
                      value: 'Extend_API', 
                      description: '扩展 API，自定义 API 接口集成',
                      icon: '/assets/protocol/api.png',
                    },
                    { 
                      protocol: 'Basic', 
                      value: 'Basic', 
                      description: '基础认证，HTTP Basic 认证方式',
                      icon: '/assets/protocol/basic.png',
                    },
                  ]}
                  pagination={false}
                  size="middle"
                  bordered
                />
              ),
            },
          ]}
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
        width={900}
        initialValues={{
          protocol: currentApp?.protocol,
          status: 1,
          isExtendAttr: 0,
          visible: 1,
          logoutType: 0,
        }}
        modalProps={{
          destroyOnClose: true,
        }}
      >
        <Tabs
          items={[
            {
              key: 'basic',
              label: '基础信息',
              children: (
                <>
                  <ProFormText
                    name="appCode"
                    label="应用编码（ID）"
                    placeholder="请输入应用编码（可选）"
                    tooltip="新增时可选，系统会自动生成"
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
                  <ProFormSelect
                    name="category"
                    label="应用类别"
                    placeholder="请选择应用类别"
                    options={categoryOptions}
                  />
                  <ProFormText
                    name="loginUrl"
                    label="登录URL"
                    placeholder="请输入登录URL"
                    rules={[{ required: true, message: '请输入登录URL' }]}
                  />
                  <ProFormRadio.Group
                    name="frequently"
                    label="常用"
                    initialValue="no"
                    options={[
                      { label: '是', value: 'yes' },
                      { label: '否', value: 'no' },
                    ]}
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
                  <ProFormRadio.Group
                    name="isExtendAttr"
                    label="扩展属性"
                    initialValue={0}
                    options={[
                      { label: '否', value: 0 },
                      { label: '是', value: 1 },
                    ]}
                  />
                </>
              ),
            },
            {
              key: 'protocol',
              label: '协议配置',
              children: (
                <ProFormDependency name={['protocol']}>
                  {({ protocol }) => {
                    // OAuth 2.0 / OAuth 2.1 / OpenID Connect v1.0
                    if (protocol === 'OAuth_v2.0' || protocol === 'OAuth_v2.1' || protocol === 'OpenID_Connect_v1.0') {
                      return (
                        <>
                          <ProFormTextArea
                            name="registeredRedirectUris"
                            label="注册重定向URI"
                            placeholder="请输入注册重定向URI（每行一个）"
                            rules={[{ required: true, message: '请输入注册重定向URI' }]}
                            fieldProps={{ rows: 3 }}
                          />
                          <ProFormSelect
                            name="authorizedGrantTypes"
                            label="授权类型"
                            placeholder="请选择授权类型"
                            rules={[{ required: true, message: '请选择授权类型' }]}
                            options={[
                              { label: 'authorization_code', value: 'authorization_code' },
                              { label: 'password', value: 'password' },
                              { label: 'client_credentials', value: 'client_credentials' },
                              { label: 'implicit', value: 'implicit' },
                              { label: 'id_token', value: 'id_token' },
                              { label: 'token', value: 'token' },
                              { label: 'refresh_token', value: 'refresh_token' },
                            ]}
                            fieldProps={{ mode: 'multiple' }}
                          />
                          <ProFormSelect
                            name="subject"
                            label="主体"
                            placeholder="请选择主体"
                            rules={[{ required: true, message: '请选择主体' }]}
                            options={[
                              { label: '用户名', value: 'username' },
                              { label: '员工编号', value: 'employeeNumber' },
                              { label: '邮箱', value: 'email' },
                              { label: '手机号', value: 'mobile' },
                              { label: 'Windows账户', value: 'windowsaccount' },
                              { label: '用户ID', value: 'userId' },
                            ]}
                          />
                          <ProFormSelect
                            name="scope"
                            label="作用域"
                            placeholder="请选择作用域"
                            rules={[{ required: true, message: '请选择作用域' }]}
                            options={[
                              { label: 'read', value: 'read' },
                              { label: 'write', value: 'write' },
                              { label: 'trust', value: 'trust' },
                              { label: 'openid', value: 'openid' },
                              { label: 'profile', value: 'profile' },
                              { label: 'email', value: 'email' },
                              { label: 'phone', value: 'phone' },
                              { label: 'address', value: 'address' },
                              { label: 'all', value: 'all' },
                            ]}
                            fieldProps={{ mode: 'multiple' }}
                          />
                          <ProFormRadio.Group
                            name="approvalPrompt"
                            label="审批提示"
                            rules={[{ required: true, message: '请选择审批提示' }]}
                            options={[
                              { label: '强制', value: 'force' },
                              { label: '自动', value: 'auto' },
                            ]}
                          />
                          <ProFormRadio.Group
                            name="pkce"
                            label="PKCE"
                            rules={[{ required: true, message: '请选择PKCE' }]}
                            options={[
                              { label: '是', value: 'yes' },
                              { label: '否', value: 'no' },
                            ]}
                          />
                          <ProFormDigit
                            name="accessTokenValiditySeconds"
                            label="访问令牌有效期"
                            placeholder="请输入访问令牌有效期（秒）"
                            rules={[{ required: true, message: '请输入访问令牌有效期' }]}
                            min={0}
                            fieldProps={{ precision: 0, addonAfter: '秒' }}
                          />
                          <ProFormDigit
                            name="refreshTokenValiditySeconds"
                            label="刷新令牌有效期"
                            placeholder="请输入刷新令牌有效期（秒）"
                            rules={[{ required: true, message: '请输入刷新令牌有效期' }]}
                            min={0}
                            fieldProps={{ precision: 0, addonAfter: '秒' }}
                          />
                          {protocol === 'OpenID_Connect_v1.0' && (
                            <>
                              <ProFormText
                                name="issuer"
                                label="发行者"
                                placeholder="请输入发行者"
                              />
                              <ProFormText
                                name="jwksUri"
                                label="JWKS URI"
                                placeholder="请输入JWKS URI"
                              />
                            </>
                          )}
                        </>
                      );
                    }
                    
                    // SAML 2.0
                    if (protocol === 'SAML_v2.0') {
                      return (
                        <>
                          <ProFormSelect
                            name="binding"
                            label="绑定方式"
                            placeholder="请选择绑定方式"
                            rules={[{ required: true, message: '请选择绑定方式' }]}
                            options={[
                              { label: 'Redirect-Post', value: 'Redirect-Post' },
                              { label: 'Post-Post', value: 'Post-Post' },
                              { label: 'IdpInit-Post', value: 'IdpInit-Post' },
                              { label: 'Redirect-PostSimpleSign', value: 'Redirect-PostSimpleSign' },
                              { label: 'Post-PostSimpleSign', value: 'Post-PostSimpleSign' },
                              { label: 'IdpInit-PostSimpleSign', value: 'IdpInit-PostSimpleSign' },
                            ]}
                          />
                          <ProFormText
                            name="entityId"
                            label="实体ID"
                            placeholder="请输入实体ID"
                            rules={[{ required: true, message: '请输入实体ID' }]}
                          />
                          <ProFormText
                            name="audience"
                            label="受众"
                            placeholder="请输入受众"
                            rules={[{ required: true, message: '请输入受众' }]}
                          />
                          <ProFormText
                            name="issuer"
                            label="发行者"
                            placeholder="请输入发行者"
                            rules={[{ required: true, message: '请输入发行者' }]}
                          />
                          <ProFormSelect
                            name="signature"
                            label="签名算法"
                            placeholder="请选择签名算法"
                            rules={[{ required: true, message: '请选择签名算法' }]}
                            options={[
                              { label: 'RSAwithSHA1', value: 'RSAwithSHA1' },
                              { label: 'RSAwithSHA256', value: 'RSAwithSHA256' },
                              { label: 'RSAwithSHA384', value: 'RSAwithSHA384' },
                              { label: 'RSAwithSHA512', value: 'RSAwithSHA512' },
                              { label: 'RSAwithMD5', value: 'RSAwithMD5' },
                              { label: 'RSAwithRIPEMD160', value: 'RSAwithRIPEMD160' },
                              { label: 'DSAwithSHA1', value: 'DSAwithSHA1' },
                              { label: 'ECDSAwithSHA1', value: 'ECDSAwithSHA1' },
                              { label: 'ECDSAwithSHA256', value: 'ECDSAwithSHA256' },
                              { label: 'ECDSAwithSHA384', value: 'ECDSAwithSHA384' },
                              { label: 'ECDSAwithSHA512', value: 'ECDSAwithSHA512' },
                              { label: 'HMAC-MD5', value: 'HMAC-MD5' },
                              { label: 'HMAC-SHA1', value: 'HMAC-SHA1' },
                              { label: 'HMAC-SHA256', value: 'HMAC-SHA256' },
                              { label: 'HMAC-SHA384', value: 'HMAC-SHA384' },
                              { label: 'HMAC-SHA512', value: 'HMAC-SHA512' },
                              { label: 'HMAC-RIPEMD160', value: 'HMAC-RIPEMD160' },
                            ]}
                          />
                          <ProFormSelect
                            name="digestMethod"
                            label="摘要方法"
                            placeholder="请选择摘要方法"
                            rules={[{ required: true, message: '请选择摘要方法' }]}
                            options={[
                              { label: 'MD5', value: 'MD5' },
                              { label: 'SHA1', value: 'SHA1' },
                              { label: 'SHA256', value: 'SHA256' },
                              { label: 'SHA384', value: 'SHA384' },
                              { label: 'SHA512', value: 'SHA512' },
                              { label: 'RIPEMD-160', value: 'RIPEMD-160' },
                            ]}
                          />
                          <ProFormSelect
                            name="encrypted"
                            label="加密"
                            placeholder="请选择是否加密"
                            rules={[{ required: true, message: '请选择是否加密' }]}
                            options={[
                              { label: '否', value: 'no' },
                              { label: '是', value: 'yes' },
                            ]}
                          />
                        </>
                      );
                    }
                    
                    // CAS
                    if (protocol === 'CAS') {
                      return (
                        <>
                          <ProFormText
                            name="service"
                            label="服务"
                            placeholder="请输入服务"
                            rules={[{ required: true, message: '请输入服务' }]}
                          />
                          <ProFormText
                            name="callbackUrl"
                            label="回调URL"
                            placeholder="请输入回调URL"
                            rules={[{ required: true, message: '请输入回调URL' }]}
                          />
                          <ProFormSelect
                            name="casUser"
                            label="CAS用户"
                            placeholder="请选择CAS用户"
                            rules={[{ required: true, message: '请选择CAS用户' }]}
                            options={[
                              { label: '用户名', value: 'username' },
                              { label: '员工编号', value: 'employeeNumber' },
                              { label: '邮箱', value: 'email' },
                              { label: '手机号', value: 'mobile' },
                              { label: 'Windows账户', value: 'windowsaccount' },
                              { label: '用户ID', value: 'userId' },
                            ]}
                          />
                          <ProFormDigit
                            name="expires"
                            label="过期时间"
                            placeholder="请输入过期时间（秒）"
                            rules={[{ required: true, message: '请输入过期时间' }]}
                            min={0}
                            fieldProps={{ precision: 0, addonAfter: '秒' }}
                          />
                        </>
                      );
                    }
                    
                    // JWT
                    if (protocol === 'JWT') {
                      return (
                        <>
                          <ProFormText
                            name="redirectUri"
                            label="重定向URI"
                            placeholder="请输入重定向URI"
                            rules={[{ required: true, message: '请输入重定向URI' }]}
                          />
                          <ProFormSelect
                            name="subject"
                            label="主体"
                            placeholder="请选择主体"
                            rules={[{ required: true, message: '请选择主体' }]}
                            options={[
                              { label: '用户名', value: 'username' },
                              { label: '员工编号', value: 'employeeNumber' },
                              { label: '邮箱', value: 'email' },
                              { label: '手机号', value: 'mobile' },
                              { label: 'Windows账户', value: 'windowsaccount' },
                              { label: '用户ID', value: 'userId' },
                            ]}
                          />
                          <ProFormSelect
                            name="tokenType"
                            label="令牌类型"
                            placeholder="请选择令牌类型"
                            rules={[{ required: true, message: '请选择令牌类型' }]}
                            options={[
                              { label: 'GET', value: 'GET' },
                              { label: 'POST', value: 'POST' },
                              { label: 'LTPA', value: 'LTPA' },
                            ]}
                          />
                          <ProFormText
                            name="jwtName"
                            label="JWT名称"
                            placeholder="请输入JWT名称"
                            rules={[{ required: true, message: '请输入JWT名称' }]}
                          />
                          <ProFormDigit
                            name="expires"
                            label="过期时间"
                            placeholder="请输入过期时间（秒）"
                            rules={[{ required: true, message: '请输入过期时间' }]}
                            min={0}
                            fieldProps={{ precision: 0, addonAfter: '秒' }}
                          />
                        </>
                      );
                    }
                    
                    // Token Based
                    if (protocol === 'Token_Based') {
                      return (
                        <>
                          <ProFormText
                            name="redirectUri"
                            label="重定向URI"
                            placeholder="请输入重定向URI"
                            rules={[{ required: true, message: '请输入重定向URI' }]}
                          />
                          <ProFormSelect
                            name="tokenType"
                            label="令牌类型"
                            placeholder="请选择令牌类型"
                            rules={[{ required: true, message: '请选择令牌类型' }]}
                            options={[
                              { label: 'POST', value: 'POST' },
                              { label: 'GET', value: 'GET' },
                              { label: 'LTPA', value: 'LTPA' },
                            ]}
                          />
                          <ProFormText
                            name="cookieName"
                            label="Cookie名称"
                            placeholder="请输入Cookie名称"
                            rules={[{ required: true, message: '请输入Cookie名称' }]}
                          />
                          <ProFormSelect
                            name="algorithm"
                            label="算法"
                            placeholder="请选择算法"
                            rules={[{ required: true, message: '请选择算法' }]}
                            options={[
                              { label: 'HMAC-SHA1', value: 'HMAC-SHA1' },
                              { label: 'HMAC-SHA256', value: 'HMAC-SHA256' },
                              { label: 'HMAC-SHA512', value: 'HMAC-SHA512' },
                              { label: 'RSA-SHA1', value: 'RSA-SHA1' },
                              { label: 'RSA-SHA256', value: 'RSA-SHA256' },
                              { label: 'RSA-SHA512', value: 'RSA-SHA512' },
                            ]}
                          />
                        </>
                      );
                    }
                    
                    // Form Based
                    if (protocol === 'Form_Based') {
                      return (
                        <>
                          <ProFormText
                            name="redirectUri"
                            label="重定向URI"
                            placeholder="请输入重定向URI"
                            rules={[{ required: true, message: '请输入重定向URI' }]}
                          />
                          <ProFormText
                            name="usernameMapping"
                            label="用户名映射"
                            placeholder="请输入用户名映射"
                            rules={[{ required: true, message: '请输入用户名映射' }]}
                          />
                          <ProFormText
                            name="passwordMapping"
                            label="密码映射"
                            placeholder="请输入密码映射"
                            rules={[{ required: true, message: '请输入密码映射' }]}
                          />
                          <ProFormText
                            name="authorizeView"
                            label="授权视图"
                            placeholder="请输入授权视图"
                          />
                        </>
                      );
                    }
                    
                    // Extend API
                    if (protocol === 'Extend_API') {
                      return (
                        <>
                          <ProFormText
                            name="principal"
                            label="主体"
                            placeholder="请输入主体"
                            rules={[{ required: true, message: '请输入主体' }]}
                          />
                          <ProFormText.Password
                            name="credentials"
                            label="凭证"
                            placeholder="请输入凭证"
                            rules={[{ required: true, message: '请输入凭证' }]}
                          />
                          <ProFormRadio.Group
                            name="credential"
                            label="凭证类型"
                            rules={[{ required: true, message: '请选择凭证类型' }]}
                            options={[
                              { label: '用户自定义', value: 'user-defined' },
                              { label: '共享', value: 'shared' },
                              { label: '系统', value: 'system' },
                            ]}
                          />
                          <ProFormDependency name={['credential']}>
                            {({ credential }) => {
                              if (credential === 'system') {
                                return (
                                  <ProFormSelect
                                    name="systemUserAttr"
                                    label="系统用户属性"
                                    placeholder="请选择系统用户属性"
                                    rules={[{ required: true, message: '请选择系统用户属性' }]}
                                    options={[
                                      { label: '用户名', value: 'username' },
                                      { label: '员工编号', value: 'employeeNumber' },
                                      { label: '邮箱', value: 'email' },
                                      { label: '手机号', value: 'mobile' },
                                      { label: 'Windows账户', value: 'windowsaccount' },
                                      { label: '用户ID', value: 'userId' },
                                    ]}
                                  />
                                );
                              }
                              return null;
                            }}
                          </ProFormDependency>
                        </>
                      );
                    }
                    
                    // Basic
                    if (protocol === 'Basic') {
                      return (
                        <>
                          <ProFormText
                            name="principal"
                            label="主体"
                            placeholder="请输入主体"
                            rules={[{ required: true, message: '请输入主体' }]}
                          />
                          <ProFormText.Password
                            name="credentials"
                            label="凭证"
                            placeholder="请输入凭证"
                            rules={[{ required: true, message: '请输入凭证' }]}
                          />
                        </>
                      );
                    }
                    
                    // 默认情况：如果协议未选择或不是上述协议，显示提示
                    return (
                      <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                        请先选择协议类型
                      </div>
                    );
                  }}
                </ProFormDependency>
              ),
            },
            {
              key: 'extra',
              label: '额外信息',
              children: (
                <>
                  <ProFormText
                    name="logoutUrl"
                    label="登出URL"
                    placeholder="请输入登出URL"
                  />
                  <ProFormSelect
                    name="logoutType"
                    label="登出类型"
                    placeholder="请选择登出类型"
                    options={logoutTypeOptions}
                  />
                  <ProFormSelect
                    name="visible"
                    label="可见性"
                    placeholder="请选择可见性"
                    options={visibleOptions}
                  />
                  <ProFormDigit
                    name="sortIndex"
                    label="排序号"
                    placeholder="请输入排序号"
                    min={0}
                    fieldProps={{ precision: 0 }}
                  />
                  <ProFormText
                    name="vendor"
                    label="供应商"
                    placeholder="请输入供应商名称"
                  />
                  <ProFormText
                    name="vendorUrl"
                    label="供应商URL"
                    placeholder="请输入供应商URL"
                  />
                  <ProFormTextArea
                    name="description"
                    label="描述"
                    placeholder="请输入描述信息"
                    fieldProps={{ rows: 3 }}
                  />
                </>
              ),
            },
          ]}
        />
      </ModalForm>

      {/* 编辑应用对话框 */}
      <ModalForm
        title="编辑应用"
        formRef={editFormRef}
        open={editModalVisible}
        onOpenChange={(visible) => {
          setEditModalVisible(visible);
          if (!visible) {
            setCurrentApp(undefined);
            setEditFileList([]);
            editFormRef.current?.resetFields();
          } else if (visible && currentApp) {
            // 弹框打开时，如果已有数据，立即设置表单值
            requestAnimationFrame(() => {
              setTimeout(() => {
                if (editFormRef.current && currentApp) {
                  // 应用编码字段显示 id 的值（因为表里只有 id，appCode 也是 id）
                  const appCodeValue = currentApp.id || '';
                  const formData: any = {
                    ...currentApp,
                    appCode: appCodeValue, // 应用编码使用 id 的值
                  };
                  
                  // 处理数组字段：将字符串转换为数组（用于多选字段）
                  if (formData.authorizedGrantTypes && typeof formData.authorizedGrantTypes === 'string') {
                    formData.authorizedGrantTypes = formData.authorizedGrantTypes.split(',').filter((v: string) => v && v.trim() !== '');
                  }
                  if (formData.scope && typeof formData.scope === 'string') {
                    formData.scope = formData.scope.split(',').filter((v: string) => v && v.trim() !== '');
                  }
                  
                  console.log('弹框打开时设置表单值:', formData);
                  console.log('appCode 值（使用 id）:', appCodeValue);
                  editFormRef.current.setFieldsValue(formData);
                  editFormRef.current.setFieldValue('appCode', appCodeValue);
                  
                  // 设置图标文件列表
                  if (currentApp.iconBase64) {
                    setEditFileList([
                      {
                        uid: currentApp.id || '-1',
                        name: currentApp.appName || 'icon',
                        status: 'done',
                        url: currentApp.iconBase64,
                      },
                    ]);
                  }
                }
              }, 50);
            });
          }
        }}
        onFinish={handleUpdate}
        width={900}
        initialValues={currentApp ? (() => {
          const initData: any = {
            ...currentApp,
            // 应用编码字段显示 id 的值（因为表里只有 id，appCode 也是 id）
            appCode: currentApp.id || '',
          };
          
          // 处理数组字段：将字符串转换为数组（用于多选字段）
          if (initData.authorizedGrantTypes && typeof initData.authorizedGrantTypes === 'string') {
            initData.authorizedGrantTypes = initData.authorizedGrantTypes.split(',').filter((v: string) => v && v.trim() !== '');
          }
          if (initData.scope && typeof initData.scope === 'string') {
            initData.scope = initData.scope.split(',').filter((v: string) => v && v.trim() !== '');
          }
          
          return initData;
        })() : undefined}
        modalProps={{
          destroyOnClose: true,
        }}
      >
        <Tabs
          items={[
            {
              key: 'basic',
              label: '基础信息',
              children: (
                <>
                  <ProFormText
                    name="appCode"
                    label="应用编码（ID）"
                    placeholder="应用编码"
                    fieldProps={{
                      readOnly: true,
                      disabled: true,
                    }}
                  />
                  <ProFormText
                    name="id"
                    label="ID"
                    fieldProps={{
                      readOnly: true,
                      disabled: true,
                    }}
                    hidden
                  />
                  <ProFormText
                    name="secret"
                    label="Secret"
                    placeholder="Secret"
                    fieldProps={{
                      readOnly: true,
                      addonAfter: (
                        <Button
                          type="primary"
                          icon={<ReloadOutlined />}
                          onClick={() => handleGenerateSecret(editFormRef.current)}
                        >
                          生成
                        </Button>
                      ),
                    }}
                  />
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8 }}>应用图标</label>
                    <Upload
                      action="/maxkey-mgt-api/file/upload"
                      listType="picture-card"
                      fileList={editFileList}
                      onPreview={handlePreview}
                      onChange={handleEditUploadChange}
                      name="uploadFile"
                    >
                      {editFileList.length < 1 && <div><UploadOutlined /> 上传</div>}
                    </Upload>
                    <Modal
                      open={previewVisible}
                      title="预览图标"
                      footer={null}
                      onCancel={() => setPreviewVisible(false)}
                    >
                      <img alt="预览" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                  </div>
                  <ProFormText
                    name="iconId"
                    hidden
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
                    fieldProps={{ disabled: true }}
                  />
                  <ProFormSelect
                    name="category"
                    label="应用类别"
                    placeholder="请选择应用类别"
                    options={categoryOptions}
                  />
                  <ProFormText
                    name="loginUrl"
                    label="登录URL"
                    placeholder="请输入登录URL"
                    rules={[{ required: true, message: '请输入登录URL' }]}
                  />
                  <ProFormRadio.Group
                    name="frequently"
                    label="常用"
                    options={[
                      { label: '是', value: 'yes' },
                      { label: '否', value: 'no' },
                    ]}
                  />
                  <ProFormRadio.Group
                    name="status"
                    label="状态"
                    options={[
                      { label: '启用', value: 1 },
                      { label: '停用', value: 0 },
                    ]}
                  />
                  <ProFormRadio.Group
                    name="isExtendAttr"
                    label="扩展属性"
                    options={[
                      { label: '否', value: 0 },
                      { label: '是', value: 1 },
                    ]}
                  />
                </>
              ),
            },
            {
              key: 'protocol',
              label: '协议配置',
              children: (
                <ProFormDependency name={['protocol']}>
                  {({ protocol }) => {
                    // OAuth 2.0 / OAuth 2.1 / OpenID Connect v1.0
                    if (protocol === 'OAuth_v2.0' || protocol === 'OAuth_v2.1' || protocol === 'OpenID_Connect_v1.0') {
                      return (
                        <>
                          <ProFormTextArea
                            name="registeredRedirectUris"
                            label="注册重定向URI"
                            placeholder="请输入注册重定向URI（每行一个）"
                            rules={[{ required: true, message: '请输入注册重定向URI' }]}
                            fieldProps={{ rows: 3 }}
                          />
                          <ProFormSelect
                            name="authorizedGrantTypes"
                            label="授权类型"
                            placeholder="请选择授权类型"
                            rules={[{ required: true, message: '请选择授权类型' }]}
                            options={[
                              { label: 'authorization_code', value: 'authorization_code' },
                              { label: 'password', value: 'password' },
                              { label: 'client_credentials', value: 'client_credentials' },
                              { label: 'implicit', value: 'implicit' },
                              { label: 'id_token', value: 'id_token' },
                              { label: 'token', value: 'token' },
                              { label: 'refresh_token', value: 'refresh_token' },
                            ]}
                            fieldProps={{ mode: 'multiple' }}
                          />
                          <ProFormSelect
                            name="subject"
                            label="主体"
                            placeholder="请选择主体"
                            rules={[{ required: true, message: '请选择主体' }]}
                            options={[
                              { label: '用户名', value: 'username' },
                              { label: '员工编号', value: 'employeeNumber' },
                              { label: '邮箱', value: 'email' },
                              { label: '手机号', value: 'mobile' },
                              { label: 'Windows账户', value: 'windowsaccount' },
                              { label: '用户ID', value: 'userId' },
                            ]}
                          />
                          <ProFormSelect
                            name="scope"
                            label="作用域"
                            placeholder="请选择作用域"
                            rules={[{ required: true, message: '请选择作用域' }]}
                            options={[
                              { label: 'read', value: 'read' },
                              { label: 'write', value: 'write' },
                              { label: 'trust', value: 'trust' },
                              { label: 'openid', value: 'openid' },
                              { label: 'profile', value: 'profile' },
                              { label: 'email', value: 'email' },
                              { label: 'phone', value: 'phone' },
                              { label: 'address', value: 'address' },
                              { label: 'all', value: 'all' },
                            ]}
                            fieldProps={{ mode: 'multiple' }}
                          />
                          <ProFormRadio.Group
                            name="approvalPrompt"
                            label="审批提示"
                            rules={[{ required: true, message: '请选择审批提示' }]}
                            options={[
                              { label: '强制', value: 'force' },
                              { label: '自动', value: 'auto' },
                            ]}
                          />
                          <ProFormRadio.Group
                            name="pkce"
                            label="PKCE"
                            rules={[{ required: true, message: '请选择PKCE' }]}
                            options={[
                              { label: '是', value: 'yes' },
                              { label: '否', value: 'no' },
                            ]}
                          />
                          <ProFormDigit
                            name="accessTokenValiditySeconds"
                            label="访问令牌有效期"
                            placeholder="请输入访问令牌有效期（秒）"
                            rules={[{ required: true, message: '请输入访问令牌有效期' }]}
                            min={0}
                            fieldProps={{ precision: 0, addonAfter: '秒' }}
                          />
                          <ProFormDigit
                            name="refreshTokenValiditySeconds"
                            label="刷新令牌有效期"
                            placeholder="请输入刷新令牌有效期（秒）"
                            rules={[{ required: true, message: '请输入刷新令牌有效期' }]}
                            min={0}
                            fieldProps={{ precision: 0, addonAfter: '秒' }}
                          />
                          {protocol === 'OpenID_Connect_v1.0' && (
                            <>
                              <ProFormText
                                name="issuer"
                                label="发行者"
                                placeholder="请输入发行者"
                              />
                              <ProFormText
                                name="jwksUri"
                                label="JWKS URI"
                                placeholder="请输入JWKS URI"
                              />
                            </>
                          )}
                        </>
                      );
                    }
                    
                    // SAML 2.0
                    if (protocol === 'SAML_v2.0') {
                      return (
                        <>
                          <ProFormSelect
                            name="binding"
                            label="绑定方式"
                            placeholder="请选择绑定方式"
                            rules={[{ required: true, message: '请选择绑定方式' }]}
                            options={[
                              { label: 'Redirect-Post', value: 'Redirect-Post' },
                              { label: 'Post-Post', value: 'Post-Post' },
                              { label: 'IdpInit-Post', value: 'IdpInit-Post' },
                              { label: 'Redirect-PostSimpleSign', value: 'Redirect-PostSimpleSign' },
                              { label: 'Post-PostSimpleSign', value: 'Post-PostSimpleSign' },
                              { label: 'IdpInit-PostSimpleSign', value: 'IdpInit-PostSimpleSign' },
                            ]}
                          />
                          <ProFormText
                            name="entityId"
                            label="实体ID"
                            placeholder="请输入实体ID"
                            rules={[{ required: true, message: '请输入实体ID' }]}
                          />
                          <ProFormText
                            name="audience"
                            label="受众"
                            placeholder="请输入受众"
                            rules={[{ required: true, message: '请输入受众' }]}
                          />
                          <ProFormText
                            name="issuer"
                            label="发行者"
                            placeholder="请输入发行者"
                            rules={[{ required: true, message: '请输入发行者' }]}
                          />
                          <ProFormSelect
                            name="signature"
                            label="签名算法"
                            placeholder="请选择签名算法"
                            rules={[{ required: true, message: '请选择签名算法' }]}
                            options={[
                              { label: 'RSAwithSHA1', value: 'RSAwithSHA1' },
                              { label: 'RSAwithSHA256', value: 'RSAwithSHA256' },
                              { label: 'RSAwithSHA384', value: 'RSAwithSHA384' },
                              { label: 'RSAwithSHA512', value: 'RSAwithSHA512' },
                              { label: 'RSAwithMD5', value: 'RSAwithMD5' },
                              { label: 'RSAwithRIPEMD160', value: 'RSAwithRIPEMD160' },
                              { label: 'DSAwithSHA1', value: 'DSAwithSHA1' },
                              { label: 'ECDSAwithSHA1', value: 'ECDSAwithSHA1' },
                              { label: 'ECDSAwithSHA256', value: 'ECDSAwithSHA256' },
                              { label: 'ECDSAwithSHA384', value: 'ECDSAwithSHA384' },
                              { label: 'ECDSAwithSHA512', value: 'ECDSAwithSHA512' },
                              { label: 'HMAC-MD5', value: 'HMAC-MD5' },
                              { label: 'HMAC-SHA1', value: 'HMAC-SHA1' },
                              { label: 'HMAC-SHA256', value: 'HMAC-SHA256' },
                              { label: 'HMAC-SHA384', value: 'HMAC-SHA384' },
                              { label: 'HMAC-SHA512', value: 'HMAC-SHA512' },
                              { label: 'HMAC-RIPEMD160', value: 'HMAC-RIPEMD160' },
                            ]}
                          />
                          <ProFormSelect
                            name="digestMethod"
                            label="摘要方法"
                            placeholder="请选择摘要方法"
                            rules={[{ required: true, message: '请选择摘要方法' }]}
                            options={[
                              { label: 'MD5', value: 'MD5' },
                              { label: 'SHA1', value: 'SHA1' },
                              { label: 'SHA256', value: 'SHA256' },
                              { label: 'SHA384', value: 'SHA384' },
                              { label: 'SHA512', value: 'SHA512' },
                              { label: 'RIPEMD-160', value: 'RIPEMD-160' },
                            ]}
                          />
                          <ProFormSelect
                            name="encrypted"
                            label="加密"
                            placeholder="请选择是否加密"
                            rules={[{ required: true, message: '请选择是否加密' }]}
                            options={[
                              { label: '否', value: 'no' },
                              { label: '是', value: 'yes' },
                            ]}
                          />
                        </>
                      );
                    }
                    
                    // CAS
                    if (protocol === 'CAS') {
                      return (
                        <>
                          <ProFormText
                            name="service"
                            label="服务"
                            placeholder="请输入服务"
                            rules={[{ required: true, message: '请输入服务' }]}
                          />
                          <ProFormText
                            name="callbackUrl"
                            label="回调URL"
                            placeholder="请输入回调URL"
                            rules={[{ required: true, message: '请输入回调URL' }]}
                          />
                          <ProFormSelect
                            name="casUser"
                            label="CAS用户"
                            placeholder="请选择CAS用户"
                            rules={[{ required: true, message: '请选择CAS用户' }]}
                            options={[
                              { label: '用户名', value: 'username' },
                              { label: '员工编号', value: 'employeeNumber' },
                              { label: '邮箱', value: 'email' },
                              { label: '手机号', value: 'mobile' },
                              { label: 'Windows账户', value: 'windowsaccount' },
                              { label: '用户ID', value: 'userId' },
                            ]}
                          />
                          <ProFormDigit
                            name="expires"
                            label="过期时间"
                            placeholder="请输入过期时间（秒）"
                            rules={[{ required: true, message: '请输入过期时间' }]}
                            min={0}
                            fieldProps={{ precision: 0, addonAfter: '秒' }}
                          />
                        </>
                      );
                    }
                    
                    // JWT
                    if (protocol === 'JWT') {
                      return (
                        <>
                          <ProFormText
                            name="redirectUri"
                            label="重定向URI"
                            placeholder="请输入重定向URI"
                            rules={[{ required: true, message: '请输入重定向URI' }]}
                          />
                          <ProFormSelect
                            name="subject"
                            label="主体"
                            placeholder="请选择主体"
                            rules={[{ required: true, message: '请选择主体' }]}
                            options={[
                              { label: '用户名', value: 'username' },
                              { label: '员工编号', value: 'employeeNumber' },
                              { label: '邮箱', value: 'email' },
                              { label: '手机号', value: 'mobile' },
                              { label: 'Windows账户', value: 'windowsaccount' },
                              { label: '用户ID', value: 'userId' },
                            ]}
                          />
                          <ProFormSelect
                            name="tokenType"
                            label="令牌类型"
                            placeholder="请选择令牌类型"
                            rules={[{ required: true, message: '请选择令牌类型' }]}
                            options={[
                              { label: 'GET', value: 'GET' },
                              { label: 'POST', value: 'POST' },
                              { label: 'LTPA', value: 'LTPA' },
                            ]}
                          />
                          <ProFormText
                            name="jwtName"
                            label="JWT名称"
                            placeholder="请输入JWT名称"
                            rules={[{ required: true, message: '请输入JWT名称' }]}
                          />
                          <ProFormDigit
                            name="expires"
                            label="过期时间"
                            placeholder="请输入过期时间（秒）"
                            rules={[{ required: true, message: '请输入过期时间' }]}
                            min={0}
                            fieldProps={{ precision: 0, addonAfter: '秒' }}
                          />
                        </>
                      );
                    }
                    
                    // Token Based
                    if (protocol === 'Token_Based') {
                      return (
                        <>
                          <ProFormText
                            name="redirectUri"
                            label="重定向URI"
                            placeholder="请输入重定向URI"
                            rules={[{ required: true, message: '请输入重定向URI' }]}
                          />
                          <ProFormSelect
                            name="tokenType"
                            label="令牌类型"
                            placeholder="请选择令牌类型"
                            rules={[{ required: true, message: '请选择令牌类型' }]}
                            options={[
                              { label: 'POST', value: 'POST' },
                              { label: 'GET', value: 'GET' },
                              { label: 'LTPA', value: 'LTPA' },
                            ]}
                          />
                          <ProFormText
                            name="cookieName"
                            label="Cookie名称"
                            placeholder="请输入Cookie名称"
                            rules={[{ required: true, message: '请输入Cookie名称' }]}
                          />
                          <ProFormSelect
                            name="algorithm"
                            label="算法"
                            placeholder="请选择算法"
                            rules={[{ required: true, message: '请选择算法' }]}
                            options={[
                              { label: 'HMAC-SHA1', value: 'HMAC-SHA1' },
                              { label: 'HMAC-SHA256', value: 'HMAC-SHA256' },
                              { label: 'HMAC-SHA512', value: 'HMAC-SHA512' },
                              { label: 'RSA-SHA1', value: 'RSA-SHA1' },
                              { label: 'RSA-SHA256', value: 'RSA-SHA256' },
                              { label: 'RSA-SHA512', value: 'RSA-SHA512' },
                            ]}
                          />
                        </>
                      );
                    }
                    
                    // Form Based
                    if (protocol === 'Form_Based') {
                      return (
                        <>
                          <ProFormText
                            name="redirectUri"
                            label="重定向URI"
                            placeholder="请输入重定向URI"
                            rules={[{ required: true, message: '请输入重定向URI' }]}
                          />
                          <ProFormText
                            name="usernameMapping"
                            label="用户名映射"
                            placeholder="请输入用户名映射"
                            rules={[{ required: true, message: '请输入用户名映射' }]}
                          />
                          <ProFormText
                            name="passwordMapping"
                            label="密码映射"
                            placeholder="请输入密码映射"
                            rules={[{ required: true, message: '请输入密码映射' }]}
                          />
                          <ProFormText
                            name="authorizeView"
                            label="授权视图"
                            placeholder="请输入授权视图"
                          />
                        </>
                      );
                    }
                    
                    // Extend API
                    if (protocol === 'Extend_API') {
                      return (
                        <>
                          <ProFormText
                            name="principal"
                            label="主体"
                            placeholder="请输入主体"
                            rules={[{ required: true, message: '请输入主体' }]}
                          />
                          <ProFormText.Password
                            name="credentials"
                            label="凭证"
                            placeholder="请输入凭证"
                            rules={[{ required: true, message: '请输入凭证' }]}
                          />
                          <ProFormRadio.Group
                            name="credential"
                            label="凭证类型"
                            rules={[{ required: true, message: '请选择凭证类型' }]}
                            options={[
                              { label: '用户自定义', value: 'user-defined' },
                              { label: '共享', value: 'shared' },
                              { label: '系统', value: 'system' },
                            ]}
                          />
                          <ProFormDependency name={['credential']}>
                            {({ credential }) => {
                              if (credential === 'system') {
                                return (
                                  <ProFormSelect
                                    name="systemUserAttr"
                                    label="系统用户属性"
                                    placeholder="请选择系统用户属性"
                                    rules={[{ required: true, message: '请选择系统用户属性' }]}
                                    options={[
                                      { label: '用户名', value: 'username' },
                                      { label: '员工编号', value: 'employeeNumber' },
                                      { label: '邮箱', value: 'email' },
                                      { label: '手机号', value: 'mobile' },
                                      { label: 'Windows账户', value: 'windowsaccount' },
                                      { label: '用户ID', value: 'userId' },
                                    ]}
                                  />
                                );
                              }
                              return null;
                            }}
                          </ProFormDependency>
                        </>
                      );
                    }
                    
                    // Basic
                    if (protocol === 'Basic') {
                      return (
                        <>
                          <ProFormText
                            name="principal"
                            label="主体"
                            placeholder="请输入主体"
                            rules={[{ required: true, message: '请输入主体' }]}
                          />
                          <ProFormText.Password
                            name="credentials"
                            label="凭证"
                            placeholder="请输入凭证"
                            rules={[{ required: true, message: '请输入凭证' }]}
                          />
                        </>
                      );
                    }
                    
                    // 默认情况：如果协议未选择或不是上述协议，显示提示
                    return (
                      <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                        请先选择协议类型
                      </div>
                    );
                  }}
                </ProFormDependency>
              ),
            },
            {
              key: 'extra',
              label: '额外信息',
              children: (
                <>
                  <ProFormText
                    name="logoutUrl"
                    label="登出URL"
                    placeholder="请输入登出URL"
                  />
                  <ProFormSelect
                    name="logoutType"
                    label="登出类型"
                    placeholder="请选择登出类型"
                    options={logoutTypeOptions}
                  />
                  <ProFormSelect
                    name="visible"
                    label="可见性"
                    placeholder="请选择可见性"
                    options={visibleOptions}
                  />
                  <ProFormDigit
                    name="sortIndex"
                    label="排序号"
                    placeholder="请输入排序号"
                    min={0}
                    fieldProps={{ precision: 0 }}
                  />
                  <ProFormText
                    name="vendor"
                    label="供应商"
                    placeholder="请输入供应商名称"
                  />
                  <ProFormText
                    name="vendorUrl"
                    label="供应商URL"
                    placeholder="请输入供应商URL"
                  />
                  <ProFormTextArea
                    name="description"
                    label="描述"
                    placeholder="请输入描述信息"
                    fieldProps={{ rows: 3 }}
                  />
                </>
              ),
            },
          ]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default ApplicationList;
