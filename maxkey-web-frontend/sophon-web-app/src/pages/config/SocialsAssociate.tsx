import { useState, useEffect } from 'react';
import { Card, Table, Button, message, Image } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { SocialsAssociate } from '@/types/entity';
import socialsAssociateService from '@/services/socials-associate.service';
import './SocialsAssociate.less';

const SocialsAssociate: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<SocialsAssociate[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    loadData();
  }, [pagination.current, pagination.pageSize]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params: any = {
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
        pageSizeOptions: [10, 20, 50],
      };

      const result = await socialsAssociateService.fetch(params);
      setDataSource(result.rows || []);
      setTotal(result.records || 0);
    } catch (error: any) {
      console.error('加载社交关联列表失败:', error);
      message.error('加载社交关联列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleBind = (provider: string) => {
    socialsAssociateService.bind(provider);
  };

  const handleUnbind = async (id: string) => {
    try {
      await socialsAssociateService.unbind(id);
      message.success('解绑成功');
      loadData();
    } catch (error: any) {
      console.error('解绑失败:', error);
      message.error('解绑失败');
    }
  };

  const columns: ColumnsType<SocialsAssociate> = [
    {
      title: '图标',
      dataIndex: 'icon',
      width: 80,
      render: (icon) => (icon ? <Image src={icon} width={32} height={32} preview={false} /> : '-'),
    },
    {
      title: '服务商',
      dataIndex: 'provider',
      width: 150,
    },
    {
      title: '服务商名称',
      dataIndex: 'providerName',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      width: 180,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedDate',
      width: 180,
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_, record) =>
        record.updatedDate ? (
          <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
        ) : (
          <span>未绑定</span>
        ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <div>
          {!record.updatedDate ? (
            <Button type="primary" size="small" onClick={() => handleBind(record.provider || '')}>
              绑定
            </Button>
          ) : (
            <Button type="primary" danger size="small" onClick={() => handleUnbind(record.id || '')}>
              解绑
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize });
          },
        }}
        bordered
        size="small"
      />
    </Card>
  );
};

export default SocialsAssociate;

