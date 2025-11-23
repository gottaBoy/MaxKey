import { BaseService } from './base.service';

// 登录日志实体
export interface LoginHistory {
  id?: string;
  sessionId?: string;
  username?: string;
  displayName?: string;
  message?: string;
  loginType?: string;
  sourceIp?: string;
  location?: string;
  browser?: string;
  platform?: string;
  loginTime?: string;
  logoutTime?: string;
}

class LoginHistoryService extends BaseService<LoginHistory> {
  constructor() {
    super('/maxkey-mgt-api/historys/loginHistory');
  }
}

export default new LoginHistoryService();
