import { LockOutlined, UserOutlined, SafetyOutlined } from '@ant-design/icons';
import { ProFormText, ProFormCheckbox, ProForm } from '@ant-design/pro-components';
import { Alert, Button, message } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/auth.service';
import './Login.less';

interface LoginConfig {
  inst: {
    id: string;
    name: string;
    logo: string;
  };
  captcha: string;
  state: string;
}

interface CaptchaData {
  state: string;
  image: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loginConfig, setLoginConfig] = useState<LoginConfig | null>(null);
  const [captchaData, setCaptchaData] = useState<CaptchaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [configLoading, setConfigLoading] = useState(false);

  const loadLoginConfig = async () => {
    // 避免重复加载
    if (configLoading || loginConfig) return;
    
    setConfigLoading(true);
    try {
      const config = await authService.getLoginConfig();
      setLoginConfig(config);
      
      // 如果需要验证码，立即加载（失败不影响配置）
      if (config.captcha !== 'NONE') {
        // 不等待验证码加载完成，避免阻塞登录界面显示
        loadCaptcha(config.captcha, config.state).catch((error) => {
          console.error('验证码加载失败，但不影响登录界面显示:', error);
          // 验证码加载失败不影响界面，用户可以通过点击"点击加载"手动重试
        });
      }
    } catch (error) {
      console.error('加载登录配置失败:', error);
      // 即使失败也设置一个默认配置，让登录界面能显示
      // 注意：这里不设置 captcha: 'NONE'，而是保持 undefined，让用户知道需要验证码但配置加载失败
      setLoginConfig({
        inst: {
          id: '',
          name: 'ZERON',
          logo: '/logo.svg',
        },
        captcha: 'IMAGE', // 默认假设需要验证码，避免隐藏验证码输入框
        state: '',
      });
    } finally {
      setConfigLoading(false);
    }
  };

  const loadCaptcha = async (captchaType: string, state: string) => {
    console.log('开始加载验证码:', { captchaType, state });
    try {
      const captcha = await authService.getCaptcha(captchaType, state);
      console.log('验证码加载成功:', captcha);
      
      if (captcha && captcha.image) {
        // 确保image字段存在
        const captchaData = {
          state: captcha.state || state,
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
      // 不显示错误消息给用户，避免显示"服务器错误"
      // 不设置 setCaptchaData(null)，保持之前的状态，或者设置为 null 让用户看到"点击加载"
      setCaptchaData(null);
    }
  };

  const refreshCaptcha = async () => {
    if (loginConfig && loginConfig.captcha !== 'NONE') {
      try {
        // 只获取新的state token用于验证码刷新
        const config = await authService.getLoginConfig();
        // 更新state但保持其他配置不变
        setLoginConfig({ ...loginConfig, state: config.state });
        await loadCaptcha(loginConfig.captcha, config.state);
      } catch (error) {
        console.error('刷新验证码失败:', error);
        // 不显示错误消息，让用户可以通过再次点击重试
        // 验证码输入框仍然显示，用户可以继续尝试
      }
    }
  };

  useEffect(() => {
    loadLoginConfig();
  }, []);

  const handleSubmit = async (values: any) => {
    if (!loginConfig) return false;

    setLoading(true);
    setErrorMessage('');
    try {
      const loginData = {
        authType: 'normal',
        username: values.username,
        password: values.password,
        captcha: values.captcha || '',
        state: captchaData?.state || loginConfig.state,
      };

      const result = await authService.login(loginData);
      
      localStorage.setItem('token', result.token);
      localStorage.setItem('userInfo', JSON.stringify(result.userInfo));
      
      message.success('登录成功');
      navigate('/dashboard');
      return true;
    } catch (error: any) {
      setErrorMessage(error.message || '登录失败，请检查用户名和密码');
      await refreshCaptcha();
      return false;
    } finally {
      setLoading(false);
    }
  };

  if (!loginConfig) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div>加载中...</div>
      </div>
    );
  }

  // 确保验证码输入框始终显示（如果配置需要验证码）
  // 即使验证码图片加载失败，输入框也应该显示
  const needCaptcha = loginConfig.captcha !== 'NONE' && loginConfig.captcha !== undefined;

  return (
    <div className="login-form-container">
      {errorMessage && (
        <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: 24 }} />
      )}

      <ProForm
        onFinish={handleSubmit}
        submitter={{
          render: () => (
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
              style={{ marginTop: 8 }}
            >
              登录
            </Button>
          ),
        }}
      >
        <ProFormText
          name="username"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className="login-form-prefix-icon" />,
            autoComplete: 'off',
          }}
          placeholder="用户名"
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        />

        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            autoComplete: 'new-password',
            prefix: <LockOutlined className="login-form-prefix-icon" />,
          }}
          placeholder="密码"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        />

        {needCaptcha && (
          <ProFormText
            name="captcha"
            fieldProps={{
              size: 'large',
              prefix: <SafetyOutlined className="login-form-prefix-icon" />,
              suffix: captchaData?.image ? (
                <img
                  src={captchaData.image.startsWith('data:') ? captchaData.image : `data:image/png;base64,${captchaData.image}`}
                  alt="验证码"
                  onClick={refreshCaptcha}
                  onLoad={() => {
                    console.log('验证码图片加载成功');
                  }}
                  onError={(e) => {
                    console.error('验证码图片加载失败:', e);
                    console.error('图片src:', captchaData.image);
                    setCaptchaData(null);
                    // 自动重新加载
                    if (loginConfig) {
                      setTimeout(() => {
                        loadCaptcha(loginConfig.captcha, loginConfig.state);
                      }, 500);
                    }
                  }}
                  style={{
                    height: '32px',
                    maxWidth: '100px',
                    cursor: 'pointer',
                    borderRadius: '2px',
                    border: '1px solid #d9d9d9',
                  }}
                  title="点击刷新验证码"
                />
              ) : (
                <span 
                  onClick={refreshCaptcha}
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
              ),
            }}
            placeholder={
              loginConfig.captcha === 'arithmetic' ? '请输入计算结果' : '请输入验证码'
            }
            rules={[
              {
                required: true,
                message: '请输入验证码',
              },
            ]}
          />
        )}

        <div style={{ marginBottom: 24 }}>
          <ProFormCheckbox noStyle name="remember-me">
            记住我
          </ProFormCheckbox>
        </div>
      </ProForm>
    </div>
  );
};

export default Login;
