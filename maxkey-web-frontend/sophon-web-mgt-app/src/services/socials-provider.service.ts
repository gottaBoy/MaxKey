import { BaseService } from './base.service';

// 社交登录配置实体
export interface SocialsProvider {
  id?: string;
  providerName?: string;
  displayName?: string;
  [key: string]: any;
}

class SocialsProviderService extends BaseService<SocialsProvider> {
  constructor() {
    super('/maxkey-mgt-api/config/socialsprovider');
  }
}

export default new SocialsProviderService();

