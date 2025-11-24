import request from '@/utils/request';

interface ApiResponse<T = any> {
  code: number;
  message?: string;
  data?: T;
}

interface LoginConfig {
  token?: string;
  socials?: {
    providers: any[];
    qrScan?: string;
  };
  state?: string;
  captcha?: string;
  passkeyEnabled?: boolean;
  passkeyAllowedOrigins?: string[];
}

interface LoginParams {
  userName?: string;
  password?: string;
  captcha?: string;
  mobile?: string;
  otpCaptcha?: string;
  remember?: boolean;
}

class AuthnService {
  private baseUrl = '/sign/login';

  /**
   * 获取登录配置
   * 注意：request 拦截器已经提取了 data 部分，所以这里直接返回
   */
  async get(params?: { remember_me?: string }): Promise<LoginConfig> {
    try {
      // request 拦截器已经提取了 data，所以 result 就是 LoginConfig
      const result = await request.get<LoginConfig>(`${this.baseUrl}/get?_allow_anonymous=true`, { params });
      console.log('authnService.get 返回:', result); // 调试日志
      return result || {};
    } catch (error: any) {
      console.error('获取登录配置失败:', error);
      return {};
    }
  }

  /**
   * 登录
   */
  async login(params: LoginParams): Promise<any> {
    return request.post(`${this.baseUrl}/signin?_allow_anonymous=true`, params);
  }

  /**
   * 发送OTP验证码
   */
  async produceOtp(mobile: string): Promise<void> {
    return request.get(`${this.baseUrl}/sendotp/${mobile}?_allow_anonymous=true`);
  }

  /**
   * 退出登录
   */
  async logout(): Promise<void> {
    return request.get('/sign/logout');
  }
}

export default new AuthnService();

