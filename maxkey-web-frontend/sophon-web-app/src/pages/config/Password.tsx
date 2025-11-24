import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Alert, Row, Col, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import type { PasswordPolicy, ChangePassword } from '@/types/entity';
import passwordService from '@/services/password.service';
import './Password.less';

const Password: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [policy, setPolicy] = useState<PasswordPolicy>({});
  const [policyMessage, setPolicyMessage] = useState<string[]>([]);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    loadPolicy();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    form.setFieldsValue({
      id: userInfo.userId || userInfo.id,
      userId: userInfo.userId || userInfo.id,
      username: userInfo.username,
      displayName: userInfo.displayName,
    });
  }, []);

  const loadPolicy = async () => {
    try {
      const data = await passwordService.passwordpolicy();
      setPolicy(data);
      setPolicyMessage(data.policMessageList || []);
    } catch (error: any) {
      console.error('加载密码策略失败:', error);
    }
  };

  const dynamicallyCheckPassword = (value: string) => {
    if (!value) {
      setPasswordErrorMsg('');
      return;
    }

    const data = policy;
    if (data.minLength && data.maxLength) {
      const inputLength = value.length;
      if (inputLength < data.minLength || inputLength > data.maxLength) {
        setPasswordErrorMsg('密码不符合强度要求');
        return;
      }
    }

    if (data.lowerCase && data.lowerCase > 0) {
      const lowerCaseCount = (value.match(/[a-z]/g) || []).length;
      if (lowerCaseCount < data.lowerCase) {
        setPasswordErrorMsg('密码不符合强度要求');
        return;
      }
    }

    if (data.upperCase && data.upperCase > 0) {
      const upperCaseCount = (value.match(/[A-Z]/g) || []).length;
      if (upperCaseCount < data.upperCase) {
        setPasswordErrorMsg('密码不符合强度要求');
        return;
      }
    }

    if (data.digits && data.digits > 0) {
      const digitsCount = (value.match(/[0-9]/g) || []).length;
      if (digitsCount < data.digits) {
        setPasswordErrorMsg('密码不符合强度要求');
        return;
      }
    }

    if (data.specialChar && data.specialChar > 0) {
      const specialChars = ["'", '"', '!', '@', '#', '$', '%', '^', '&', '*', '.'];
      const specialCharCount = Array.from(value).filter((char) => specialChars.includes(char)).length;
      if (specialCharCount < data.specialChar) {
        setPasswordErrorMsg('密码不符合强度要求');
        return;
      }
    }

    setPasswordErrorMsg('');
  };

  const dynamicallyCheckConfirm = (value: string) => {
    const password = form.getFieldValue('password');
    if (value !== password) {
      setPasswordErrorMsg('两次输入的密码不一致');
    } else {
      setPasswordErrorMsg('');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (passwordErrorMsg) {
        message.warning('请检查密码是否符合要求');
        return;
      }

      setSubmitting(true);
      await passwordService.changePassword(values);
      message.success('密码修改成功');
      form.resetFields(['oldPassword', 'password', 'confirmPassword']);
      setPasswordErrorMsg('');

      // 更新用户信息中的密码设置状态
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      userInfo.passwordSetType = 0;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error: any) {
      console.error('修改密码失败:', error);
      message.error(error.message || '修改密码失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={24}>
          <Col xs={24} md={16}>
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="userId" hidden>
              <Input />
            </Form.Item>
            <Form.Item label="姓名" name="displayName">
              <Input disabled />
            </Form.Item>
            <Form.Item label="登录账号" name="username">
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="原密码"
              name="oldPassword"
              rules={[{ required: true, message: '请输入原密码' }]}
            >
              <Input.Password
                placeholder="请输入原密码"
                visibilityToggle={{ visible: oldPasswordVisible, onVisibleChange: setOldPasswordVisible }}
              />
            </Form.Item>
            <Form.Item
              label="新密码"
              name="password"
              rules={[{ required: true, message: '请输入新密码' }]}
            >
              <Input.Password
                placeholder="请输入新密码"
                visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                onChange={(e) => dynamicallyCheckPassword(e.target.value)}
              />
              {passwordErrorMsg && (
                <Alert message={passwordErrorMsg} type="warning" showIcon style={{ marginTop: 8 }} />
              )}
            </Form.Item>
            <Form.Item
              label="确认密码"
              name="confirmPassword"
              rules={[{ required: true, message: '请确认新密码' }]}
            >
              <Input.Password
                placeholder="请确认新密码"
                onChange={(e) => dynamicallyCheckConfirm(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <h2>
              <LockOutlined /> 密码强度要求
            </h2>
            <ul style={{ padding: '0 20px' }}>
              {policyMessage.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default Password;

