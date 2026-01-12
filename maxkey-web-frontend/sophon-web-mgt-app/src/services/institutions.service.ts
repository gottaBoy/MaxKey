import { BaseService } from './base.service';
import request from '@/utils/request';

// 机构配置实体
export interface Institution {
  id?: string;
  name?: string;
  fullName?: string;
  logo?: string;
  defaultUri?: string;
  domain?: string;
  frontTitle?: string;
  consoleDomain?: string;
  consoleTitle?: string;
  contact?: string;
  phone?: string;
  email?: string;
  address?: string;
  [key: string]: any;
}

class InstitutionsService extends BaseService<Institution> {
  constructor() {
    super('/sophon-mgt-api/config/institutions');
  }

  /**
   * 切换租户
   */
  async switchTenant(instId: string): Promise<any> {
    return request.get(`${this.baseUrl}/switch/${instId}`);
  }
}

export default new InstitutionsService();

