import { BaseService } from './base.service';

// 系统日志实体
export interface SystemLog {
  id?: string;
  topic?: string;
  message?: string;
  messageAction?: string;
  messageResult?: string;
  displayName?: string;
  executeTime?: string;
}

class SystemLogService extends BaseService<SystemLog> {
  constructor() {
    super('/maxkey-mgt-api/historys/systemLogs');
  }
}

export default new SystemLogService();

