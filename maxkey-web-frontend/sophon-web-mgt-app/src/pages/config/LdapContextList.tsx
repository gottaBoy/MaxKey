import { useState, useEffect } from 'react';
import { PageContainer, ProForm, ProFormText, ProFormSelect, ProFormSwitch, ProFormDependency } from '@ant-design/pro-components';
import { Button, message, Card, Row, Col, Space } from 'antd';
import ldapContextService, { LdapContext } from '@/services/ldap-context.service';

const LdapContextList: React.FC = () => {
  const [form] = ProForm.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await ldapContextService.get('');
      if (result) {
        form.setFieldsValue(result);
      }
    } catch (error: any) {
      message.error('加载LDAP配置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: LdapContext) => {
    setSubmitting(true);
    try {
      await ldapContextService.update(values);
      message.success('保存成功');
    } catch (error: any) {
      message.error('保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTest = async () => {
    const values = await form.validateFields();
    setTesting(true);
    try {
      await ldapContextService.test(values);
      message.success('连接测试成功');
    } catch (error: any) {
      message.error('连接测试失败');
    } finally {
      setTesting(false);
    }
  };

  return (
    <PageContainer
      header={{
        title: 'LDAP配置',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '配置管理' },
            { title: 'LDAP配置' },
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
                  <Space>
                    <Button type="primary" htmlType="submit" loading={submitting}>
                      提交
                    </Button>
                    <Button onClick={handleTest} loading={testing}>
                      测试
                    </Button>
                  </Space>
                </Col>
              </Row>
            ),
          }}
        >
          <ProFormText name="id" label="ID" hidden />
          <ProFormSelect
            name="product"
            label="产品"
            options={[
              { label: 'ActiveDirectory', value: 'ActiveDirectory' },
              { label: 'OpenLDAP', value: 'OpenLDAP' },
              { label: 'StandardLDAP', value: 'StandardLDAP' },
            ]}
            rules={[{ required: true }]}
          />
          <ProFormSwitch name="switch_status" label="状态" />
          <ProFormText name="providerUrl" label="提供者URL" rules={[{ required: true }]} />
          <ProFormSwitch name="switch_accountMapping" label="账号映射" />
          <ProFormText name="principal" label="主体" rules={[{ required: true }]} />
          <ProFormText.Password name="credentials" label="凭证" rules={[{ required: true }]} />
          <ProFormDependency name={['product']}>
            {({ product }) => {
              if (product === 'ActiveDirectory') {
                return (
                  <>
                    <ProFormText name="msadDomain" label="MSAD域" />
                  </>
                );
              }
              return (
                <>
                  <ProFormText name="basedn" label="基础DN" rules={[{ required: true }]} />
                  <ProFormText name="filters" label="过滤器" rules={[{ required: true }]} />
                </>
              );
            }}
          </ProFormDependency>
          <ProFormSwitch name="switch_sslSwitch" label="SSL开关" />
          <ProFormDependency name={['switch_sslSwitch']}>
            {({ switch_sslSwitch }) => {
              if (switch_sslSwitch) {
                return (
                  <>
                    <ProFormText name="trustStore" label="信任存储" />
                    <ProFormText name="trustStorePassword" label="信任存储密码" />
                  </>
                );
              }
              return null;
            }}
          </ProFormDependency>
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default LdapContextList;

