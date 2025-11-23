import { useRef, useState } from 'react';
import { PageContainer, ProTable, ModalForm, ProFormText, ProFormSwitch } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import connectorsService, { Connector } from '@/services/connectors.service';

const ConnectorsList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Connector | null>(null);
  const [formRef] = ModalForm.useForm();

  const columns: ProColumns<Connector>[] = [
    {
      title: '连接器名称',
      dataIndex: 'connName',
      width: 200,
    },
    {
      title: '即时',
      dataIndex: 'justInTime',
      width: 100,
      hideInSearch: true,
      render: (_, record) => record.justInTime === 1 ? '是' : '否',
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
        connName: params.connName || '',
        pageNumber: params.current || 1,
        pageSize: params.pageSize || 10,
        pageSizeOptions: [10, 20, 50],
      };

      const result: any = await connectorsService.fetch(requestParams);
      
      let rows: Connector[] = [];
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
      console.error('加载连接器列表失败:', error);
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

  const handleEdit = async (record: Connector) => {
    try {
      const detail = await connectorsService.get(record.id!);
      setCurrentRecord(detail);
      formRef.setFieldsValue(detail);
      setEditModalVisible(true);
    } catch (error: any) {
      message.error('获取详情失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await connectorsService.delete(id);
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
      await connectorsService.delete(ids);
      message.success(`成功删除 ${selectedRowKeys.length} 条记录`);
      setSelectedRowKeys([]);
      actionRef.current?.reload();
    } catch (error: any) {
      message.error('批量删除失败');
    }
  };

  const handleSubmit = async (values: Connector) => {
    try {
      if (currentRecord?.id) {
        await connectorsService.update({ ...currentRecord, ...values });
        message.success('更新成功');
      } else {
        await connectorsService.create(values);
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
        title: '连接器管理',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '配置管理' },
            { title: '连接器管理' },
          ],
        },
      }}
    >
      <ProTable<Connector>
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
        title={currentRecord?.id ? '编辑连接器' : '创建连接器'}
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
        <ProFormText name="connName" label="连接器名称" rules={[{ required: true }]} />
        <ProFormText name="displayName" label="显示名称" />
        <ProFormSwitch name="justInTime" label="即时" />
      </ModalForm>
    </PageContainer>
  );
};

export default ConnectorsList;

