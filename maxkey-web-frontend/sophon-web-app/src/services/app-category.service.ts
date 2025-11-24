import { AppCategory } from '@/types/entity';

class AppCategoryService {
  /**
   * 获取应用分类列表
   */
  list(): AppCategory[] {
    return [
      { id: 'none', name: '无' },
      { id: '1011', name: '办公协作' },
      { id: '1012', name: '项目管理' },
      { id: '1013', name: '文档管理' },
      { id: '1014', name: '即时通讯' },
      { id: '1015', name: '邮件系统' },
      { id: '1016', name: '视频会议' },
      { id: '1017', name: '其他办公' },
      { id: '1111', name: '财务系统' },
      { id: '1112', name: 'ERP系统' },
      { id: '1113', name: 'CRM系统' },
      { id: '1114', name: '其他业务' },
      { id: '1211', name: '开发工具' },
      { id: '1212', name: '代码仓库' },
      { id: '1213', name: 'CI/CD' },
      { id: '1214', name: '监控运维' },
      { id: '1215', name: '其他技术' },
      { id: '1311', name: '云服务' },
      { id: '1411', name: '安全工具' },
      { id: '1511', name: '数据分析' },
      { id: '1512', name: 'BI系统' },
      { id: '1611', name: '学习平台' },
      { id: '1711', name: '人力资源' },
      { id: '1712', name: '考勤系统' },
      { id: '1811', name: '客户服务' },
      { id: '1812', name: '工单系统' },
      { id: '1911', name: '其他' },
      { id: '1912', name: '自定义' },
    ];
  }
}

export default new AppCategoryService();

