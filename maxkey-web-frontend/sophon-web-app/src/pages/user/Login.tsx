import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Radio, Checkbox, Alert, message, Space, Tooltip } from 'antd';
import { UserOutlined, LockOutlined, QrcodeOutlined, SafetyCertificateOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import authnService from '@/services/authn.service';
import imageCaptchaService from '@/services/image-captcha.service';
import './Login.less';

interface SocialProvider {
  provider: string;
  providerName: string;
  icon: string;
}

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('normal');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [captchaType, setCaptchaType] = useState('NONE');
  const [captchaData, setCaptchaData] = useState<{ state: string; image: string } | null>(null);
  const [passkeyEnabled, setPasskeyEnabled] = useState(false);
  const [socialProviders, setSocialProviders] = useState<SocialProvider[]>([]);
  const [state, setState] = useState('');
  const [configLoading, setConfigLoading] = useState(false);

  useEffect(() => {
    loadLoginConfig();
  }, []);

  const loadLoginConfig = async () => {
    // 避免重复加载
    if (configLoading) {
      console.log('配置正在加载中，跳过重复调用');
      return;
    }
    
    setConfigLoading(true);
    try {
      const rememberMe = localStorage.getItem('remember_me') || '';
      const config = await authnService.get({ remember_me: rememberMe });
      
      console.log('登录配置:', config); // 调试日志
      console.log('验证码类型:', config.captcha); // 调试日志
      console.log('社交登录:', config.socials); // 调试日志
      
      // 检查是否已登录：优先检查 token，如果没有则检查 ticket 或 userInfo
      const existingToken = localStorage.getItem('token');
      const existingTicket = localStorage.getItem('ticket');
      const existingUserInfo = localStorage.getItem('userInfo');
      
      if (config.token || existingToken || existingTicket || existingUserInfo) {
        // 已登录，直接跳转
        if (config.token) {
          localStorage.setItem('token', config.token);
        }
        // 使用 window.location.href 强制跳转，确保页面完全刷新
        window.location.href = '/app-panel';
        return;
      }

      const captcha = config.captcha || 'NONE';
      const currentState = config.state || '';
      
      console.log('设置验证码类型:', captcha, 'State:', currentState); // 调试日志
      setCaptchaType(captcha);
      setPasskeyEnabled(!config.passkeyEnabled && false);
      setState(currentState);
      
      // 设置社交登录提供商
      if (config.socials && config.socials.providers && Array.isArray(config.socials.providers)) {
        console.log('社交登录提供商原始数据:', config.socials.providers); // 调试日志
        // 处理图标路径：将 assets/social/xxx.png 转换为完整URL
        const providersWithIconUrl = config.socials.providers.filter((provider: any) => provider.provider === 'feishu').map((provider: any) => {
          let iconUrl = provider.icon || '';
          if (iconUrl) {
            if (iconUrl.startsWith('assets/')) {
              // assets/social/xxx.png -> /assets/social/xxx.png
              iconUrl = `/${iconUrl}`;
            } else if (iconUrl.startsWith('./')) {
              // ./assets/social/xxx.png -> /assets/social/xxx.png
              iconUrl = `/${iconUrl.substring(2)}`;
            } else if (!iconUrl.startsWith('http') && !iconUrl.startsWith('/')) {
              // 如果不是完整URL，添加 / 前缀
              iconUrl = `/${iconUrl}`;
            }
          }
          return {
            ...provider,
            icon: iconUrl,
          };
        });
        console.log('处理后的社交登录提供商:', providersWithIconUrl); // 调试日志
        setSocialProviders(providersWithIconUrl);
      } else {
        console.log('未找到社交登录提供商, config.socials:', config.socials); // 调试日志
      }
      
      // 如果需要验证码，立即加载（失败不影响配置）
      // 参考 Angular 版本：只要 captchaType !== 'NONE'，就调用验证码接口
      console.log('🔍 检查验证码类型:', { captcha, currentState, 'captcha !== NONE': captcha !== 'NONE' });
      
      if (captcha !== 'NONE') {
        console.log('✅ 需要验证码，立即调用 loadImageCaptcha, captcha:', captcha);
        // 不等待验证码加载完成，避免阻塞登录界面显示
        loadImageCaptcha(currentState, captcha).catch((error) => {
          console.error('❌ 验证码加载失败，但不影响登录界面显示:', error);
          // 验证码加载失败不影响界面，用户可以通过点击"点击加载"手动重试
        });
      } else {
        console.log('ℹ️ 不需要验证码, captcha:', captcha); // 调试日志
      }
    } catch (error: any) {
      console.error('加载登录配置失败:', error);
      // 即使失败也设置一个默认配置，让登录界面能显示
      setCaptchaType('TEXT');
      setState('');
      // 尝试加载验证码，但不阻塞
      loadImageCaptcha('', 'TEXT').catch((error) => {
        console.error('验证码加载失败:', error);
      });
    } finally {
      setConfigLoading(false);
    }
  };
  
  const loadImageCaptcha = async (currentState?: string, currentCaptchaType?: string) => {
    // 使用传入的参数，如果没有则使用 state
    const stateToUse = currentState !== undefined ? currentState : state;
    // 优先使用传入的参数，确保使用正确的类型
    const captchaTypeToUse = currentCaptchaType || captchaType;
    
    console.log('🔍 loadImageCaptcha 被调用:', {
      currentState,
      currentCaptchaType,
      stateToUse,
      captchaTypeToUse,
      state,
      captchaType,
    });
    
    // 参考 Angular 版本：只要不是 NONE，就调用验证码接口
    // TEXT 和 IMAGE 类型都需要调用接口并显示图片验证码
    if (captchaTypeToUse && captchaTypeToUse !== 'NONE') {
      try {
        console.log('✅ 开始调用验证码接口, state:', stateToUse, 'captchaType:', captchaTypeToUse);
        const captcha = await imageCaptchaService.getCaptcha(stateToUse, captchaTypeToUse);
        console.log('✅ 验证码加载成功:', captcha);
        
        if (captcha && captcha.image) {
          // 确保image字段存在
          const captchaData = {
            state: captcha.state || stateToUse || '',
            image: captcha.image,
          };
          console.log('设置验证码数据:', captchaData);
          setCaptchaData(captchaData);
        } else {
          console.warn('验证码数据格式不正确，缺少image字段:', captcha);
          // 保持验证码输入框显示，只是图片不显示
          setCaptchaData(null);
        }
      } catch (error: any) {
        console.error('加载验证码失败:', error);
        console.error('错误详情:', error.response?.data || error.message);
        // 静默失败，保持验证码输入框显示，UI会显示"点击加载"提示
        setCaptchaData(null);
      }
    } else {
      console.log('不需要验证码, captchaType:', captchaTypeToUse);
      setCaptchaData(null);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      setError('');

      // 参考 Angular 版本：传递完整的登录参数
      const loginParams: any = {
        authType: loginType, // 'normal' 或 'qrscan'
        state: captchaData?.state || state, // 使用最新的 state
        username: values.userName, // 注意：后端期望的是 username（小写），不是 userName
        password: values.password,
        captcha: captchaType !== 'NONE' ? (values.captcha || '') : null,
        mobile: null, // 手机登录时使用
        otpCaptcha: null, // OTP 验证码
        remeberMe: values.remember || false, // 注意：Angular 版本使用的是 remeberMe（拼写错误，但需要保持一致）
      };

      console.log('登录参数:', loginParams);
      const result = await authnService.login(loginParams);
      console.log('登录响应:', result);

      // 注意：响应拦截器已经提取了 data 部分，所以 result 就是 data 对象
      // 如果 result 存在且有 ticket 或 token，说明登录成功
      if (result && (result.ticket || result.token || result.id)) {
        const authData = result;
        
        // 保存认证信息（参考 Angular 版本）
        // token 可能是空字符串，使用 ticket 作为主要认证凭证
        if (authData.ticket) {
          localStorage.setItem('ticket', authData.ticket);
        }
        if (authData.token) {
          localStorage.setItem('token', authData.token);
        }
        
        // 用户信息直接在 data 中，不是嵌套在 data.user 中
        const userInfo = {
          id: authData.id,
          name: authData.name,
          username: authData.username,
          displayName: authData.displayName,
          email: authData.email,
          instId: authData.instId,
          instName: authData.instName,
          passwordSetType: authData.passwordSetType,
          authorities: authData.authorities || [],
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        // 保存完整的认证数据（用于后续请求）
        localStorage.setItem('authData', JSON.stringify(authData));
        
        if (values.remember) {
          localStorage.setItem('remember_me', 'true');
        } else {
          localStorage.removeItem('remember_me');
        }

        // 参考 Angular 版本：检查是否需要二次认证
        if (authData.twoFactor === '0') {
          // 不需要二次认证，直接跳转
          message.success('登录成功');
          console.log('✅ 登录成功，准备跳转到 /dashboard/home');
          console.log('✅ 保存的 token:', authData.token ? '已保存' : '空');
          console.log('✅ 保存的 ticket:', authData.ticket ? '已保存' : '空');
          // 使用 window.location.href 强制跳转，确保页面完全刷新
          // 立即跳转，不延迟，避免在延迟期间触发其他逻辑
          window.location.href = '/app-panel';
        } else {
          // 需要二次认证，跳转到二次认证页面
          localStorage.setItem('two_factor_data', JSON.stringify(authData));
          message.info('需要进行二次认证');
          setTimeout(() => {
            window.location.href = '/config/mfa';
          }, 500);
        }
      } else {
        // 登录失败：result 可能包含错误信息，或者 result 为空
        const errorMsg = (result as any)?.message || '登录失败，请检查用户名和密码';
        setError(errorMsg);
        console.error('登录失败，响应数据:', result);
        // 登录失败后刷新验证码（只要不是 NONE）
        if (captchaType !== 'NONE') {
          await loadImageCaptcha(state, captchaType);
        }
      }
    } catch (error: any) {
      console.error('登录失败:', error);
      setError(error.message || '登录失败');
      // 登录失败后刷新验证码（只要不是 NONE）
      if (captchaType !== 'NONE') {
        await loadImageCaptcha(state, captchaType);
      }
    } finally {
      setLoading(false);
    }
  };

  const needCaptcha = captchaType && captchaType !== 'NONE' && captchaType !== undefined && captchaType !== '';

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <h1>
            <span style={{ color: '#000099' }}>Zeron</span>
            <span style={{ color: '#FFD700' }}>Edge</span>
          </h1>
          {/* <p>单点登录系统</p> */}
        </div>

        <Radio.Group
          value={loginType}
          onChange={(e) => setLoginType(e.target.value)}
          buttonStyle="solid"
          size="large"
          style={{ width: '100%', marginBottom: 24 }}
        >
          <Radio.Button value="normal" style={{ width: '50%', textAlign: 'center' }}>
            <UserOutlined /> 账号登录
          </Radio.Button>
          <Radio.Button value="qrscan" style={{ width: '50%', textAlign: 'center' }}>
            <QrcodeOutlined /> 扫码登录
          </Radio.Button>
        </Radio.Group>

        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 24 }} />
        )}

        {loginType === 'normal' && (
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item
              name="userName"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                size="large"
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
                iconRender={(visible) =>
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            {/* 验证码输入框 */}
            {needCaptcha && (
              <Form.Item
                name="captcha"
                rules={[{ required: true, message: '请输入验证码' }]}
              >
                {/* 参考 Angular 版本：TEXT 和 IMAGE 都显示图片验证码 */}
                <Input
                  placeholder="验证码"
                  size="large"
                  addonAfter={
                    captchaData?.image ? (
                      <img
                        src={captchaData.image.startsWith('data:') ? captchaData.image : `data:image/png;base64,${captchaData.image}`}
                        alt="验证码"
                        onClick={() => loadImageCaptcha(state, captchaType)}
                        onLoad={() => {
                          console.log('✅ 验证码图片加载成功');
                        }}
                        onError={(e) => {
                          console.error('❌ 验证码图片加载失败:', e);
                          console.error('图片src:', captchaData.image);
                          setCaptchaData(null);
                          // 自动重新加载
                          setTimeout(() => {
                            loadImageCaptcha(state, captchaType);
                          }, 500);
                        }}
                        style={{
                          height: '32px',
                          maxWidth: '100px',
                          cursor: 'pointer',
                          borderRadius: '2px',
                          border: '1px solid #d9d9d9',
                          backgroundColor: '#fff',
                        }}
                        title="点击刷新验证码"
                      />
                    ) : (
                      <span 
                        onClick={() => loadImageCaptcha(state, captchaType)}
                        style={{ 
                          color: '#1890ff', 
                          cursor: 'pointer',
                          fontSize: '12px',
                          padding: '0 8px',
                        }}
                        title="点击加载验证码"
                      >
                        点击加载
                      </span>
                    )
                  }
                />
              </Form.Item>
            )}

            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
                <a href="/user/forgot">忘记密码？</a>
              </Space>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} size="large" block>
                登录
              </Button>
            </Form.Item>

            {/* Passkey 登录 - 暂时不使用，但保留代码 */}
            {passkeyEnabled && (
              <Form.Item>
                <Button
                  type="default"
                  size="large"
                  block
                  icon={<SafetyCertificateOutlined />}
                  onClick={() => {
                    message.info('Passkey登录功能待实现');
                  }}
                >
                  Passkey登录
                </Button>
              </Form.Item>
            )}
          </Form>
        )}

        {loginType === 'qrscan' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p>扫码登录功能待实现</p>
          </div>
        )}

        {loginType === 'normal' && (
          <div className="other-login">
            {socialProviders.length > 0 ? (
              <div className="other-login-row">
                <span className="other-login-text">其他登录方式</span>
                <div className="other-login-icons">
                  {socialProviders.map((provider) => (
                    <Tooltip key={provider.provider} title={provider.providerName}>
                      <div
                        className="social-icon"
                        onClick={() => {
                          window.location.href = `/sign/socials/${provider.provider}/authz`;
                        }}
                      >
                        <img 
                          src={provider.icon} 
                          alt={provider.providerName}
                          onError={(e) => {
                            console.error('社交登录图标加载失败:', provider.icon);
                            // 图标加载失败时，显示占位符
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNiAxME0xNiAyMk0xMCAxNkgyMiIgc3Ryb2tlPSIjQ0NDIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+';
                          }}
                        />
                      </div>
                    </Tooltip>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: '#999', textAlign: 'center', padding: '8px 0' }}>
                未配置社交登录
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Login;

