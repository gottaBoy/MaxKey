import { BaseService } from './base.service';

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
    super('/maxkey-mgt-api/config/institutions');
  }
}

export default new InstitutionsService();

