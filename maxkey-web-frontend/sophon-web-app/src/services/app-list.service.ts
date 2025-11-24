import request from '@/utils/request';
import { Application } from '@/types/entity';

class AppListService {
  private baseUrl = '/sign/appList';

  /**
   * 获取应用列表
   */
  async appList(): Promise<Application[]> {
    const result = await request.get<Application[]>(this.baseUrl);
    return Array.isArray(result) ? result : [];
  }
}

export default new AppListService();

