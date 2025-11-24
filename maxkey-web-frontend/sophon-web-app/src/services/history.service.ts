import request from '@/utils/request';
import { LoginHistory, AccessLog } from '@/types/entity';

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

interface PageResponse<T> {
  records: number;
  rows: T[];
}

class HistoryService {
  private baseUrl = '/sign/historys';

  /**
   * 获取登录日志
   */
  async fetchLoginHistory(params: PageParams): Promise<PageResponse<LoginHistory>> {
    const result = await request.get<PageResponse<LoginHistory>>(`${this.baseUrl}/loginHistory/fetch`, { params });
    return result || { records: 0, rows: [] };
  }

  /**
   * 获取应用登录日志
   */
  async fetchLoginAppsHistory(params: PageParams): Promise<PageResponse<AccessLog>> {
    const result = await request.get<PageResponse<AccessLog>>(`${this.baseUrl}/loginAppsHistory/fetch`, { params });
    return result || { records: 0, rows: [] };
  }
}

export default new HistoryService();

