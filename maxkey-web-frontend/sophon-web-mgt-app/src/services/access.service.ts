import request from '@/utils/request';
import { PageResponse } from '@/utils/request';
import type { Application } from '@/types/entity';

class AccessService {
  private baseUrl = '/sophon-mgt-api/access/access';

  /**
   * 查询用户组可以访问的应用列表（appsInGroup接口）
   */
  async member(params: any): Promise<PageResponse<Application>> {
    return request.get(`${this.baseUrl}/appsInGroup`, { params });
  }

  /**
   * 查询用户组不能访问的应用列表（appsNotInGroup接口，用于添加）
   */
  async memberOut(params: any): Promise<PageResponse<Application>> {
    return request.get(`${this.baseUrl}/appsNotInGroup`, { params });
  }

  /**
   * 为用户组添加应用访问权限
   */
  async add(data: { groupId: string; appId: string; appName: string }): Promise<void> {
    return request.post(`${this.baseUrl}/add`, data);
  }

  /**
   * 删除应用访问权限
   */
  async delete(id: string | string[]): Promise<void> {
    const idString = Array.isArray(id) ? id.join(',') : id;
    return request.delete(`${this.baseUrl}/delete`, { params: { ids: idString } });
  }
}

export default new AccessService();

