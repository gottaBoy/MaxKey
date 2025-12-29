# ZeronEdge - React 管理控制台

基于 MaxKey 的现代化 IAM 管理控制台，采用 React + TypeScript + Ant Design Pro 构建，100% 复刻 MaxKey Angular 版本功能。

## ✨ 特性

- 🎨 **现代化 UI** - Ant Design 5 + Ant Design Pro Components
- 🚀 **高性能** - Vite 5 构建，代码分割，懒加载
- 🔒 **类型安全** - TypeScript 5 严格模式
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🎯 **功能完整** - 100% 兼容 MaxKey 后端 API

## 📦 技术栈

- **React 18.2** + **TypeScript 5.3** + **Vite 5.0**
- **Ant Design 5.12** + **Ant Design Pro Components 2.6**
- **React Router 6.21** + **Axios 1.6** + **Less 4.2**

## 🚀 快速开始

### 环境要求
- Node.js >= 18
- npm >= 9

### 启动后端服务
```powershell
cd C:\d\flutter_ws\sophon-sso\MaxKey\docker
docker-compose up -d
```

**服务端口**:
- MaxKey 管理服务: http://localhost:9526
- MaxKey 认证服务: http://localhost:9527

### 启动前端
```bash
cd sophon-web-mgt-app
npm install          # 首次运行
npm run dev          # 开发模式
```

访问: http://localhost:8526

**默认登录**: admin / maxkey

### 构建生产版本
```bash
npm run build        # 构建
npm run preview      # 预览
```

## 📁 项目结构

```
sophon-web-mgt-app/
├── src/
│   ├── pages/              # 页面组件
│   │   ├── user/           # 用户管理
│   │   ├── organization/    # 组织管理
│   │   ├── group/          # 用户组管理
│   │   ├── application/    # 应用管理
│   │   ├── role/           # 角色管理
│   │   ├── permissions/    # 权限管理
│   │   ├── session/        # 在线会话
│   │   ├── audit/          # 审计日志
│   │   ├── config/         # 系统配置
│   │   └── Dashboard.tsx   # 仪表板
│   ├── services/           # API 服务层
│   │   ├── base.service.ts # 基础服务类
│   │   ├── user.ts
│   │   ├── organizations.service.ts
│   │   ├── groups.service.ts
│   │   ├── apps.service.ts
│   │   ├── roles.service.ts
│   │   ├── resources.service.ts
│   │   ├── permissions.service.ts
│   │   ├── sessions.service.ts
│   │   └── ...
│   ├── types/              # TypeScript 类型
│   │   └── entity.ts
│   ├── layouts/            # 布局组件
│   │   ├── BasicLayout.tsx
│   │   └── UserLayout.tsx
│   ├── utils/              # 工具函数
│   │   └── request.ts      # Axios 封装
│   └── App.tsx              # 根组件
├── package.json
└── vite.config.ts
```

## 🎯 核心功能

### 1. 身份管理 (IDM)
- ✅ **用户管理** - 用户列表、新增、编辑、删除、密码管理、批量操作
- ✅ **组织管理** - 树形组织结构、层级管理、CRUD 操作
- ✅ **用户组管理** - 静态组、动态组、成员管理（Transfer 穿梭框）

### 2. 应用管理
- ✅ **应用列表** - 多协议支持（OAuth 2.0, SAML 2.0, CAS, JWT, Form Based, Token Based）
- ✅ **协议配置** - 各协议详细参数配置
- ✅ **应用状态** - 启用/停用管理、图标展示

### 3. 权限管理
- ✅ **角色管理** - 角色 CRUD、成员分配、动态角色刷新
- ✅ **资源管理** - 资源树形结构、CRUD 操作
- ✅ **权限分配** - 用户组-资源权限矩阵、权限授予/撤销

### 4. 访问控制
- ✅ **在线会话** - 实时会话监控、单个/批量强制下线

