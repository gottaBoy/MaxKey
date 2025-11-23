import request from '@/utils/request';
import { OnlineSession } from '@/types/entity';
import { PageParams, PageResponse } from '@/utils/request';

class OnlineSessionsService {
  private baseUrl = '/maxkey-mgt-api/access/session';

  /**
   * 分页查询在线会话
   */
  async fetch(params: PageParams): Promise<PageResponse<OnlineSession>> {
    return request.get(`${this.baseUrl}/fetch`, { params });
  }

  /**
   * 强制下线（单个或多个，ids 为逗号分隔的字符串）
   */
  async terminate(ids: string): Promise<void> {
    return request.post(`${this.baseUrl}/terminate`, null, {
      params: { ids },
    });
  }
}

export default new OnlineSessionsService();
