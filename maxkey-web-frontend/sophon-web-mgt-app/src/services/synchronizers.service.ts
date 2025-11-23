import { BaseService } from './base.service';
import request from '@/utils/request';

// 同步器实体
export interface Synchronizer {
  id?: string;
  name?: string;
  displayName?: string;
  protocol?: string;
  [key: string]: any;
}

class SynchronizersService extends BaseService<Synchronizer> {
  constructor() {
    super('/maxkey-mgt-api/config/synchronizers');
  }

  /**
   * 同步操作
   */
  async synchr(id: string): Promise<any> {
    return request.get(`${this.baseUrl}/synchr`, { params: { id } });
  }
}

export default new SynchronizersService();

