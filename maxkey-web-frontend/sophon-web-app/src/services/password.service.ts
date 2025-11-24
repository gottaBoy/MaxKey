import request from '@/utils/request';
import { PasswordPolicy, ChangePassword } from '@/types/entity';

interface ApiResponse<T = any> {
  code: number;
  message?: string;
  data?: T;
}

class PasswordService {
  private baseUrl = '/sign';

  /**
   * 获取密码策略
   */
  async passwordpolicy(): Promise<PasswordPolicy> {
    // 响应拦截器已经提取了 data，所以 result 就是 PasswordPolicy 对象
    const result = await request.get<PasswordPolicy>(`${this.baseUrl}/config/passwordpolicy/get`);
    return result || {};
  }

  /**
   * 修改密码
   */
  async changePassword(data: ChangePassword): Promise<void> {
    return request.put(`${this.baseUrl}/password/change`, data);
  }
}

export default new PasswordService();

