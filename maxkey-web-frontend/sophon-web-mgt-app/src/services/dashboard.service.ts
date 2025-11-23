import request from '@/utils/request';

// 后端返回的完整 Dashboard 数据结构（根据DashboardController）
export interface DashboardData {
  dayCount: number;                                          // 当日访问数
  newUsers: number;                                          // 当月新增用户
  onlineUsers: number;                                       // 在线用户数
  activeUsers: number;                                       // 活跃用户数
  totalUsers: number;                                        // 总用户数
  totalDepts: number;                                        // 总部门数
  totalApps: number;                                         // 总应用数
  reportMonth: Array<{ reportstring: string; reportcount: number }>;      // 月度报表
  reportDayHour: Array<{ reportstring: string; reportcount: number }>;    // 当日小时报表
  reportProvince: Array<{ reportstring: string; reportcount: number; name: string }>;  // 省份报表
  reportCountry: Array<{ reportstring: string; reportcount: number }>;    // 国家报表
  reportBrowser: Array<{ reportstring: string; reportcount: number }>;    // 浏览器报表
  reportApp: Array<{ appname: string; reportcount: number }>;             // 应用报表
}

// 前端使用的统计数据
export interface DashboardStats {
  totalUsers: number;
  totalGroups: number;
  totalApps: number;
  onlineSessions: number;
  todayVisits: number;
  todayVisitsGrowth: number;
  activeUsers30d: number;
  activeUsersGrowth: number;
}

export interface VisitTrendData {
  date: string;
  visits: number;
}

export interface TopUserData {
  username: string;
  displayName: string;
  loginCount: number;
}

export interface TopAppData {
  appId: string;
  appName: string;
  accessCount: number;
}

export interface BrowserStatData {
  browser: string;
  count: number;
}

class DashboardService {
  private baseUrl = '/maxkey-mgt-api';

  // 获取完整的 Dashboard 数据
  async getDashboard(): Promise<DashboardData> {
    return request.get(`${this.baseUrl}/dashboard`);
  }

  // 获取基础统计数据（从 Dashboard 数据转换）
  async getStats(): Promise<DashboardStats> {
    const data = await this.getDashboard();
    return {
      totalUsers: data.totalUsers || 0,
      totalGroups: data.totalDepts || 0,
      totalApps: data.totalApps || 0,
      onlineSessions: data.onlineUsers || 0,
      todayVisits: data.dayCount || 0,
      todayVisitsGrowth: 0, // 后端暂无此数据
      activeUsers30d: data.activeUsers || 0,
      activeUsersGrowth: 0, // 后端暂无此数据
    };
  }

  // 获取访问趋势（从月度报表转换）
  async getVisitTrend(_days: number = 30): Promise<VisitTrendData[]> {
    const data = await this.getDashboard();
    if (!data.reportMonth) return [];
    
    return data.reportMonth.map(item => ({
      date: item.reportstring,
      visits: item.reportcount,
    }));
  }

  // 获取当日小时访问数据
  async getDayHourVisits(): Promise<Array<{ hour: string; visits: number }>> {
    const data = await this.getDashboard();
    if (!data.reportDayHour) return [];
    
    return data.reportDayHour.map(item => ({
      hour: item.reportstring,
      visits: item.reportcount,
    }));
  }

  // 获取省份访问统计
  async getProvinceStats(): Promise<Array<{ reportstring: string; reportcount: number; name: string }>> {
    const data = await this.getDashboard();
    return data.reportProvince || [];
  }

  // 获取国家访问统计
  async getCountryStats(): Promise<Array<{ reportstring: string; reportcount: number }>> {
    const data = await this.getDashboard();
    return data.reportCountry || [];
  }

  // 获取TOP用户访问统计（暂无数据，返回空）
  async getTopUsers(_limit: number = 10): Promise<TopUserData[]> {
    return [];
  }

  // 获取TOP应用访问统计
  async getTopApps(limit: number = 10): Promise<TopAppData[]> {
    const data = await this.getDashboard();
    if (!data.reportApp) return [];
    
    return data.reportApp.slice(0, limit).map(item => ({
      appId: item.appname,
      appName: item.appname,
      accessCount: item.reportcount,
    }));
  }

  // 获取浏览器访问统计
  async getBrowserStats(limit: number = 10): Promise<BrowserStatData[]> {
    const data = await this.getDashboard();
    if (!data.reportBrowser) return [];
    
    return data.reportBrowser.slice(0, limit).map(item => ({
      browser: item.reportstring,
      count: item.reportcount,
    }));
  }
}

export default new DashboardService();
