import { useState, useEffect } from 'react';
import { Card, Form, Input, Radio, Button, message } from 'antd';
import usersService from '@/services/users.service';
import './Mfa.less';

const Mfa: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const user = await usersService.getProfile();
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      form.setFieldsValue({
        id: userInfo.userId || userInfo.id,
        displayName: user.displayName || userInfo.displayName,
        username: user.username || userInfo.username,
        mobile: user.mobile || userInfo.mobile,
        email: user.email || userInfo.email,
        authnType: user.authnType || '0',
      });
    } catch (error: any) {
      console.error('加载用户资料失败:', error);
      message.error('加载用户资料失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await usersService.updateAuthnType(values);
      message.success('保存成功');
    } catch (error: any) {
      console.error('保存失败:', error);
      message.error('保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card loading={loading}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="姓名" name="displayName">
          <Input disabled />
        </Form.Item>
        <Form.Item label="登录账号" name="username">
          <Input disabled />
        </Form.Item>
        <Form.Item label="手机" name="mobile">
          <Input disabled />
        </Form.Item>
        <Form.Item label="邮箱" name="email">
          <Input disabled />
        </Form.Item>
        <Form.Item label="认证类型" name="authnType" rules={[{ required: true, message: '请选择认证类型' }]}>
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="0">无</Radio.Button>
            <Radio.Button value="1">短信</Radio.Button>
            <Radio.Button value="2">邮箱</Radio.Button>
            <Radio.Button value="3">时间令牌</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            保存
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Mfa;

