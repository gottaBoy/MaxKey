/**
 * 根据应用名称生成字体图标（base64）
 * @param appName 应用名称
 * @param size 图标尺寸，默认 64
 * @returns base64 图片数据
 */
export function generateAppIcon(appName: string, size: number = 64): string {
  if (!appName) {
    appName = 'APP';
  }

  // 获取首字母或前两个字符
  const text = appName.length > 2 ? appName.substring(0, 2).toUpperCase() : appName.toUpperCase();
  
  // 根据名称生成颜色（确保相同名称总是相同颜色）
  const colors = [
    '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1',
    '#13c2c2', '#eb2f96', '#fa8c16', '#2f54eb', '#a0d911',
    '#fa541c', '#096dd9', '#389e0d', '#d4b106', '#cf1322',
    '#531dab', '#08979c', '#c41d7f', '#d46b08', '#0958d9',
  ];
  
  // 简单的哈希函数来生成颜色索引
  let hash = 0;
  for (let i = 0; i < appName.length; i++) {
    hash = appName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % colors.length;
  const backgroundColor = colors[colorIndex];
  
  // 计算文字颜色（根据背景色自动选择白色或黑色）
  const rgb = hexToRgb(backgroundColor);
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  const textColor = brightness > 128 ? '#000000' : '#ffffff';
  
  // 创建 Canvas
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    return '';
  }
  
  // 绘制背景
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, size, size);
  
  // 绘制文字
  ctx.fillStyle = textColor;
  ctx.font = `bold ${size * 0.4}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size / 2, size / 2);
  
  // 转换为 base64
  return canvas.toDataURL('image/png');
}

/**
 * 将十六进制颜色转换为 RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

/**
 * 获取应用图标 URL（优先使用 iconBase64，否则生成）
 */
export function getAppIconUrl(
  appName: string,
  iconBase64?: string,
  appId?: string
): string {
  // 如果有 iconBase64，直接使用
  if (iconBase64) {
    return iconBase64;
  }
  
  // 如果有 appId，尝试使用 API
  if (appId) {
    // 这里可以返回 API URL，但为了统一，我们也可以生成
    // return `${appsService.baseUrl}/icon/${appId}`;
  }
  
  // 否则根据应用名称生成
  return generateAppIcon(appName);
}

