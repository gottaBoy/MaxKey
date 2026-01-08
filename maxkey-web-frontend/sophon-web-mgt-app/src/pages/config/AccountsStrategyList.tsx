import { useRef, useState, useEffect } from 'react';
import { PageContainer, ProTable, ModalForm, ProFormText, ProFormSelect, ProFormTextArea, ProFormTreeSelect, ProFormRadio, ProFormSwitch, ProForm } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Popconfirm, message, Image, Modal, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import accountsStrategyService, { AccountsStrategy } from '@/services/accounts-strategy.service';
import appsService from '@/services/apps.service';
import organizationsService from '@/services/organizations.service';
import type { Application } from '@/types/entity';

const AccountsStrategyList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<AccountsStrategy | null>(null);
  const [formRef] = ProForm.useForm();
  const [appList, setAppList] = useState<Application[]>([]);
  const [selectAppModalVisible, setSelectAppModalVisible] = useState(false);
  const [orgTreeSelectData, setOrgTreeSelectData] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  // 加载应用列表
  useEffect(() => {
    loadAppList();
    loadOrgTree();
  }, []);

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

  const loadOrgTree = async () => {
    try {
      const result: any = await organizationsService.tree();
      let nodes: any[] = [];
      
      if (result && typeof result === 'object') {
        if (result.data && typeof result.data === 'object') {
          if (result.data.nodes && Array.isArray(result.data.nodes)) {
            nodes = result.data.nodes;
          } else if (Array.isArray(result.data)) {
            nodes = result.data;
          } else if (result.data.rows && Array.isArray(result.data.rows)) {
            nodes = result.data.rows;
          }
        } else if (Array.isArray(result.nodes)) {
          nodes = result.nodes;
        } else if (Array.isArray(result.rows)) {
          nodes = result.rows;
        } else if (Array.isArray(result)) {
          nodes = result;
        }
      }
      
      const convertToTreeSelectData = (nodeList: any[], processedKeys: Set<string> = new Set(), depth: number = 0): any[] => {
        if (!nodeList || !Array.isArray(nodeList) || depth > 100) {
          return [];
        }
        
        return nodeList.map((node) => {
          const value = node.id || node.key || node.orgId || '';
          const title = node.name || node.title || node.orgName || '';
          
          if (value && processedKeys.has(value)) {
            return { value, title: `${title} (循环引用)`, children: [] };
          }
          
          if (value) {
            processedKeys.add(value);
          }
          
          const children = node.children && Array.isArray(node.children) && node.children.length > 0
            ? convertToTreeSelectData(node.children, processedKeys, depth + 1)
            : [];
          
          if (value) {
            processedKeys.delete(value);
          }
          
          return { value, title, children };
        });
      };
      
      const treeSelectData = convertToTreeSelectData(nodes);
      setOrgTreeSelectData(treeSelectData);
      
      // 默认展开第一层节点
      const firstLevelKeys: React.Key[] = [];
      treeSelectData.forEach((node) => {
        if (node.value && node.children && node.children.length > 0) {
          firstLevelKeys.push(node.value);
        }
      });
      setExpandedKeys(firstLevelKeys);
    } catch (error: any) {
      console.error('加载组织树失败:', error);
    }
  };

  const handleEdit = async (record: AccountsStrategy) => {
    try {
      const detail = await accountsStrategyService.get(record.id!);
      setCurrentRecord(detail);
      // 处理 orgIdsList 字段（从逗号分隔字符串转为数组）
      const formValues = {
        ...detail,
        orgIdsList: detail.orgIdsList && detail.orgIdsList.trim() 
          ? detail.orgIdsList.split(',').filter((id: string) => id && id.trim() !== '') 
          : [],
        switch_status: detail.status === 1,
      };
      formRef.setFieldsValue(formValues);
      setEditModalVisible(true);
    } catch (error: any) {
      message.error('获取详情失败');
    }
  };

  const handleSelectApp = () => {
    setSelectAppModalVisible(true);
  };

  const handleAppSelected = (appId: string) => {
    const app = appList.find(a => a.id === appId);
    if (app) {
      formRef.setFieldsValue({
        appId: app.id,
        appName: app.appName,
      });
    }
    setSelectAppModalVisible(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await accountsStrategyService.delete(id);
      message.success('删除成功');
      actionRef.current?.reload();
    } catch (error: any) {
      message.error('删除失败');
    }
  };

  const columns: ProColumns<AccountsStrategy>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '应用图标',
      dataIndex: 'appIconBase64',
      width: 100,
      hideInSearch: true,
      render: (_, record) => (
        record.appIconBase64 ? <Image src={record.appIconBase64} width={30} height={30} /> : '-'
      ),
    },
    {
      title: '应用名称',
      dataIndex: 'appName',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '创建类型',
      dataIndex: 'createType',
      width: 120,
      hideInSearch: true,
      render: (_, record) => record.createType === 'manual' ? '手动' : '自动',
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
        name: params.name || '',
        displayName: params.displayName || '',
        protocol: params.protocol || '',
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

      const result: any = await accountsStrategyService.fetch(requestParams);
      
      let rows: AccountsStrategy[] = [];
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
      console.error('加载账号管理列表失败:', error);
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

  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的记录');
      return;
    }
    try {
      const ids = selectedRowKeys.join(',');
      await accountsStrategyService.delete(ids);
      message.success(`成功删除 ${selectedRowKeys.length} 条记录`);
      setSelectedRowKeys([]);
      actionRef.current?.reload();
    } catch (error: any) {
      message.error('批量删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      // 处理 orgIdsList 字段（从数组转为逗号分隔字符串）
      const submitData = {
        ...values,
        orgIdsList: values.orgIdsList && Array.isArray(values.orgIdsList)
          ? values.orgIdsList.join(',')
          : values.orgIdsList || '',
        status: values.switch_status ? 1 : 0,
        switch_status: undefined,
      };
      
      if (currentRecord?.id) {
        await accountsStrategyService.update({ ...currentRecord, ...submitData });
        message.success('更新成功');
      } else {
        await accountsStrategyService.add(submitData);
        message.success('创建成功');
      }
      setCreateModalVisible(false);
      setEditModalVisible(false);
      formRef.resetFields();
      actionRef.current?.reload();
    } catch (error: any) {
      message.error(currentRecord?.id ? '更新失败' : '创建失败');
    }
  };

  return (
    <PageContainer
      header={{
        title: '账号管理',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '配置管理' },
            { title: '账号管理' },
          ],
        },
      }}
    >
      <ProTable<AccountsStrategy>
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
        title={currentRecord?.id ? '编辑账号策略' : '创建账号策略'}
        form={formRef}
        open={createModalVisible || editModalVisible}
        onOpenChange={(visible) => {
          if (!visible) {
            setCreateModalVisible(false);
            setEditModalVisible(false);
            formRef.resetFields();
            setCurrentRecord(null);
          }
        }}
        onFinish={handleSubmit}
        width={600}
        initialValues={{
          createType: 'manual',
          mapping: 'username',
          status: 1,
          switch_status: true,
        }}
      >
        <ProFormText name="id" label="ID" disabled={!!currentRecord?.id} />
        <ProFormText name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]} />
        <ProFormText
          name="appName"
          label="应用名称"
          rules={[{ required: true, message: '请选择应用' }]}
          fieldProps={{
            readOnly: true,
            addonAfter: (
              <Button type="primary" onClick={handleSelectApp}>
                选择
              </Button>
            ),
          }}
        />
        <ProFormText name="appId" hidden />
        <ProFormSelect
          name="mapping"
          label="映射"
          rules={[{ required: true, message: '请选择映射' }]}
          options={[
            { label: 'username', value: 'username' },
            { label: 'employeeNumber', value: 'employeeNumber' },
            { label: 'windowsAccount', value: 'windowsAccount' },
            { label: 'email', value: 'email' },
            { label: 'mobile', value: 'mobile' },
            { label: 'idCardNo', value: 'idCardNo' },
          ]}
        />
        <ProFormText name="suffixes" label="后缀" />
        <ProFormTreeSelect
          name="orgIdsList"
          label="组织范围"
          fieldProps={{
            treeData: orgTreeSelectData,
            multiple: true,
            treeCheckable: true,
            treeCheckStrictly: true,
            showCheckedStrategy: 'SHOW_PARENT',
            treeDefaultExpandedKeys: expandedKeys as any,
            maxTagCount: 3,
            style: { width: '100%' },
            allowClear: true,
            showSearch: true,
            treeNodeFilterProp: 'title',
            virtual: false,
            dropdownStyle: { maxHeight: '400px', overflow: 'auto' },
            placeholder: '请选择组织范围',
          }}
        />
        <ProFormTextArea
          name="filters"
          label="过滤条件"
          placeholder="请输入过滤条件（如：USERTYPE='EMPLOYEE'）"
          fieldProps={{ rows: 4 }}
        />
        <ProFormRadio.Group
          name="createType"
          label="创建类型"
          rules={[{ required: true }]}
          options={[
            { label: '手动', value: 'manual' },
            { label: '自动', value: 'automatic' },
          ]}
        />
        <ProFormTextArea
          name="description"
          label="描述"
          fieldProps={{ rows: 4 }}
          hidden
        />
        <ProFormSwitch name="switch_status" label="状态" />
      </ModalForm>

      {/* 选择应用对话框 */}
      <Modal
        title="选择应用"
        open={selectAppModalVisible}
        onCancel={() => setSelectAppModalVisible(false)}
        footer={null}
        width={600}
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
    </PageContainer>
  );
};

export default AccountsStrategyList;

