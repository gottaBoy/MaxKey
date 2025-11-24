import { useState, useEffect } from 'react';
import { Card, Table, Button, message, Modal, Space, Divider } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { PasskeyInfo } from '@/types/entity';
import passkeyService from '@/services/passkey.service';
import './Passkey.less';

const Passkey: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [passkeyList, setPasskeyList] = useState<PasskeyInfo[]>([]);

  useEffect(() => {
    loadPasskeys();
  }, []);

  const getCurrentUserId = (): string | null => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return userInfo.userId || userInfo.id || null;
  };

  const isWebAuthnSupported = (): boolean => {
    return !!(window.PublicKeyCredential && navigator.credentials && navigator.credentials.create);
  };

  const loadPasskeys = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      message.error('无法获取当前用户ID，请重新登录');
      return;
    }

    try {
      setLoading(true);
      const list = await passkeyService.list(userId);
      setPasskeyList(list);
    } catch (error: any) {
      console.error('加载Passkey列表失败:', error);
      message.error('加载Passkey列表失败');
      setPasskeyList([]);
    } finally {
      setLoading(false);
    }
  };

  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    try {
      let normalizedBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalizedBase64 + '='.repeat((4 - (normalizedBase64.length % 4)) % 4);
      const binaryString = atob(padded);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    } catch (error) {
      console.error('Base64解码失败:', error);
      throw new Error('Base64解码失败');
    }
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    try {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    } catch (error) {
      console.error('ArrayBuffer编码失败:', error);
      throw new Error('ArrayBuffer编码失败');
    }
  };

  const convertRegistrationOptions = (regOptions: any): PublicKeyCredentialCreationOptions => {
    return {
      ...regOptions,
      challenge: base64ToArrayBuffer(regOptions.challenge),
      user: {
        ...regOptions.user,
        id: base64ToArrayBuffer(regOptions.user.id),
      },
      excludeCredentials:
        regOptions.excludeCredentials?.map((cred: any) => ({
          ...cred,
          id: base64ToArrayBuffer(cred.id),
        })) || [],
    };
  };

  const handlePasskeyError = (error: any) => {
    if (error.name === 'NotAllowedError') {
      message.error('Passkey 注册被取消或失败');
    } else if (error.name === 'NotSupportedError') {
      message.error('您的设备不支持 Passkey 功能');
    } else if (error.name === 'SecurityError') {
      message.error('安全错误，请检查HTTPS连接');
    } else if (error.name === 'InvalidStateError') {
      message.error('设备状态无效，请重试');
    } else {
      message.error(error.message || 'Passkey 注册失败，请重试');
    }
  };

  const registerPasskey = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      message.error('无法获取当前用户ID，请重新登录');
      return;
    }

    if (!isWebAuthnSupported()) {
      message.error('您的浏览器不支持 WebAuthn/Passkey 功能');
      return;
    }

    if (loading) {
      return;
    }

    try {
      setLoading(true);

      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const registrationRequest = {
        userId,
        username: userInfo.username || 'unknown_user',
        displayName: userInfo.displayName || '未知用户',
      };

      const beginResponse = await passkeyService.begin(
        registrationRequest.userId,
        registrationRequest.username,
        registrationRequest.displayName,
      );

      if (beginResponse.code !== 0) {
        throw new Error(beginResponse.message || '获取注册选项失败');
      }

      const regOptions = beginResponse.data;
      if (!regOptions) {
        throw new Error('注册选项为空');
      }

      const convertedOptions = convertRegistrationOptions(regOptions);

      const credential = (await navigator.credentials.create({
        publicKey: convertedOptions,
      })) as PublicKeyCredential;

      if (!credential) {
        throw new Error('凭证创建失败');
      }

      const credentialResponse = credential.response as AuthenticatorAttestationResponse;

      const finishRequest = {
        userId,
        challengeId: regOptions.challengeId,
        credentialId: credential.id,
        attestationObject: arrayBufferToBase64(credentialResponse.attestationObject),
        clientDataJSON: arrayBufferToBase64(credentialResponse.clientDataJSON),
      };

      const passkeyInfo = await passkeyService.finish(finishRequest);

      message.success('Passkey 注册成功！');
      setPasskeyList([passkeyInfo, ...passkeyList]);
    } catch (error: any) {
      console.error('Passkey 注册失败:', error);
      handlePasskeyError(error);
    } finally {
      setLoading(false);
    }
  };

  const deletePasskey = async (credentialId: string) => {
    const userId = getCurrentUserId();
    if (!userId) {
      message.error('无法获取当前用户ID，请重新登录');
      return;
    }

    try {
      await passkeyService.delete(userId, credentialId);
      message.success('Passkey 删除成功');
      setPasskeyList(passkeyList.filter((item) => item.credentialId !== credentialId));
    } catch (error: any) {
      console.error('删除Passkey失败:', error);
      message.error('Passkey 删除失败');
    }
  };

  const confirmDeletePasskey = (credentialId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个 Passkey 吗？此操作不可撤销。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        deletePasskey(credentialId);
      },
    });
  };

  const columns: ColumnsType<PasskeyInfo> = [
    {
      title: '凭证信息',
      key: 'credential',
      render: (_, record) => (
        <div className="credential-info">
          <div className="credential-id">{record.credentialId || record.id}</div>
          <div className="device-type">
            {record.deviceType === 'platform' ? '平台认证器' : '跨平台认证器'}
          </div>
        </div>
      ),
    },
    {
      title: '签名统计',
      dataIndex: 'signatureCount',
      render: (count) => count || 0,
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      render: (date) => (date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: '最近访问时间',
      dataIndex: 'lastUsedDate',
      render: (date) => (date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          danger
          size="small"
          onClick={() => confirmDeletePasskey(record.credentialId || record.id || '')}
        >
          删除 passkey
        </Button>
      ),
    },
  ];

  return (
    <Card title="Passkey 管理">
      <div className="passkey-container">
        <div className="mb-md">
          <p className="text-grey">
            Passkey 是一种更安全、更便捷的登录方式，使用您的设备生物识别或 PIN 码进行身份验证。
          </p>
        </div>

        <div className="mb-lg">
          <Button
            type="primary"
            size="large"
            loading={loading}
            icon={<PlusCircleOutlined />}
            onClick={registerPasskey}
          >
            注册新的 Passkey
          </Button>
        </div>

        <Divider>已注册的 Passkey</Divider>

        <Table
          columns={columns}
          dataSource={passkeyList}
          rowKey={(record) => record.credentialId || record.id || ''}
          loading={loading}
          pagination={false}
        />
      </div>
    </Card>
  );
};

export default Passkey;

