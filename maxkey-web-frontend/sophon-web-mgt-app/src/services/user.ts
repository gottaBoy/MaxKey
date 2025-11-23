import request from '@/utils/request';
import { BaseService } from './base.service';
import { UserInfo } from '@/types/entity';

class UsersService extends BaseService<UserInfo> {
  constructor() {
    super('/maxkey-mgt-api/users');
  }

  /**
   * 生成随机密码
   */
  async generatePassword(params?: any): Promise<string> {
    return request.get(`${this.baseUrl}/randomPassword`, { params });
  }

  /**
   * 根据用户名获取用户
   */
  async getByUsername(username: string): Promise<UserInfo> {
    return request.get(`${this.baseUrl}/getByUsername/${username}`);
  }

  /**
   * 更新用户状态
   */
  async updateStatus(params: { id: string; status: number }): Promise<UserInfo> {
    return request.get(`${this.baseUrl}/updateStatus`, { params });
  }

  /**
   * 重置密码
   */
  async resetPassword(data: { id: string; password: string }): Promise<UserInfo> {
    return request.post(`${this.baseUrl}/resetPassword`, data);
  }

  /**
   * 修改密码
   */
  async changePassword(data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<void> {
    return request.post(`${this.baseUrl}/changePassword`, data);
  }

  /**
   * 导出用户
   */
  async export(params: any): Promise<Blob> {
    return request.get(`${this.baseUrl}/export`, {
      params,
      responseType: 'blob',
    });
  }

  /**
   * 导入用户
   */
  async import(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    return request.post(`${this.baseUrl}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * 批量删除用户（MaxKey 格式：逗号分隔的 ID 字符串）
   */
  async batchDelete(ids: string[]): Promise<void> {
    // MaxKey 使用逗号分隔的字符串，最后会有一个逗号（set2String 的实现）
    let idsString = '';
    ids.forEach(id => {
      idsString = `${idsString}${id},`;
    });
    return request.delete(`${this.baseUrl}/delete?ids=${idsString}`);
  }

  /**
   * 更新认证方式（MFA）
   */
  async updateAuthnType(data: { id: string; authnType: string }): Promise<UserInfo> {
    return request.put(`${this.baseUrl}/updateAuthnType`, data);
  }
}

export default new UsersService();
