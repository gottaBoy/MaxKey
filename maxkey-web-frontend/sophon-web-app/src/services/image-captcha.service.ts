import axios from 'axios';

interface CaptchaData {
  state: string;
  image: string; // base64 encoded image
}

class ImageCaptchaService {
  private baseUrl = '/sign';

  /**
   * 获取图片验证码
   * 直接使用 axios 避免 request 拦截器对数据的处理
   */
  async getCaptcha(state?: string, captcha?: string): Promise<CaptchaData> {
    const params: any = { _allow_anonymous: true };
    if (state) {
      params.state = state;
    }
    if (captcha) {
      params.captcha = captcha;
    }
    const url = `${this.baseUrl}/captcha`;
    console.log('🚀 准备调用验证码接口:', { url, params });
    
    try {
      // 直接使用 axios 避免 request 拦截器显示错误消息
      console.log('📡 发送请求到:', url, '参数:', params);
      const response = await axios.get(url, {
        params,
        // 设置超时时间，避免长时间等待
        timeout: 10000,
      });
      console.log('📥 收到响应:', response.status, response.data);
      
      const res = response.data;
      console.log('验证码API响应:', res);
      
      // 处理MaxKey响应格式: { code: 0, data: { image: '...', state: '...' } }
      if (res.code !== undefined) {
        if (res.code === 0 && res.data) {
          console.log('验证码数据:', res.data);
          return {
            state: res.data.state || state || '',
            image: res.data.image || '',
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
          state: res.state || state || '',
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

  /**
   * 获取图片验证码URL（兼容旧方法）
   */
  getImageCaptchaUrl(state?: string): string {
    let url = `${this.baseUrl}/imageCaptcha?_allow_anonymous=true&_t=${Date.now()}`;
    if (state) {
      url += `&state=${encodeURIComponent(state)}`;
    }
    return url;
  }
}

export default new ImageCaptchaService();

