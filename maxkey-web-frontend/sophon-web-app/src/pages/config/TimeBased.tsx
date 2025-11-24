import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Row, Col, Image, message, Space } from 'antd';
import type { TimeBased } from '@/types/entity';
import timeBasedService from '@/services/time-based.service';
import './TimeBased.less';

const TimeBased: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await timeBasedService.view();
      form.setFieldsValue({
        ...data,
        formatSharedSecret: formatSecret(data.sharedSecret || ''),
      });
      setQrCode(data.qrCode || '');
    } catch (error: any) {
      console.error('加载时间令牌信息失败:', error);
      message.error('加载时间令牌信息失败');
    } finally {
      setLoading(false);
    }
  };

  const formatSecret = (secret: string): string => {
    if (!secret) return '';
    return secret.match(/.{1,4}/g)?.join(' ') || secret;
  };

  const handleGenerate = async () => {
    try {
      setSubmitting(true);
      const data = await timeBasedService.generate();
      form.setFieldsValue({
        ...data,
        formatSharedSecret: formatSecret(data.sharedSecret || ''),
      });
      setQrCode(data.qrCode || '');
      message.success('生成成功');
    } catch (error: any) {
      console.error('生成时间令牌失败:', error);
      message.error('生成时间令牌失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await timeBasedService.update(values);
      message.success('保存成功');
    } catch (error: any) {
      console.error('保存失败:', error);
      message.error('保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async () => {
    try {
      const otpCode = form.getFieldValue('otpCode');
      if (!otpCode) {
        message.warning('请输入一次性密码');
        return;
      }
      await timeBasedService.verify(otpCode);
      message.success('验证成功');
    } catch (error: any) {
      console.error('验证失败:', error);
      message.error('验证失败');
    }
  };

  return (
    <Card loading={loading}>
      <Form form={form} layout="vertical">
        <Row gutter={24}>
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            {qrCode && <Image src={qrCode} width={200} preview={false} />}
          </Col>
          <Col xs={24} md={16}>
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            <Form.Item label="姓名" name="displayName">
              <Input disabled />
            </Form.Item>
            <Form.Item label="登录账号" name="username">
              <Input disabled />
            </Form.Item>
            <Form.Item label="位数" name="digits">
              <Input disabled />
            </Form.Item>
            <Form.Item label="周期" name="period">
              <Input disabled />
            </Form.Item>
            <Form.Item label="共享密钥" name="formatSharedSecret">
              <Input disabled />
            </Form.Item>
            <Form.Item label="一次性密码" name="otpCode">
              <Input placeholder="请在生成后输入一次性密码用于验证" />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" onClick={handleGenerate} loading={submitting}>
                  生成
                </Button>
                <Button type="primary" onClick={handleSubmit} loading={submitting}>
                  保存
                </Button>
                <Button type="primary" onClick={handleVerify}>
                  验证
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default TimeBased;

