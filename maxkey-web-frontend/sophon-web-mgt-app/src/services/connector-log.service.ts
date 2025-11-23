import { BaseService } from './base.service';

// 连接器日志实体
export interface ConnectorLog {
  id?: string;
  conName?: string;
  topic?: string;
  actionType?: string;
  sourceId?: string;
  sourceName?: string;
  syncTime?: string;
  result?: string;
}

class ConnectorLogService extends BaseService<ConnectorLog> {
  constructor() {
    super('/maxkey-mgt-api/historys/connectorHistory');
  }
}

export default new ConnectorLogService();

