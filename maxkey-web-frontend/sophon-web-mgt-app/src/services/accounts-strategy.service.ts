import { BaseService } from './base.service';

// 账号管理实体
export interface AccountsStrategy {
  id?: string;
  name?: string;
  displayName?: string;
  protocol?: string;
  [key: string]: any;
}

class AccountsStrategyService extends BaseService<AccountsStrategy> {
  constructor() {
    super('/maxkey-mgt-api/config/accountsstrategy');
  }
}

export default new AccountsStrategyService();

