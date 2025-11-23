import { BaseService } from './base.service';

// 密码策略实体
export interface PasswordPolicy {
  id?: string;
  [key: string]: any;
}

class PasswordPolicyService extends BaseService<PasswordPolicy> {
  constructor() {
    super('/maxkey-mgt-api/config/passwordpolicy');
  }
}

export default new PasswordPolicyService();

