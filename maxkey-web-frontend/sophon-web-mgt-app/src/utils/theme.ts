/**
 * 主题密度管理工具
 * 支持动态切换宽松、中等、紧凑三种密度
 */

export type Density = 'loose' | 'medium' | 'compact';

const DENSITY_KEY = 'theme-density';

// 主题密度配置
const densityConfig: Record<Density, Record<string, string>> = {
  loose: {
    '--page-container-padding-bottom': '20px',
    '--page-container-padding-horizontal': '24px',
    '--card-head-padding': '12px 16px',
    '--card-body-padding': '16px',
    '--card-margin-bottom': '16px',
    '--table-cell-padding': '12px 16px',
    '--table-toolbar-padding': '12px 16px',
    '--form-item-margin-bottom': '16px',
    '--form-label-padding-bottom': '6px',
    '--modal-header-padding': '12px 16px',
    '--modal-body-padding': '16px',
    '--modal-footer-padding': '8px 12px',
    '--tabs-tab-padding': '10px 14px',
    '--tabs-content-padding': '16px 0',
    '--page-header-breadcrumb-padding-top': '12px',
    '--page-header-breadcrumb-padding-bottom': '12px',
    '--page-header-breadcrumb-margin-bottom': '8px',
    '--page-header-title-margin-bottom': '8px',
  },
  medium: {
    '--page-container-padding-bottom': '16px',
    '--page-container-padding-horizontal': '24px',
    '--card-head-padding': '12px 16px',
    '--card-body-padding': '16px',
    '--card-margin-bottom': '16px',
    '--table-cell-padding': '12px 16px',
    '--table-toolbar-padding': '12px 16px',
    '--form-item-margin-bottom': '16px',
    '--form-label-padding-bottom': '6px',
    '--modal-header-padding': '12px 16px',
    '--modal-body-padding': '16px',
    '--modal-footer-padding': '8px 12px',
    '--tabs-tab-padding': '10px 14px',
    '--tabs-content-padding': '16px 0',
    '--page-header-breadcrumb-padding-top': '8px',
    '--page-header-breadcrumb-padding-bottom': '8px',
    '--page-header-breadcrumb-margin-bottom': '6px',
    '--page-header-title-margin-bottom': '6px',
  },
  compact: {
    '--page-container-padding-bottom': '8px',
    '--page-container-padding-horizontal': '8px',
    '--card-head-padding': '8px 12px',
    '--card-body-padding': '8px',
    '--card-margin-bottom': '8px',
    '--table-cell-padding': '8px 12px',
    '--table-toolbar-padding': '8px 12px',
    '--form-item-margin-bottom': '8px',
    '--form-label-padding-bottom': '4px',
    '--modal-header-padding': '8px 12px',
    '--modal-body-padding': '12px',
    '--modal-footer-padding': '8px 12px',
    '--tabs-tab-padding': '8px 12px',
    '--tabs-content-padding': '6px 0',
    '--page-header-breadcrumb-padding-top': '4px',
    '--page-header-breadcrumb-padding-bottom': '4px',
    '--page-header-breadcrumb-margin-bottom': '4px',
    '--page-header-title-margin-bottom': '4px',
  },
};

/**
 * 获取当前主题密度
 */
export function getDensity(): Density {
  if (typeof window === 'undefined') {
    return 'compact';
  }
  const saved = localStorage.getItem(DENSITY_KEY) as Density;
  return saved && ['loose', 'medium', 'compact'].includes(saved) ? saved : 'compact';
}

/**
 * 设置主题密度
 */
export function setDensity(density: Density): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.setItem(DENSITY_KEY, density);
  
  const root = document.documentElement;
  const config = densityConfig[density];
  
  // 应用CSS变量
  Object.entries(config).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  
  // 添加data属性用于CSS选择器
  root.setAttribute('data-density', density);
}

/**
 * 初始化主题
 */
export function initTheme(): void {
  const density = getDensity();
  setDensity(density);
}

