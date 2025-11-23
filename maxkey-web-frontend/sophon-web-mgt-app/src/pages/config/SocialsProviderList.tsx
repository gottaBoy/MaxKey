import { useRef, useState } from 'react';
import { PageContainer, ProTable, ModalForm, ProFormText, ProFormDigit, ProFormSwitch } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Popconfirm, message, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import socialsProviderService, { SocialsProvider } from '@/services/socials-provider.service';

const SocialsProviderList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<SocialsProvider | null>(null);
  const [formRef] = ModalForm.useForm();

  const columns: ProColumns<SocialsProvider>[] = [
    {
      title: '图标',
      dataIndex: 'icon',
      width: 80,
      hideInSearch: true,
      render: (_, record) => (
        record.icon ? <Image src={record.icon} width={30} height={30} /> : '-'
      ),
    },
    {
      title: '提供者',
      dataIndex: 'provider',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '提供者名称',
      dataIndex: 'providerName',
      width: 200,
    },
    {
      title: '排序',
      dataIndex: 'sortIndex',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '显示',
      dataIndex: 'display',
      width: 100,
      hideInSearch: true,
      render: (_, record) => record.display === 'true' ? '是' : '否',
    },
    {
      title: '扫码',
      dataIndex: 'scanCode',
      width: 100,
      hideInSearch: true,
      render: (_, record) => record.scanCode === 'true' ? '是' : '否',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      hideInSearch: true,
      render: (_, record) => record.status === 1 ? '启用' : '禁用',
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
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>,
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
        providerName: params.providerName || '',
        pageNumber: params.current || 1,
        pageSize: params.pageSize || 10,
        pageSizeOptions: [10, 20, 50],
      };

      const result: any = await socialsProviderService.fetch(requestParams);
      
      let rows: SocialsProvider[] = [];
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
      console.error('加载社交登录列表失败:', error);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  const handleAdd = () => {
    setCurrentRecord(null);
    formRef.resetFields();
    setCreateModalVisible(true);
  };

  const handleEdit = async (record: SocialsProvider) => {
    try {
      const detail = await socialsProviderService.get(record.id!);
      setCurrentRecord(detail);
      formRef.setFieldsValue(detail);
      setEditModalVisible(true);
    } catch (error: any) {
      message.error('获取详情失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await socialsProviderService.delete(id);
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
      await socialsProviderService.delete(ids);
      message.success(`成功删除 ${selectedRowKeys.length} 条记录`);
      setSelectedRowKeys([]);
      actionRef.current?.reload();
    } catch (error: any) {
      message.error('批量删除失败');
    }
  };

  const handleSubmit = async (values: SocialsProvider) => {
    try {
      if (currentRecord?.id) {
        await socialsProviderService.update({ ...currentRecord, ...values });
        message.success('更新成功');
      } else {
        await socialsProviderService.create(values);
        message.success('创建成功');
      }
      setCreateModalVisible(false);
      setEditModalVisible(false);
      actionRef.current?.reload();
    } catch (error: any) {
      message.error(currentRecord?.id ? '更新失败' : '创建失败');
    }
  };

  return (
    <PageContainer
      header={{
        title: '社交登录',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '配置管理' },
            { title: '社交登录' },
          ],
        },
      }}
    >
      <ProTable<SocialsProvider>
        columns={columns}
        actionRef={actionRef}
        request={loadData}
        rowKey="id"
        search={{
          labelWidth: 'auto',
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
      />

      <ModalForm
        title={currentRecord?.id ? '编辑社交登录' : '创建社交登录'}
        form={formRef}
        open={createModalVisible || editModalVisible}
        onOpenChange={(visible) => {
          if (!visible) {
            setCreateModalVisible(false);
            setEditModalVisible(false);
            formRef.resetFields();
          }
        }}
        onFinish={handleSubmit}
        width={600}
      >
        <ProFormText name="provider" label="提供者" />
        <ProFormText name="providerName" label="提供者名称" rules={[{ required: true }]} />
        <ProFormText name="displayName" label="显示名称" />
        <ProFormText name="icon" label="图标" />
        <ProFormDigit name="sortIndex" label="排序" />
        <ProFormSwitch name="display" label="显示" />
        <ProFormSwitch name="scanCode" label="扫码" />
      </ModalForm>
    </PageContainer>
  );
};

export default SocialsProviderList;

