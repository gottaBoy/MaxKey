import request from '@/utils/request';
import { BaseService } from './base.service';
import { Organization, TreeNode } from '@/types/entity';

class OrganizationsService extends BaseService<Organization> {
  constructor() {
    super('/sophon-mgt-api');
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
    return request.post(`${this.baseUrl}/orgs/update`, data);
  }

  /**
   * 删除组织
   * 后端期望参数是 ids（数组），使用查询参数传递
   * Spring 的 @RequestParam("ids") 可以接受多个同名参数（ids=1&ids=2）或逗号分隔的字符串（ids=1,2）
   * 参考 Angular 版本和 group-members.service.ts，使用逗号分隔的字符串格式
   */
  async removeOrg(id: string) {
    return request.post(`${this.baseUrl}/orgs/delete`, null, {
      params: { ids: id },
    });
  }

  /**
   * 批量删除组织
   * 后端期望参数是 ids（数组），使用查询参数传递
   * Spring 的 @RequestParam("ids") 可以接受多个同名参数（ids=1&ids=2）或逗号分隔的字符串（ids=1,2）
   * 参考 Angular 版本，使用逗号分隔的字符串格式
   */
  async batchDeleteOrg(ids: string[]) {
    // 将数组转换为逗号分隔的字符串（去掉最后的逗号）
    const idsString = ids.join(',');
    return request.post(`${this.baseUrl}/orgs/delete`, null, {
      params: { ids: idsString },
    });
  }
}

export default new OrganizationsService();
