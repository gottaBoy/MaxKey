import request from '@/utils/request';
import { PasskeyInfo } from '@/types/entity';

interface ApiResponse<T = any> {
  code: number;
  message?: string;
  data?: T;
}

class PasskeyService {
  private baseUrl = '/sign/passkey';

  /**
   * 获取用户 Passkey 列表
   */
  async list(userId: string): Promise<PasskeyInfo[]> {
    // 响应拦截器已经提取了 data，所以 result 就是 PasskeyInfo[] 数组
    const result = await request.get<PasskeyInfo[]>(`${this.baseUrl}/registration/list/${userId}`);
    return Array.isArray(result) ? result : [];
  }

  /**
   * 开始注册 Passkey
   */
  async begin(userId: string, username: string, displayName: string): Promise<any> {
    return request.post<ApiResponse>(`${this.baseUrl}/registration/begin`, {
      userId,
      username,
      displayName,
    });
  }

  /**
   * 完成注册 Passkey
   */
  async finish(data: {
    userId: string;
    challengeId: string;
    credentialId: string;
    attestationObject: string;
    clientDataJSON: string;
  }): Promise<PasskeyInfo> {
    // 响应拦截器已经提取了 data，所以 result 就是 PasskeyInfo 对象
    const result = await request.post<PasskeyInfo>(`${this.baseUrl}/registration/finish`, data);
    if (!result) {
      throw new Error('Passkey注册失败');
    }
    return result;
  }

  /**
   * 删除 Passkey
   */
  async delete(userId: string, credentialId: string): Promise<void> {
    return request.delete(`${this.baseUrl}/registration/delete/${userId}/${credentialId}`);
  }
}

export default new PasskeyService();

