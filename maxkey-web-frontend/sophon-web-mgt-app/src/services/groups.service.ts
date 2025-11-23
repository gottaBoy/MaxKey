import request from '@/utils/request';
import { BaseService } from './base.service';
import { Group } from '@/types/entity';

class GroupsService extends BaseService<Group> {
  constructor() {
    super('/maxkey-mgt-api/access/groups');
  }

  /**
   * 刷新动态组成员
   */
  async refreshDynamic(groupId: string): Promise<void> {
    return request.post(`${this.baseUrl}/refreshDynamic/${groupId}`, {});
  }
}

export default new GroupsService();
