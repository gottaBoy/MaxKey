import { BaseService } from './base.service';

// 短信服务配置实体
export interface SmsProvider {
  id?: string;
  [key: string]: any;
}

class SmsProviderService extends BaseService<SmsProvider> {
  constructor() {
    super('/maxkey-mgt-api/config/smsprovider');
  }
}

export default new SmsProviderService();

