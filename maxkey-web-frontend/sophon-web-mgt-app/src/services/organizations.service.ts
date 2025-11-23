import request from '@/utils/request';
import { BaseService } from './base.service';
import { Organization, TreeNode } from '@/types/entity';

class OrganizationsService extends BaseService<Organization> {
  constructor() {
    super('/maxkey-mgt-api');
  }

  /**
   * 获取组织列表（分页）
   */
  async fetch(params?: any) {
    return request.get(`${this.baseUrl}/orgs/fetch`, { params });
  }

  /**
   * 获取组织列表
   */
  async fetchList() {
    return request.get(`${this.baseUrl}/orgs/fetch`);
  }

  /**
   * 获取组织树
   */
  async tree(params?: any) {
    return request.get(`${this.baseUrl}/orgs/tree`, { params });
  }

  /**
   * 根据上级ID获取子组织
   */
  async getByParentId(parentId: string): Promise<Organization[]> {
    return request.get(`${this.baseUrl}/orgs/get/${parentId}`);
  }

  /**
   * 新增组织
   */
  async addOrg(data) {
    return request.post(`${this.baseUrl}/orgs/add`, data);
  }

  /**
   * 编辑组织
   */
  async editOrg(data) {
    return request.post(`${this.baseUrl}/orgs/edit`, data);
  }

  /**
   * 删除组织
   */
  async removeOrg(id) {
    return request.post(`${this.baseUrl}/orgs/delete`, { id });
  }

  /**
   * 批量删除组织
   */
  async batchDeleteOrg(ids) {
    return request.post(`${this.baseUrl}/orgs/batchDelete`, { ids });
  }
}

export default new OrganizationsService();
