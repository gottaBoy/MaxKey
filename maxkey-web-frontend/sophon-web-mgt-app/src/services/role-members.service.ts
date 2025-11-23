import request from '@/utils/request';
import { RoleMember } from '@/types/entity';
import { PageParams, PageResponse } from '@/utils/request';

class RoleMembersService {
  private baseUrl = '/maxkey-mgt-api/roleMember';

  /**
   * 分页查询角色成员
   */
  async fetch(params: PageParams): Promise<PageResponse<RoleMember>> {
    return request.get(`${this.baseUrl}/fetch`, { params });
  }

  /**
   * 添加成员
   */
  async add(data: { roleId: string; userIds: string[] }): Promise<void> {
    return request.post(`${this.baseUrl}/add`, data);
  }

  /**
   * 移除成员
   */
  async delete(ids: string[]): Promise<void> {
    return request.delete(`${this.baseUrl}/delete`, { data: { ids } });
  }

  /**
   * 查询角色成员（memberIn接口）
   */
  async member(params: any): Promise<PageResponse<RoleMember>> {
    return request.get(`${this.baseUrl}/memberInRole`, { params });
  }

  /**
   * 查询未加入角色的成员（memberNotIn接口）
   */
  async memberOut(params: any): Promise<PageResponse<RoleMember>> {
    return request.get(`${this.baseUrl}/memberNotInRole`, { params });
  }

  /**
   * 查询用户未加入的角色
   */
  async rolesNoMember(params: any): Promise<PageResponse<any>> {
    return request.get(`${this.baseUrl}/rolesNoMember`, { params });
  }

  /**
   * 添加成员到角色
   */
  async addMember2Roles(data: { username: string; roleId: string; roleName: string }): Promise<void> {
    return request.post(`${this.baseUrl}/addMember2Roles`, data);
  }
}

export default new RoleMembersService();
