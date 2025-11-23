import request from '@/utils/request';
import axios from 'axios';

export interface LoginConfig {
  inst: {
    id: string;
    name: string;
    logo: string;
  };
  captcha: string; // 'text' | 'arithmetic' | 'NONE'
  state: string; // JWT token for state
}

export interface CaptchaData {
  state: string;
  image: string; // base64 encoded image
}

export interface LoginCredential {
  authType: string;
  username: string;
  password: string;
  captcha: string;
  state: string;
}

export interface AuthJwt {
  token: string;
  refreshToken: string;
  expiresIn: number;
  userInfo: {
    id: string;
    username: string;
    displayName: string;
    email: string;
    mobile: string;
  };
}

class AuthService {
  private baseUrl = '/maxkey-mgt-api';

  // 获取登录配置（包括是否需要验证码、机构信息等）
  async getLoginConfig(): Promise<LoginConfig> {
    return request.get(`${this.baseUrl}/login/get`);
  }

  // 获取验证码图片
  async getCaptcha(captchaType: string, state: string): Promise<CaptchaData> {
    // 统一使用 /maxkey-mgt-api 路径
    // 直接使用axios避免request拦截器显示错误消息
    try {
      const response = await axios.get(`${this.baseUrl}/captcha?_allow_anonymous=true`, {
        params: {
          captcha: captchaType,
          state,
        },
        // 设置超时时间，避免长时间等待
        timeout: 10000,
      });
      
      const res = response.data;
      console.log('验证码API响应:', res);
      
      // 处理MaxKey响应格式: { code: 0, data: { image: '...', state: '...' } }
      if (res.code !== undefined) {
        if (res.code === 0 && res.data) {
          console.log('验证码数据:', res.data);
          return {
            state: res.data.state || state,
            image: res.data.image,
          } as CaptchaData;
        } else {
          console.error('验证码API返回错误:', res.message || res.msg);
          // 创建一个静默错误，不触发全局错误处理
          const error = new Error(res.message || res.msg || '获取验证码失败');
          (error as any).silent = true; // 标记为静默错误
          throw error;
        }
      }
      // 如果直接返回数据（兼容其他格式）
      if (res.image) {
        return {
          state: res.state || state,
          image: res.image,
        } as CaptchaData;
      }
      // 如果返回的是data对象
      return res as CaptchaData;
    } catch (error: any) {
      console.error('获取验证码失败:', error);
      if (error.response) {
        console.error('验证码API错误响应:', error.response.status, error.response.data);
      }
      // 标记为静默错误，避免触发全局错误处理
      if (!error.silent) {
        error.silent = true;
      }
      throw error;
    }
  }

  // 登录
  async login(credential: LoginCredential): Promise<AuthJwt> {
    return request.post(`${this.baseUrl}/login/signin`, credential);
  }

  // 登出
  async logout(): Promise<void> {
    return request.post(`${this.baseUrl}/logout`);
  }

  // 刷新 token
  async refreshToken(refreshToken: string): Promise<AuthJwt> {
    return request.post(`${this.baseUrl}/auth/refresh`, { refreshToken });
  }

  // 获取当前用户信息
  async getCurrentUser(): Promise<any> {
    return request.get(`${this.baseUrl}/auth/current`);
  }
}

export default new AuthService();

