import { useState } from 'react';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormText,
  ProFormDigit,
  ProFormSwitch,
  ProFormSelect,
} from '@ant-design/pro-components';
import {
  message,
  Tabs,
} from 'antd';

const SystemConfig: React.FC = () => {
  const [activeKey, setActiveKey] = useState('institution');

  // 保存机构配置
  const handleSaveInstitution = async (values: any) => {
    try {
      console.log('保存机构配置:', values);
      message.success('保存机构配置成功');
      return true;
    } catch (error) {
      message.error('保存机构配置失败');
      return false;
    }
  };

  // 保存密码策略
  const handleSavePasswordPolicy = async (values: any) => {
    try {
      console.log('保存密码策略:', values);
      message.success('保存密码策略成功');
      return true;
    } catch (error) {
      message.error('保存密码策略失败');
      return false;
    }
  };

  // 保存会话配置
  const handleSaveSessionConfig = async (values: any) => {
    try {
      console.log('保存会话配置:', values);
      message.success('保存会话配置成功');
      return true;
    } catch (error) {
      message.error('保存会话配置失败');
      return false;
    }
  };

  return (
    <PageContainer
      header={{
        title: '系统配置',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '系统配置' },
          ],
        },
      }}
    >
      <ProCard>
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={[
            {
              key: 'institution',
              label: '机构配置',
              children: (
                <ProForm
                  onFinish={handleSaveInstitution}
                  initialValues={{
                    institutionName: 'MaxKey',
                    fullName: 'MaxKey SSO Platform',
                    domain: 'maxkey.top',
                    email: 'support@maxkey.top',
                  }}
                  submitter={{
                    searchConfig: {
                      submitText: '保存配置',
                    },
                    resetButtonProps: {
                      style: { display: 'none' },
                    },
                  }}
                >
                  <ProFormText
                    name="institutionName"
                    label="机构名称"
                    width="md"
                    placeholder="请输入机构名称"
                    rules={[{ required: true, message: '请输入机构名称' }]}
                  />
                  <ProFormText
                    name="fullName"
                    label="机构全称"
                    width="md"
                    placeholder="请输入机构全称"
                  />
                  <ProFormText
                    name="domain"
                    label="域名"
                    width="md"
                    placeholder="请输入域名"
                    rules={[{ required: true, message: '请输入域名' }]}
                  />
                  <ProFormText
                    name="email"
                    label="联系邮箱"
                    width="md"
                    placeholder="请输入联系邮箱"
                    rules={[
                      { required: true, message: '请输入联系邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' },
                    ]}
                  />
                  <ProFormText
                    name="phone"
                    label="联系电话"
                    width="md"
                    placeholder="请输入联系电话"
                  />
                  <ProFormText
                    name="address"
                    label="地址"
                    width="md"
                    placeholder="请输入地址"
                  />
                </ProForm>
              ),
            },
            {
              key: 'password',
              label: '密码策略',
              children: (
                <ProForm
                  onFinish={handleSavePasswordPolicy}
                  initialValues={{
                    minLength: 8,
                    maxLength: 20,
                    requireUppercase: true,
                    requireLowercase: true,
                    requireDigit: true,
                    requireSpecialChar: true,
                    expirationDays: 90,
                    historyCount: 5,
                  }}
                  submitter={{
                    searchConfig: {
                      submitText: '保存配置',
                    },
                    resetButtonProps: {
                      style: { display: 'none' },
                    },
                  }}
                >
                  <ProFormDigit
                    name="minLength"
                    label="最小长度"
                    width="sm"
                    placeholder="请输入最小长度"
                    min={6}
                    max={50}
                    fieldProps={{ precision: 0 }}
                    rules={[{ required: true, message: '请输入最小长度' }]}
                  />
                  <ProFormDigit
                    name="maxLength"
                    label="最大长度"
                    width="sm"
                    placeholder="请输入最大长度"
                    min={6}
                    max={50}
                    fieldProps={{ precision: 0 }}
                    rules={[{ required: true, message: '请输入最大长度' }]}
                  />
                  <ProFormSwitch
                    name="requireUppercase"
                    label="要求大写字母"
                  />
                  <ProFormSwitch
                    name="requireLowercase"
                    label="要求小写字母"
                  />
                  <ProFormSwitch
                    name="requireDigit"
                    label="要求数字"
                  />
                  <ProFormSwitch
                    name="requireSpecialChar"
                    label="要求特殊字符"
                  />
                  <ProFormDigit
                    name="expirationDays"
                    label="密码有效期(天)"
                    width="sm"
                    placeholder="请输入密码有效期"
                    min={0}
                    fieldProps={{ precision: 0 }}
                    tooltip="0表示永不过期"
                  />
                  <ProFormDigit
                    name="historyCount"
                    label="历史密码限制"
                    width="sm"
                    placeholder="请输入历史密码限制"
                    min={0}
                    fieldProps={{ precision: 0 }}
                    tooltip="限制用户不能使用最近N次的历史密码"
                  />
                </ProForm>
              ),
            },
            {
              key: 'session',
              label: '会话配置',
              children: (
                <ProForm
                  onFinish={handleSaveSessionConfig}
                  initialValues={{
                    timeout: 30,
                    maxSessions: 1,
                    kickoutAfter: false,
                  }}
                  submitter={{
                    searchConfig: {
                      submitText: '保存配置',
                    },
                    resetButtonProps: {
                      style: { display: 'none' },
                    },
                  }}
                >
                  <ProFormDigit
                    name="timeout"
                    label="会话超时时间(分钟)"
                    width="sm"
                    placeholder="请输入会话超时时间"
                    min={1}
                    fieldProps={{ precision: 0 }}
                    rules={[{ required: true, message: '请输入会话超时时间' }]}
                  />
                  <ProFormDigit
                    name="maxSessions"
                    label="最大并发会话数"
                    width="sm"
                    placeholder="请输入最大并发会话数"
                    min={1}
                    fieldProps={{ precision: 0 }}
                    tooltip="用户可同时登录的最大会话数"
                    rules={[{ required: true, message: '请输入最大并发会话数' }]}
                  />
                  <ProFormSwitch
                    name="kickoutAfter"
                    label="踢出后登录会话"
                    tooltip="当达到最大会话数时，是否踢出最早登录的会话"
                  />
                  <ProFormSelect
                    name="sessionStorage"
                    label="会话存储方式"
                    width="sm"
                    options={[
                      { label: '内存', value: 'memory' },
                      { label: 'Redis', value: 'redis' },
                      { label: 'Database', value: 'database' },
                    ]}
                    placeholder="请选择会话存储方式"
                    rules={[{ required: true, message: '请选择会话存储方式' }]}
                  />
                </ProForm>
              ),
            },
          ]}
        />
      </ProCard>
    </PageContainer>
  );
};

export default SystemConfig;
