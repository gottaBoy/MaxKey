import { BaseService } from './base.service';

// 同步器日志实体
export interface SynchronizerLog {
  id?: string;
  syncId?: string;
  syncName?: string;
  objectId?: string;
  objectType?: string;
  objectName?: string;
  syncTime?: string;
  result?: string;
}

class SynchronizerLogService extends BaseService<SynchronizerLog> {
  constructor() {
    super('/maxkey-mgt-api/historys/synchronizerHistory');
  }
}

export default new SynchronizerLogService();

