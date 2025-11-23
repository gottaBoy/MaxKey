import { BaseService } from './base.service';

// 访问日志实体
export interface AccessLog {
  id?: string;
  sessionId?: string;
  userId?: string;
  username?: string;
  displayName?: string;
  appId?: string;
  appName?: string;
  loginTime?: string;
}

class AccessLogService extends BaseService<AccessLog> {
  constructor() {
    super('/maxkey-mgt-api/historys/loginAppsHistory');
  }
}

export default new AccessLogService();

