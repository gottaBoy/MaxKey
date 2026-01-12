import { BaseService } from './base.service';
import request from '@/utils/request';

// 账号管理实体
export interface AccountsStrategy {
  id?: string;
  name?: string;
  displayName?: string;
  protocol?: string;
  appName?: string;
  appIconBase64?: string;
  createType?: string;
  status?: number;
  [key: string]: any;
}

class AccountsStrategyService extends BaseService<AccountsStrategy> {
  constructor() {
    super('/sophon-mgt-api/config/accountsstrategy');
  }

  /**
   * 删除账号策略
   * 后端期望参数是 ids（数组），使用查询参数传递
   * Spring 的 @RequestParam("ids") 可以接受多个同名参数（ids=1&ids=2）或逗号分隔的字符串（ids=1,2）
   */
  async delete(ids: string | string[]): Promise<void> {
    const idString = Array.isArray(ids) ? ids.join(',') : ids;
    return request.delete(`${this.baseUrl}/delete`, { params: { ids: idString } });
  }
}

export default new AccountsStrategyService();

