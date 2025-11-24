import request from '@/utils/request';
import { User } from '@/types/entity';

class UsersService {
  private baseUrl = '/sign/users';

  /**
   * 获取当前用户资料
   */
  async getProfile(): Promise<User> {
    return request.get<User>(`${this.baseUrl}/profile/get`);
  }

  /**
   * 更新当前用户资料
   */
  async updateProfile(data: Partial<User>): Promise<void> {
    return request.put(`${this.baseUrl}/profile/update`, data);
  }

  /**
   * 更新认证类型
   */
  async updateAuthnType(data: Partial<User>): Promise<void> {
    return request.put(`${this.baseUrl}/profile/updateAuthnType`, data);
  }
}

export default new UsersService();
