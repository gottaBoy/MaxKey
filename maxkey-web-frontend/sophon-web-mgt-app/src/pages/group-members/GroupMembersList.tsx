import { Table, Card } from 'antd';
import { useEffect, useState } from 'react';
import groupMembersService from '@/services/group-members.service';

export default function GroupMembersList() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);
    groupMembersService.getAll().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const columns = [
    { title: '用户组', dataIndex: 'groupName', key: 'groupName' },
    { title: '成员名称', dataIndex: 'userName', key: 'userName' },
    { title: '成员账号', dataIndex: 'userAccount', key: 'userAccount' },
  ];

  return (
    <Card title="用户组成员管理">
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id" />
    </Card>
  );
}