### 5. 审计日志
- ✅ **登录日志** - 登录记录查询、审计追踪
- ✅ **访问日志** - 应用访问记录
- ✅ **同步器日志** - 同步器执行记录
- ✅ **连接器日志** - 连接器执行记录
- ✅ **系统日志** - 系统操作日志

### 6. 系统配置
- ✅ **机构配置** - 基本信息管理
- ✅ **密码策略** - 复杂度、有效期设置
- ✅ **LDAP配置** - LDAP 连接配置、测试连接
- ✅ **电子邮箱** - SMTP 配置
- ✅ **短信服务** - 短信服务商配置
- ✅ **账号管理** - 账号策略管理
- ✅ **同步器管理** - 同步器配置
- ✅ **连接器管理** - 连接器配置
- ✅ **社交登录** - 社交登录服务商配置

## 🔌 API 配置

### 后端服务
- **MaxKey 管理服务**: http://localhost:9526
- **MaxKey 认证服务**: http://localhost:9527

### 代理配置 (vite.config.ts)
```typescript
proxy: {
  '/maxkey-mgt-api': {
    target: 'http://localhost:9526',
    changeOrigin: true,
  },
}
```

### API 响应格式
```typescript
{
  "code": 0,          // 0 表示成功
  "message": "成功",
  "data": {           // 实际数据
    "rows": [...],    // 数据列表
    "records": 100    // 总记录数
  }
}
```

## 🎨 Ant Design Pro 组件

### 布局组件
- `PageContainer` - 标准页面容器（支持 tabList、breadcrumb）
- `ProCard` - 卡片容器
- `ProTable` - 高级表格（搜索、分页、操作）
- `ProForm` / `ModalForm` - 高级表单

### 表单组件
- `ProFormText` / `ProFormTextArea` - 文本输入
- `ProFormSelect` - 下拉选择
- `ProFormTreeSelect` - 树形选择
- `ProFormRadio` - 单选框
- `ProFormDigit` - 数字输入
- `ProFormSwitch` - 开关
- `ProFormDatePicker` - 日期选择

### 数据展示
- `Image` - 图片展示
- `Tag` - 标签
- `Transfer` - 穿梭框（成员管理）
- `Tree` - 树形组件（组织树、资源树）

## 🔧 开发指南

### 添加新页面

1. **创建页面组件**
```typescript
// src/pages/example/ExamplePage.tsx
import { PageContainer, ProTable } from '@ant-design/pro-components';

const ExamplePage: React.FC = () => {
  return (
    <PageContainer
      header={{
        title: '示例页面',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '示例' },
          ],
        },
      }}
    >
      <ProTable
        columns={[...]}
        request={loadData}
        rowKey="id"
      />
    </PageContainer>
  );
};

export default ExamplePage;
```

2. **添加路由** (`App.tsx`)
```typescript
const ExamplePage = lazy(() => import('@/pages/example/ExamplePage'));

<Route path="example" element={<ExamplePage />} />
```

3. **添加菜单** (`BasicLayout.tsx`)
```typescript
{
  key: '/example',
  icon: <AppstoreOutlined />,
  label: '示例',
}
```

### 添加新服务

```typescript
// src/services/example.service.ts
import { BaseService } from './base.service';
import { ExampleEntity } from '@/types/entity';

class ExampleService extends BaseService<ExampleEntity> {
  constructor() {
    super('/maxkey-mgt-api/example');
  }

  // 添加特定方法
  async customMethod(id: string) {
    return this.request.get(`${this.baseUrl}/custom/${id}`);
  }
}

export default new ExampleService();
```

## 🎨 主题密度配置

项目提供了三种主题密度选项，可全局控制 Ant Design Pro 组件的间距和布局：

- **宽松（loose）**：适合需要更多留白的场景
- **中等（medium）**：平衡的间距，适合大多数场景
- **紧凑（compact）**：最小间距，适合需要显示更多内容的场景（当前默认）

### 修改主题密度

编辑 `src/styles/theme.less` 文件，修改 `@density` 变量：

