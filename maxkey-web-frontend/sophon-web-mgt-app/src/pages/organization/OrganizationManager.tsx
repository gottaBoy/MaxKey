import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Row, Col, Table, Modal, Tree, Space, message, Popconfirm } from 'antd';
import OrganizationsService from '@/services/organizations.service';

export default function OrganizationManager() {
  const [form] = Form.useForm();
  const [treeData, setTreeData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('OrganizationManager useEffect挂载');
    loadData();
  }, []);

  // 将平铺 nodes 转换为树结构
  function buildTree(nodes: any[]): any[] {
    if (!Array.isArray(nodes) || nodes.length === 0) return [];
    // 标准化所有节点
    const nodeMap = new Map<string, any>();
    nodes.forEach(node => {
      nodeMap.set(node.key, {
        key: String(node.key),
        title: node.title || node.attrs?.orgName || node.attrs?.fullName || node.code || node.key,
        children: [],
        ...node,
      });
    });
    // 构建树结构
    const tree: any[] = [];
    nodes.forEach(node => {
      const current = nodeMap.get(node.key);
      // 根节点判定：parentKey为自身、null、undefined、空字符串或 parentKey 不存在于 nodeMap
      if (
        node.key === node.parentKey ||
        node.parentKey === null ||
        node.parentKey === undefined ||
        node.parentKey === '' ||
        !nodeMap.has(node.parentKey)
      ) {
        tree.push(current);
      } else {
        const parent = nodeMap.get(node.parentKey);
        if (parent) {
          parent.children.push(current);
        } else {
          tree.push(current);
        }
      }
    });
    // 递归修正 children 字段和去重
    function fixChildren(arr: any[]) {
      arr.forEach(n => {
        if (!Array.isArray(n.children)) n.children = [];
        // 去重
        const seen = new Set<string>();
        n.children = n.children.filter((child: any) => {
          if (seen.has(child.key)) return false;
          seen.add(child.key);
          return true;
        });
        if (n.children.length > 0) fixChildren(n.children);
      });
    }
    fixChildren(tree);
    return tree;
  }

  const loadData = async () => {
    console.log('loadData 执行');
    setLoading(true);
    const treeRes = await OrganizationsService.tree();
    console.log('treeRes:', treeRes);
    const nodes = treeRes.data?.nodes ?? [];
    console.log('nodes:', nodes);
    setTableData(nodes);
    const tree = buildTree(nodes);
    console.log('组织树 treeData:', tree);
    setTreeData(tree);
    setLoading(false);
  };

  const onSearch = async (values: { orgName: string }) => {
    setLoading(true);
    const orgsRes = await OrganizationsService.fetchList();
    const orgs = orgsRes.data ?? [];
    const filtered = orgs.filter((org: any) => org.name.includes(values.orgName));
    setTableData(filtered);
    setLoading(false);
  };

  const onAdd = () => {
    setEditingOrg(null);
    setModalVisible(true);
    form.resetFields();
  };

  const onEdit = (record: any) => {
    setEditingOrg(record);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  const onDelete = async (record: any) => {
    await OrganizationsService.removeOrg(record.id);
    message.success(`已删除组织：${record.name}`);
    loadData();
  };

  const handleModalOk = async () => {
    const values = await form.validateFields();
    if (editingOrg && typeof editingOrg === 'object') {
      await OrganizationsService.editOrg({ ...(editingOrg as object), ...values });
      message.success('编辑成功');
    } else {
      await OrganizationsService.addOrg(values);
      message.success('新增成功');
    }
    setModalVisible(false);
    loadData();
  };

  const columns = [
    { title: '组织名称', dataIndex: 'name', key: 'name' },
    { title: '操作', key: 'action', render: (_: any, record: any) => (
      <Space>
        <Button type="link" onClick={() => onEdit(record)}>编辑</Button>
        <Popconfirm title="确定删除该组织吗？" onConfirm={() => onDelete(record)}>
          <Button type="link" danger>删除</Button>
        </Popconfirm>
      </Space>
    ) },
  ];

  return (
    <Card title="组织管理">
      <Form form={form} layout="inline" onFinish={onSearch} style={{ marginBottom: 16 }}>
        <Form.Item name="orgName" label="组织名称">
          <Input placeholder="请输入组织名称" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">查询</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={onAdd}>新增组织</Button>
        </Form.Item>
      </Form>
      <Row gutter={24}>
        <Col span={6}>
          <Card title="组织树" size="small">
            <Tree treeData={treeData} defaultExpandAll />
          </Card>
        </Col>
        <Col span={18}>
          <Table
            columns={columns}
            dataSource={tableData}
            rowKey="id"
            loading={loading}
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys as string[]),
            }}
          />
        </Col>
      </Row>
      <Button
        danger
        disabled={selectedRowKeys.length === 0}
        style={{ margin: '12px 0' }}
        onClick={async () => {
          await OrganizationsService.batchDeleteOrg(selectedRowKeys);
          message.success('批量删除成功');
          setSelectedRowKeys([]);
          loadData();
        }}
      >批量删除</Button>
      <Modal
        title={editingOrg ? '编辑组织' : '新增组织'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical" initialValues={editingOrg || {}}>
          <Form.Item name="name" label="组织名称" rules={[{ required: true, message: '请输入组织名称' }]}> <Input /> </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
