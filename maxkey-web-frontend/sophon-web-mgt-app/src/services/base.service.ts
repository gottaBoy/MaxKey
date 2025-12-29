import request, { PageParams, PageResponse } from '@/utils/request';

// 基础服务类 - 对应 Angular 项目的 BaseService
export class BaseService<T> {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * 分页查询
   */
  async fetch(params: PageParams): Promise<PageResponse<T>> {
    return request.get(`${this.baseUrl}/fetch`, { params });
  }

  /**
   * 根据ID获取详情
   */
  async get(id: string): Promise<T> {
    if (!id || id === '') {
      return request.get(`${this.baseUrl}/get`);
    }
    return request.get(`${this.baseUrl}/get/${id}`);
  }

  /**
   * 加载 (部分字段)
   */
  async load(id: string): Promise<T> {
    return request.get(`${this.baseUrl}/load/${id}`);
  }

  /**
   * 新增
   */
  async add(data: Partial<T>): Promise<T> {
    return request.post(`${this.baseUrl}/add`, data);
  }

  /**
   * 更新
   */
  async update(data: Partial<T>): Promise<T> {
    return request.put(`${this.baseUrl}/update`, data);
  }

  /**
   * 删除
   */
  async delete(id: string): Promise<void> {
    return request.delete(`${this.baseUrl}/delete`, {
      params: { ids: id },
    });
  }

  /**
   * 批量删除
   */
  async batchDelete(ids: string[]): Promise<void> {
    // 将数组转换为逗号分隔的字符串，与 Angular 版本的 set2String 行为一致
    const idsString = ids.join(',');
    return request.delete(`${this.baseUrl}/delete`, {
      params: { ids: idsString },
    });
  }

  /**
   * 测试
   */
  async test(data: any): Promise<any> {
    return request.post(`${this.baseUrl}/test`, data);
  }
}

export default BaseService;
