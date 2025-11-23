import request from '@/utils/request';
import { Permission } from '@/types/entity';
import { PageParams, PageResponse } from '@/utils/request';

class PermissionsService {
  private baseUrl = '/maxkey-mgt-api/permissions';

  /**
   * 分页查询权限
   */
  async fetch(params: PageParams): Promise<PageResponse<Permission>> {
    return request.get(`${this.baseUrl}/fetch`, { params });
  }

  /**
   * 授权
   */
  async grant(data: {
    roleId: string;
    appId: string;
    resourceIds: string[];
  }): Promise<void> {
    return request.post(`${this.baseUrl}/grant`, data);
  }

  /**
   * 撤销授权
   */
  async revoke(ids: string[]): Promise<void> {
    return request.delete(`${this.baseUrl}/revoke`, { data: { ids } });
  }

  /**
   * 获取角色权限
   */
  async getByRole(roleId: string, appId?: string): Promise<Permission[]> {
    return request.get(`${this.baseUrl}/getByRole`, {
      params: { roleId, appId },
    });
  }

  /**
   * 获取用户组权限
   */
  async getByGroup(groupId: string, appId?: string): Promise<Permission[]> {
    return request.get(`${this.baseUrl}/getByParams`, {
      params: { groupId, appId },
    });
  }

  /**
   * 更新用户组权限
   */
  async updateGroupPermission(data: {
    appId: string;
    groupId: string;
    resourceId: string; // 逗号分隔的资源ID列表
  }): Promise<void> {
    return request.post(`${this.baseUrl}/permission/update`, data);
  }

  /**
   * 更新角色权限
   */
  async updateRolePermission(data: {
    appId: string;
    roleId: string;
    resourceId: string; // 逗号分隔的资源ID列表
  }): Promise<void> {
    return request.post(`${this.baseUrl}/permissionRole/update`, data);
  }

  /**
   * 获取角色权限（通过 permissionRole 服务）
   */
  async getByRolePermission(params: {
    appId: string;
    roleId: string;
  }): Promise<Permission[]> {
    return request.get(`${this.baseUrl}/permissionRole/getByParams`, { params });
  }
}

export default new PermissionsService();
