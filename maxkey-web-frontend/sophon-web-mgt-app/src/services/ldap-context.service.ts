import { BaseService } from './base.service';
import request from '@/utils/request';

// LDAP配置实体
export interface LdapContext {
  id?: string;
  [key: string]: any;
}

class LdapContextService extends BaseService<LdapContext> {
  constructor() {
    super('/maxkey-mgt-api/config/ldapcontext');
  }

  /**
   * 测试LDAP连接
   */
  async test(data: Partial<LdapContext>): Promise<any> {
    return request.post(`${this.baseUrl}/test`, data);
  }
}

export default new LdapContextService();

