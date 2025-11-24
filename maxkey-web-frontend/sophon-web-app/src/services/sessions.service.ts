import request from '@/utils/request';
import { OnlineSession } from '@/types/entity';

interface PageParams {
  username?: string;
  displayName?: string;
  employeeNumber?: string;
  startDate?: string;
  endDate?: string;
  startDatePicker?: number;
  endDatePicker?: number;
  pageSize?: number;
  pageNumber?: number;
  pageSizeOptions?: number[];
}

interface PageResponse {
  records: number;
  rows: OnlineSession[];
}

class SessionsService {
  private baseUrl = '/sign/access/session';

  /**
   * 分页查询在线会话
   */
  async fetch(params: PageParams): Promise<PageResponse> {
    const result = await request.get<PageResponse>(`${this.baseUrl}/fetch`, { params });
    return result || { records: 0, rows: [] };
  }

  /**
   * 强制下线（ids 为逗号分隔的字符串）
   */
  async terminate(ids: string): Promise<void> {
    return request.post(`${this.baseUrl}/terminate`, null, {
      params: { ids },
    });
  }
}

export default new SessionsService();

