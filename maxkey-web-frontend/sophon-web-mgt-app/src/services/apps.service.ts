import request from '@/utils/request';
import { BaseService } from './base.service';
import { Application } from '@/types/entity';

class AppsService extends BaseService<Application> {
  constructor() {
    super('/maxkey-mgt-api/apps');
  }

  /**
   * 根据协议类型查询
   */
  async fetchByProtocol(protocol: string, params: any): Promise<Application[]> {
    return request.get(`${this.baseUrl}/fetch`, {
      params: { ...params, protocol },
    });
  }

  /**
   * 获取应用图标
   */
  getIconUrl(appId: string): string {
    return `${this.baseUrl}/icon/${appId}`;
  }
}

export default new AppsService();
