import { useState, useEffect } from 'react';
import { PageContainer, ProForm, ProFormText, ProFormDigit, ProFormSwitch } from '@ant-design/pro-components';
import { Button, message, Card, Row, Col } from 'antd';
import emailSendersService, { EmailSenders } from '@/services/email-senders.service';

const EmailSendersList: React.FC = () => {
  const [form] = ProForm.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await emailSendersService.get('');
      if (result) {
        form.setFieldsValue(result);
      }
    } catch (error: any) {
      message.error('加载电子邮箱配置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: EmailSenders) => {
    setSubmitting(true);
    try {
      await emailSendersService.update(values);
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
        title: '电子邮箱',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '配置管理' },
            { title: '电子邮箱' },
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
          <ProFormSwitch name="switch_status" label="状态" />
          <ProFormText name="smtpHost" label="SMTP主机" rules={[{ required: true }]} />
          <ProFormDigit name="port" label="端口" min={1} max={99999} rules={[{ required: true }]} />
          <ProFormText name="account" label="账号" rules={[{ required: true }]} />
          <ProFormText.Password name="credentials" label="密码" rules={[{ required: true }]} />
          <ProFormText name="protocol" label="协议" rules={[{ required: true }]} />
          <ProFormText name="encoding" label="编码" rules={[{ required: true }]} />
          <ProFormText name="sender" label="发件人" rules={[{ required: true }]} />
          <ProFormSwitch name="switch_sslSwitch" label="SSL开关" />
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default EmailSendersList;