```less
@density: compact; // 可选值：loose | medium | compact
```

修改后需要重新编译样式文件才能生效。

### 主题变量说明

每种密度主题都定义了以下变量：
- **PageContainer**：页面容器的内边距
- **Card**：卡片的头部、主体内边距和底部间距
- **Table**：表格单元格和工具栏的内边距
- **Form**：表单项的间距和标签内边距
- **Modal**：模态框的头部、主体和底部内边距
- **Tabs**：标签页的内边距
- **Space**：间距组件的间距大小
- **Row**：行组件的默认 gutter 值

### 自定义样式

如果需要自定义某个组件的间距，可以在 `src/styles/global.less` 中直接覆盖样式，使用 `!important` 确保优先级。

## 📊 功能完成度

### 服务层: ✅ 100%
- 14+ 个核心服务类
- 60+ API 方法
- 完整的 CRUD 操作

### 类型系统: ✅ 100%
- 20+ 实体接口
- 完整字段定义

### 页面组件: ✅ 100%
- 用户管理、组织管理、用户组管理
- 应用管理、角色管理、资源管理、权限分配
- 在线会话、审计日志（5种类型）
- 系统配置（9个模块）

## 🐛 故障排除

### 端口冲突
修改 `vite.config.ts`:
```typescript
server: {
  port: 8528,  // 改为其他端口
}
```

### API 请求失败
1. 检查后端服务是否启动
2. 验证代理配置是否正确
3. 查看浏览器控制台网络请求

### 样式异常
```bash
rm -rf node_modules
npm install
```

## 📚 相关链接

