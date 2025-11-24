import request from '@/utils/request';
import { SocialsAssociate } from '@/types/entity';

interface PageParams {
  providerName?: string;
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
  rows: SocialsAssociate[];
}

class SocialsAssociateService {
  private baseUrl = '/sign/config/socialsignon';

  /**
   * 获取社交关联列表
   */
  async fetch(params: PageParams): Promise<PageResponse> {
    const result = await request.get<PageResponse>(`${this.baseUrl}/fetch`, { params });
    return result || { records: 0, rows: [] };
  }

  /**
   * 绑定社交账号
   */
  async bind(provider: string): Promise<void> {
    // 跳转到社交登录页面
    window.location.href = `/sign/socials/${provider}/bind`;
  }

  /**
   * 解绑社交账号
   */
  async unbind(id: string): Promise<void> {
    return request.delete(`${this.baseUrl}/delete?ids=${id}`);
  }
}

export default new SocialsAssociateService();

