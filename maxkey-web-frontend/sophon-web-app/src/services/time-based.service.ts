import request from '@/utils/request';
import { TimeBased } from '@/types/entity';

interface ApiResponse<T = any> {
  code: number;
  message?: string;
  data?: T;
}

class TimeBasedService {
  private baseUrl = '/sign/config/timebased';

  /**
   * 查看时间令牌信息
   */
  async view(): Promise<TimeBased> {
    // 响应拦截器已经提取了 data，所以 result 就是 TimeBased 对象
    const result = await request.get<TimeBased>(`${this.baseUrl}/view`);
    return result || {};
  }

  /**
   * 生成新的时间令牌
   */
  async generate(): Promise<TimeBased> {
    // 响应拦截器已经提取了 data，所以 result 就是 TimeBased 对象
    const result = await request.get<TimeBased>(`${this.baseUrl}/generate`);
    if (!result) {
      throw new Error('生成时间令牌失败');
    }
    return result;
  }

  /**
   * 更新时间令牌
   */
  async update(data: Partial<TimeBased>): Promise<void> {
    return request.put(`${this.baseUrl}/update`, data);
  }

  /**
   * 验证一次性密码
   */
  async verify(otpCode: string): Promise<void> {
    return request.get(`${this.baseUrl}/verify`, { params: { otpCode } });
  }
}

export default new TimeBasedService();

