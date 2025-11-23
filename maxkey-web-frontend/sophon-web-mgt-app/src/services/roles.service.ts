import request from '@/utils/request';
import { BaseService } from './base.service';
import { Role } from '@/types/entity';

class RolesService extends BaseService<Role> {
  constructor() {
    super('/maxkey-mgt-api/permissions/roles');
  }

  /**
   * 刷新动态角色成员
   */
  async refreshDynamic(roleId: string): Promise<void> {
    return request.post(`${this.baseUrl}/refreshDynamic/${roleId}`, {});
  }
}

export default new RolesService();
