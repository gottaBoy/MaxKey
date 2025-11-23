import request from '@/utils/request';
import { GroupMember } from '@/types/entity';
import { PageParams, PageResponse } from '@/utils/request';

class GroupMembersService {
  private baseUrl = '/maxkey-mgt-api/access/groupmembers';

  /**
   * 分页查询组成员（已加入组的成员）
   */
  async fetch(params: PageParams): Promise<PageResponse<GroupMember>> {
    return request.get(`${this.baseUrl}/fetch`, { params });
  }

  /**
   * 查询组成员（memberIn接口）
   */
  async member(params: any): Promise<PageResponse<GroupMember>> {
    return request.get(`${this.baseUrl}/memberIn`, { params });
  }

  /**
   * 查询未加入组的成员（memberNotIn接口）
   */
  async memberOut(params: any): Promise<PageResponse<GroupMember>> {
    return request.get(`${this.baseUrl}/memberNotIn`, { params });
  }

  /**
   * 添加成员
   */
  async add(data: { type?: string; groupId: string; memberId?: string; memberName?: string }): Promise<void> {
    return request.post(`${this.baseUrl}/add`, data);
  }

  /**
   * 移除成员
   */
  async delete(ids: string | string[]): Promise<void> {
    const idString = Array.isArray(ids) ? ids.join(',') : ids;
    return request.delete(`${this.baseUrl}/delete`, { params: { ids: idString } });
  }
}

export default new GroupMembersService();