- [Ant Design Pro 文档](https://pro.ant.design/)
- [MaxKey 官方文档](https://maxkey.top/)
- [React 官方文档](https://react.dev)
- [Vite 官方文档](https://vitejs.dev)

## 📝 更新日志

### v1.0.0 (2024-11-22)
- ✨ 完成所有核心页面组件
- ✨ 完成服务层架构（14+ 服务）
- ✨ 完成类型系统（20+ 实体）
- ✨ 采用 Ant Design Pro 组件
- ✨ 代码分割和懒加载
- ✨ TypeScript 类型安全

## 👥 团队

**ZeronEdge Team**

## 📄 许可证

MIT

## 🐛 常见错误处理

### "Clock moved backwards" 错误分析

#### 错误信息
```json
{
    "code": 2,
    "message": "Clock moved backwards. Refusing to generate id",
    "data": null
}
```

#### 错误来源

错误来自 `SnowFlakeId.java` 的 `nextId()` 方法。Snowflake 算法依赖系统时间戳生成唯一 ID。当检测到当前时间戳小于上次记录的时间戳时，会抛出此异常，以防止生成重复的 ID。

#### 可能的原因

1. **系统时钟被手动调整**
   - 服务器管理员手动修改了系统时间
   - 时间被向后调整（例如从 2024-01-02 调整到 2024-01-01）

2. **NTP 时间同步问题**
   - NTP 服务器时间不正确
   - 网络延迟导致时间同步跳跃
   - NTP 客户端配置错误

3. **虚拟机/容器时间同步问题**
   - Docker 容器时间与宿主机不同步
   - 虚拟机暂停/恢复后时间不同步
   - 容器重启后时间重置

4. **服务器重启问题**
   - 服务器重启后 BIOS 时间不正确
   - 时区配置错误

5. **多服务器时间不一致**
   - 集群环境中不同服务器时间不同步
   - 负载均衡导致请求在不同时间差的服务器间切换

#### 解决方案

##### 1. 检查系统时间同步

```bash
# 检查当前系统时间
date

# 检查 NTP 同步状态（Linux）
timedatectl status
ntpq -p

# 检查 NTP 同步状态（Windows）
w32tm /query /status
```

##### 2. 配置 NTP 时间同步

**Linux:**
```bash
# 安装 NTP
sudo apt-get install ntp  # Ubuntu/Debian
sudo yum install ntp     # CentOS/RHEL

# 启动 NTP 服务
sudo systemctl start ntpd
sudo systemctl enable ntpd

# 或者使用 systemd-timesyncd
sudo timedatectl set-ntp true
```

**Windows:**
```powershell
# 配置 Windows 时间服务
w32tm /config /manualpeerlist:"pool.ntp.org" /syncfromflags:manual /reliable:YES /update
w32tm /resync
```

##### 3. Docker 容器时间同步

```yaml
# docker-compose.yml
services:
  maxkey:
    image: maxkey/maxkey
    volumes:
      - /etc/localtime:/etc/localtime:ro  # 同步宿主机时间
    environment:
      - TZ=Asia/Shanghai  # 设置时区
```

##### 4. 修改 Snowflake 实现（临时方案）

如果需要容忍时钟回退，可以修改 `SnowFlakeId.java`：

```java
public synchronized long nextId() {
    long currStmp = getNewstmp();
    if (currStmp < lastStmp) {
        // 方案1: 等待时钟追上
        long offset = lastStmp - currStmp;
        if (offset <= 5) {  // 允许5毫秒内的回退
            try {
                Thread.sleep(offset + 1);
                currStmp = getNewstmp();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Interrupted during clock adjustment", e);
            }
        } else {
            // 方案2: 记录警告并继续（不推荐，可能导致ID重复）
            logger.warn("Clock moved backwards by {} ms, adjusting", offset);
            lastStmp = currStmp;
        }
    }
    // ... 原有逻辑
}
```

**注意：** 修改算法可能导致 ID 重复，不推荐在生产环境使用。

##### 5. 使用其他 ID 生成策略

在 `application.properties` 中配置：

```properties
# 使用 UUID 而不是 Snowflake
maxkey.id.strategy=UUID
```

##### 6. 监控和告警

建议添加监控来检测时间同步问题：

```bash
# 监控脚本示例
#!/bin/bash
TIME_DIFF=$(ntpdate -q pool.ntp.org 2>&1 | grep "offset" | awk '{print $10}')
if [ $(echo "$TIME_DIFF > 1.0" | bc) -eq 1 ]; then
    echo "WARNING: Time offset is $TIME_DIFF seconds"
    # 发送告警
fi
```

#### 预防措施

1. **定期检查时间同步**
   - 设置定时任务检查 NTP 同步状态
   - 监控系统时间偏移

2. **使用可靠的时间源**
   - 配置多个 NTP 服务器
   - 使用本地 NTP 服务器（如果有）

3. **容器环境**
   - 确保容器时间与宿主机同步
   - 使用 `--privileged` 模式（谨慎使用）

4. **集群环境**
   - 确保所有节点时间同步
   - 使用统一的时间源

#### 相关配置

MaxKey 的 ID 生成器配置在 `ApplicationAutoConfiguration.java`：

```java
@Bean
IdGenerator idGenerator(
    @Value("${maxkey.id.strategy:SnowFlake}") String strategy,
    @Value("${maxkey.id.datacenterId:0}") int datacenterId,
    @Value("${maxkey.id.machineId:0}") int machineId) {
    // ...
}
```

可以在 `application.properties` 中配置：

```properties
# ID 生成策略: SnowFlake 或 UUID
maxkey.id.strategy=SnowFlake
# 数据中心 ID (0-31)
maxkey.id.datacenterId=1
# 机器 ID (0-31)
maxkey.id.machineId=1
```

#### 总结

这个错误是 Snowflake 算法的保护机制，用于防止在时钟回退时生成重复的 ID。**最佳解决方案是确保系统时间正确同步**，而不是修改算法逻辑。

## 🙏 致谢

- [MaxKey](https://maxkey.top/) - 提供强大的 IAM 后端
- [Ant Design](https://ant.design/) - 优秀的 UI 组件库
- [Ant Design Pro](https://pro.ant.design/) - 企业级中后台解决方案
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
