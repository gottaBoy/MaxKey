import { useState, useEffect } from 'react';
import { PageContainer, ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, message, Card, Row, Col } from 'antd';
import institutionsService, { Institution } from '@/services/institutions.service';

const InstitutionsList: React.FC = () => {
  const [form] = ProForm.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 加载机构配置
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await institutionsService.get('');
      if (result) {
        form.setFieldsValue(result);
      }
    } catch (error: any) {
      message.error('加载机构配置失败');
    } finally {
      setLoading(false);
    }
  };

  // 提交表单
  const handleSubmit = async (values: Institution) => {
    setSubmitting(true);
    try {
      await institutionsService.update(values);
      message.success('保存成功');
    } catch (error: any) {
      message.error('保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      header={{
        title: '机构配置',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '配置管理' },
            { title: '机构配置' },
          ],
        },
      }}
    >
      <Card>
        <ProForm
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={handleSubmit}
          submitter={{
            render: (_, dom) => (
              <Row>
                <Col offset={6} span={18}>
                  <Button type="primary" htmlType="submit" loading={submitting}>
                    提交
                  </Button>
                </Col>
              </Row>
            ),
          }}
        >
          <ProFormText name="id" label="ID" hidden />
          <ProFormText name="name" label="机构名称" rules={[{ required: true }]} />
          <ProFormText name="fullName" label="机构全称" rules={[{ required: true }]} />
          <ProFormText name="logo" label="Logo" />
          <ProFormText name="defaultUri" label="默认URI" />
          <ProFormText name="domain" label="域名" rules={[{ required: true }]} />
          <ProFormText name="frontTitle" label="前端标题" rules={[{ required: true }]} />
          <ProFormText name="consoleDomain" label="控制台域名" rules={[{ required: true }]} />
          <ProFormText name="consoleTitle" label="控制台标题" rules={[{ required: true }]} />
          <ProFormText name="contact" label="联系人" />
          <ProFormText name="phone" label="电话" />
          <ProFormText name="email" label="邮箱" />
          <ProFormText name="address" label="地址" />
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default InstitutionsList;

