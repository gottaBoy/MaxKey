import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import {
  Button,
  Tag,
  Image,
} from 'antd';
import {
  KeyOutlined,
  UsergroupAddOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import type { Application } from '@/types/entity';
import appsService from '@/services/apps.service';
import { getAppIconUrl } from '@/utils/iconGenerator';

const AppsList: React.FC = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 协议标签颜色映射
  const protocolColors: Record<string, string> = {
    'OAuth_v2.0': 'blue',
    'OAuth_v2.1': 'blue',
    'OpenID_Connect_v1.0': 'cyan',
    'SAML_v2.0': 'green',
    'CAS': 'orange',
    'JWT': 'purple',
    'Form_Based': 'cyan',
    'Token_Based': 'magenta',
    'Extend_API': 'purple',
    'Basic': 'default',
  };

  // 表格列定义
  const columns: ProColumns<Application>[] = [
    {
      title: '应用图标',
      dataIndex: 'icon',
      width: 120,
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
      title: 'ID',
      dataIndex: 'id',
      width: 120,
      hideInSearch: true,
      ellipsis: true,
      hidden: true,
    },
    {
      title: '应用名称',
      dataIndex: 'appName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '协议',
      dataIndex: 'protocol',
      width: 150,
      render: (_, record) => (
        <Tag color={protocolColors[record.protocol || ''] || 'default'}>
          {record.protocol}
        </Tag>
      ),
    },
    {
      title: '类别',
      dataIndex: 'category',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '排序',
      dataIndex: 'sortIndex',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueEnum: {
        0: { text: '停用', status: 'Default' },
        1: { text: '启用', status: 'Success' },
      },
      render: (_, record) => (
        record.status === 1 ? (
          <Tag color="success">启用</Tag>
        ) : (
          <Tag color="default">停用</Tag>
        )
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      width: 300,
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
          onClick={() => {
            navigate(`/permissions/apps/resources?appId=${record.id}&appName=${encodeURIComponent(record.appName || '')}`);
          }}
        >
          资源
        </Button>,
      ],
    },
  ];

  // 加载应用列表
  const loadApps = async (params: any) => {
    try {
      const requestParams: any = {
        appName: params.appName || '',
        displayName: params.displayName || '',
        protocol: params.protocol || '',
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

      const result = await appsService.fetch(requestParams);
      
      let data: any[] = [];
      let total = 0;
      
      if (result && typeof result === 'object') {
        if ('rows' in result && Array.isArray((result as any).rows)) {
          data = (result as any).rows;
          total = (result as any).records || 0;
        } else if ('records' in result && Array.isArray((result as any).records)) {
          data = (result as any).records;
          total = (result as any).total || 0;
        } else if (Array.isArray(result)) {
          data = result;
          total = result.length;
        } else if ('data' in result) {
          const dataValue = (result as any).data;
          if (Array.isArray(dataValue)) {
            data = dataValue;
            total = (result as any).total || dataValue.length;
          } else if (dataValue && typeof dataValue === 'object') {
            if ('rows' in dataValue && Array.isArray(dataValue.rows)) {
              data = dataValue.rows;
              total = dataValue.records || 0;
            }
          }
        }
      }
      
      return {
        data: Array.isArray(data) ? data : [],
        success: true,
        total: typeof total === 'number' ? total : 0,
      };
    } catch (error: any) {
      console.error('加载应用列表失败:', error);
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
        // title: '权限管理',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '权限管理' },
            { title: '权限管理' },
          ],
        },
      }}
    >
      <ProTable<Application>
        columns={columns}
        actionRef={actionRef}
        request={loadApps}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          collapsed: false,
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        scroll={{ x: 'max-content' }}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <span>
            已选择 {selectedRowKeys.length} 项
            <Button
              type="link"
              onClick={() => {
                // 可以在这里添加批量操作逻辑
                onCleanSelected();
              }}
            >
              清空选择
            </Button>
          </span>
        )}
      />
    </PageContainer>
  );
};

export default AppsList;

