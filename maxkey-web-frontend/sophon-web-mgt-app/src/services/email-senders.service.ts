import { BaseService } from './base.service';

// 电子邮箱配置实体
export interface EmailSenders {
  id?: string;
  [key: string]: any;
}

class EmailSendersService extends BaseService<EmailSenders> {
  constructor() {
    super('/maxkey-mgt-api/config/emailsenders');
  }
}

export default new EmailSendersService();

