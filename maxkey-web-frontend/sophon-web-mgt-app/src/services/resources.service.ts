import request from '@/utils/request';
import { BaseService } from './base.service';
import { Resource, TreeNode } from '@/types/entity';

class ResourcesService extends BaseService<Resource> {
  constructor() {
    super('/maxkey-mgt-api/permissions/resources');
  }

  /**
   * 获取资源树
   */
  async tree(params?: { appId?: string; appName?: string }): Promise<TreeNode[]> {
    return request.get(`${this.baseUrl}/tree`, { params });
  }
}

export default new ResourcesService();
