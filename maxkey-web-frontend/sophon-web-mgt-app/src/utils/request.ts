import axios, { AxiosResponse, AxiosError } from 'axios';
import { message } from 'antd';

// 自定义参数序列化器，与 Angular HttpParams 行为一致
const paramsSerializer = (params: any): string => {
  const parts: string[] = [];
  
  Object.keys(params).forEach((key) => {
    const value = params[key];
    
    // 忽略 null、undefined 和空字符串
    if (value === null || value === undefined || value === '') {
      return;
    }
    
    // 处理数组：生成多个同名参数（与 Angular HttpParams 一致）
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined && item !== '') {
          parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`);
        }
      });
    } else if (value instanceof Date) {
      // 处理日期：转换为时间戳（秒）
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(Math.floor(value.getTime() / 1000))}`);
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  });
  
  return parts.join('&');
};

// 创建axios实例
const request = axios.create({
//   baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: {
    serialize: paramsSerializer,
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  },
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;

    // MaxKey的响应格式: { code: 0, message: '...', data: {...} }
    // code为0表示成功
    if (res.code !== undefined && res.code !== 0) {
      // 创建错误对象，包含完整的响应信息
      const error = new Error(res.message || '请求失败') as any;
      error.response = {
        ...response,
        data: res,
      };
      message.error(res.message || '请求失败');
      return Promise.reject(error);
    }

    // 返回data部分，如果 data 是 null，也返回 null（某些 API 可能返回 null）
    if (res.data !== undefined) {
      return res.data;
    }
    
    // 如果没有 data 字段，直接返回 res（可能是直接返回的数据结构）
    return res;
  },
  (error: AxiosError) => {
    console.error('Response error:', error);

    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        message.error('登录已过期，请重新登录');
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        window.location.href = '/user/login';
      } else if (status === 403) {
        message.error('没有权限访问');
      } else if (status === 404) {
        message.error('请求的资源不存在');
      } else if (status >= 500) {
        message.error('服务器错误，请稍后重试');
      } else {
        const errorData = error.response.data as any;
        message.error(errorData?.message || '请求失败');
      }
    } else if (error.request) {
      message.error('网络错误，请检查网络连接');
    } else {
      message.error('请求配置错误');
    }

    return Promise.reject(error);
  },
);

export default request;

// 通用响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 分页响应类型
export interface PageResponse<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 分页查询参数
export interface PageParams {
  current?: number;
  pageSize?: number;
  [key: string]: any;
}
