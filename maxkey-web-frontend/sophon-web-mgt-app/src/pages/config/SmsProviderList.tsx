import { useState, useEffect } from 'react';
import { PageContainer, ProForm, ProFormText, ProFormSelect, ProFormSwitch, ProFormDependency } from '@ant-design/pro-components';
import { Button, message, Card, Row, Col } from 'antd';
import smsProviderService, { SmsProvider } from '@/services/sms-provider.service';

const SmsProviderList: React.FC = () => {
  const [form] = ProForm.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await smsProviderService.get('');
      if (result) {
        form.setFieldsValue(result);
      }
    } catch (error: any) {
      message.error('加载短信服务配置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: SmsProvider) => {
    setSubmitting(true);
    try {
      await smsProviderService.update(values);
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
        title: '短信服务',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '配置管理' },
            { title: '短信服务' },
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
          <ProFormSelect
            name="provider"
            label="服务商"
            options={[
              { label: '阿里云', value: 'aliyun' },
              { label: '腾讯云', value: 'tencentcloud' },
              { label: '网易云', value: 'neteasesms' },
              { label: '邮件', value: 'email' },
            ]}
            rules={[{ required: true }]}
          />
          <ProFormSwitch name="switch_status" label="状态" />
          <ProFormDependency name={['provider']}>
            {({ provider }) => {
              if (provider === 'email') {
                return null;
              }
              return (
                <>
                  <ProFormText name="message" label="消息" />
                  <ProFormText name="templateId" label="模板ID" />
                  <ProFormText name="appKey" label="AppKey" />
                  <ProFormText.Password name="appSecret" label="AppSecret" />
                  <ProFormText name="signName" label="签名" />
                  {provider === 'tencentcloud' && (
                    <ProFormText name="smsSdkAppId" label="SMS SDK AppId" />
                  )}
                </>
              );
            }}
          </ProFormDependency>
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default SmsProviderList;

