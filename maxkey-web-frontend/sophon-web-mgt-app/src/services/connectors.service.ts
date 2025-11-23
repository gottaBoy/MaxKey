import { BaseService } from './base.service';

// 连接器实体
export interface Connector {
  id?: string;
  connName?: string;
  displayName?: string;
  protocol?: string;
  [key: string]: any;
}

class ConnectorsService extends BaseService<Connector> {
  constructor() {
    super('/maxkey-mgt-api/config/connectors');
  }
}

export default new ConnectorsService();

