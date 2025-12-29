import BaseService from './base.service';
import type { Accounts } from '@/types/entity';
import request from '@/utils/request';

class AccountsService extends BaseService<Accounts> {
  constructor() {
    super('/maxkey-mgt-api/accounts');
  }

  /**
   * 生成账号
   */
  async generate(params: { strategyId?: string; userId?: string }): Promise<string> {
    return request.get(`${this.baseUrl}/generate`, { params });
  }

  /**
   * 更新状态
   */
  async updateStatus(params: { id: string; status: number }): Promise<void> {
    return request.get(`${this.baseUrl}/updateStatus`, { params });
  }
}

export default new AccountsService();

