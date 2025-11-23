import { useState, useEffect } from 'react';
import { PageContainer, ProForm, ProFormDigit, ProFormSwitch } from '@ant-design/pro-components';
import { Button, message, Card, Row, Col, InputNumber } from 'antd';
import passwordPolicyService, { PasswordPolicy } from '@/services/password-policy.service';

const PasswordPolicyList: React.FC = () => {
  const [form] = ProForm.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await passwordPolicyService.get('');
      if (result) {
        form.setFieldsValue(result);
      }
    } catch (error: any) {
      message.error('加载密码策略失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: PasswordPolicy) => {
    setSubmitting(true);
    try {
      await passwordPolicyService.update(values);
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
        title: '密码策略',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '配置管理' },
            { title: '密码策略' },
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
          <ProFormDigit name="minLength" label="最小长度" min={0} max={10} rules={[{ required: true }]} />
          <ProFormDigit name="maxLength" label="最大长度" min={0} max={10} rules={[{ required: true }]} />
          <ProFormDigit name="lowerCase" label="小写字母" min={0} max={10} rules={[{ required: true }]} />
          <ProFormDigit name="upperCase" label="大写字母" min={0} max={10} rules={[{ required: true }]} />
          <ProFormDigit name="digits" label="数字" min={0} max={10} rules={[{ required: true }]} />
          <ProFormDigit name="specialChar" label="特殊字符" min={0} max={10} rules={[{ required: true }]} />
          <ProFormDigit name="attempts" label="尝试次数" min={0} max={10} rules={[{ required: true }]} />
          <ProFormDigit name="duration" label="持续时间" min={0} max={720} addonAfter="分钟" rules={[{ required: true }]} />
          <ProFormDigit name="occurances" label="出现次数" min={0} max={10} rules={[{ required: true }]} />
          <ProFormDigit name="expiration" label="过期时间" min={30} max={365} addonAfter="天" rules={[{ required: true }]} />
          <ProFormDigit name="history" label="历史记录" min={0} max={10} rules={[{ required: true }]} />
          <ProFormSwitch name="switch_username" label="用户名" />
          <ProFormSwitch name="switch_dictionary" label="字典" />
          <ProFormSwitch name="switch_alphabetical" label="字母顺序" />
          <ProFormSwitch name="switch_numerical" label="数字顺序" />
          <ProFormSwitch name="switch_qwerty" label="QWERTY顺序" />
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default PasswordPolicyList;

