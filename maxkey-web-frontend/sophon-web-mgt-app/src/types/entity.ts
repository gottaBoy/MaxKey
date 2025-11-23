// 基础实体
export interface BaseEntity {
  id: string;
  instId: string;
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
}

// 用户信息
export interface UserInfo extends BaseEntity {
  username: string;
  displayName: string;
  nickName?: string;
  nameZh?: string;
  nameEn?: string;
  departmentId?: string;
  department?: string;
  orgId?: string;
  email?: string;
  mobile?: string;
  workPhone?: string;
  idCard?: string;
  employeeNumber?: string;
  jobTitle?: string;
  gender?: number; // 1: 男, 2: 女
  birthDate?: string;
  status: number; // 0: 禁用, 1: 启用, 2: 未激活, 4: 禁用, 5: 锁定, 9: 已删除
  userType?: string; // EMPLOYEE, SUPPLIER, CUSTOMER, CONTRACTOR, DEALER, PARTNER, EXTERNAL, INTERN, TEMP
  userState?: string; // RESIDENT, WITHDRAWN, INACTIVE, RETIREE
  password?: string;
  decipherable?: string;
  windowsAccount?: string;
  theme?: string;
  locale?: string;
  timeZone?: string;
  loginCount?: number;
  lastLoginTime?: string;
  lastLoginIp?: string;
  gridList?: number;
  sortIndex?: number;
  authnType?: string; // 认证方式: 0, 1, 2, 3
  
  // 个人信息
  familyName?: string;
  middleName?: string;
  givenName?: string;
  idType?: number; // 证件类型: 0, 1, 2, 3, 4
  idCardNo?: string;
  married?: number; // 婚姻状况: 0, 1, 2, 3, 4
  education?: string;
  graduateFrom?: string;
  graduateDate?: string;
  startWorkDate?: string;
  preferredLanguage?: string;
  webSite?: string;
  defineIm?: string;
  
  // 机构信息
  organization?: string;
  division?: string;
  costCenter?: string;
  jobLevel?: string;
  managerId?: string;
  manager?: string;
  assistantId?: string;
  assistant?: string;
  entryDate?: string;
  quitDate?: string;
  workOfficeName?: string;
  workPhoneNumber?: string;
  workEmail?: string;
  workCountry?: string;
  workRegion?: string;
  workLocality?: string;
  workStreetAddress?: string;
  workPostalCode?: string;
  workFax?: string;
  
  // 家庭信息
  homeEmail?: string;
  homePhoneNumber?: string;
  homeFax?: string;
  homePostalCode?: string;
  homeCountry?: string;
  homeRegion?: string;
  homeLocality?: string;
  homeStreetAddress?: string;
  
  // 头像相关
  pictureId?: string;
  pictureBase64?: string;
  picture?: string;
}

// 组织机构
export interface Organization extends BaseEntity {
  orgCode: string;
  orgName: string;
  fullName?: string;
  codePath?: string;
  namePath?: string;
  parentId?: string;
  parentCode?: string;
  parentName?: string;
  type?: string;
  level?: number;
  division?: string;
  sortOrder?: number;
  sortIndex?: number;
  contact?: string;
  phone?: string;
  email?: string;
  fax?: string;
  country?: string;
  region?: string;
  locality?: string;
  street?: string;
  workRegion?: string;
  address?: string;
  postalCode?: string;
  description?: string;
  status: number;
  hasChild?: boolean;
  instId?: string;
}

// 用户组
export interface Group extends BaseEntity {
  groupId?: string; // 组ID（用于API）
  groupCode?: string; // 组编码（用于显示和编辑）
  groupName: string;
  groupType?: string;
  category?: string;
  description?: string;
  resumeTime?: string;
  suspendTime?: string;
  status: number;
  dynamic?: number;
  filters?: string;
  orgIdsList?: string; // 组织ID列表（逗号分隔）
}

// 组成员
export interface GroupMember extends BaseEntity {
  groupId: string;
  groupName?: string;
  userId: string;
  username?: string;
  displayName?: string;
  memberType?: string;
  gender?: number; // 1: 女, 其他: 男
  category?: string; // static, dynamic, app
  department?: string;
  jobTitle?: string;
}

// 应用信息
export interface Application extends BaseEntity {
  appId: string;
  appName: string;
  appCode: string;
  protocol: string; // CAS, OAUTH20, SAML20, JWT, FORMBASED, TOKENBASED
  category?: string;
  icon?: string;
  loginUrl?: string;
  logoutUrl?: string;
  logoutType?: number;
  vendorId?: string;
  vendorName?: string;
  visible?: number;
  sortOrder?: number;
  status: number;
  description?: string;
  credential?: string;
  adapterId?: string;
  adapterName?: string;
  isAdapter?: number;
  inducer?: string;
  // 扩展属性
  isExtendAttr?: number;
  extendAttr?: string;
}

// OAuth 2.0 详情
export interface AppsOAuth20Details extends BaseEntity {
  appId: string;
  clientId: string;
  clientSecret?: string;
  redirectUri?: string;
  grants?: string;
  approved?: number;
  accessTokenValidity?: number;
  refreshTokenValidity?: number;
  scope?: string;
  resourceIds?: string;
  authorities?: string;
  subject?: string;
  signature?: string;
  algorithm?: string;
  algorithmKey?: string;
  encryptionMethod?: string;
  pkce?: string;
  approvalPrompt?: string;
  userInfoResponse?: string;
}

// SAML 2.0 详情
export interface AppsSamlDetails extends BaseEntity {
  appId: string;
  entityId: string;
  spAcsUrl: string;
  binding?: string;
  nameidFormat?: string;
  validityInterval?: number;
  audience?: string;
  recipient?: string;
  encrypted?: number;
  signature?: string;
  digestMethod?: string;
  signatureMethod?: string;
  keystore?: string;
  entityIdAlias?: string;
  certSubject?: string;
  certIssuer?: string;
  certExpiration?: string;
}

// CAS 详情
export interface AppsCasDetails extends BaseEntity {
  appId: string;
  service: string;
  callbackUrl?: string;
}

// JWT 详情
export interface AppsJwtDetails extends BaseEntity {
  appId: string;
  redirectUri?: string;
  signature?: string;
  algorithm?: string;
  algorithmKey?: string;
  encryptionMethod?: string;
  subject?: string;
  expires?: number;
  tokenType?: string;
}

// 角色
export interface Role extends BaseEntity {
  roleId: string;
  roleCode?: string;
  roleName: string;
  category?: string; // static, dynamic, app
  description?: string;
  filters?: string;
  orgId?: string;
  orgIdsList?: string; // 组织ID列表（逗号分隔）
  appId?: string;
  appName?: string;
  resumeTime?: string;
  suspendTime?: string;
  status: number;
  dynamic?: number;
}

// 角色成员
export interface RoleMember extends BaseEntity {
  roleId: string;
  roleName?: string;
  userId: string;
  username?: string;
  displayName?: string;
  memberType?: string;
}

// 资源
export interface Resource extends BaseEntity {
  resourceId: string;
  resourceName: string;
  displayName?: string;
  resourceType?: string; // MENU, PAGE, MODULE, ELEMENT, BUTTON, FILE, DATA, OTHER
  resourceUrl?: string;
  url?: string; // 兼容字段
  permission?: string;
  resourceAction?: string;
  resourceStyle?: string;
  resourceIcon?: string;
  parentId?: string;
  parentName?: string;
  appId?: string;
  appName?: string;
  sortIndex?: number;
  sortOrder?: number; // 兼容字段
  status: number;
  description?: string;
}

// 权限
export interface Permission extends BaseEntity {
  permissionId: string;
  appId: string;
  appName?: string;
  roleId: string;
  roleName?: string;
  resourceId: string;
  resourceName?: string;
}

// 登录历史
export interface LoginHistory extends BaseEntity {
  sessionId: string;
  userId: string;
  username: string;
  displayName?: string;
  loginType?: string;
  message?: string;
  code?: string;
  provider?: string;
  sourceIp?: string;
  browser?: string;
  platform?: string;
  application?: string;
  loginUrl?: string;
  loginTime?: string;
}

// 在线会话
export interface OnlineSession extends BaseEntity {
  sessionId: string;
  userId: string;
  username: string;
  displayName?: string;
  sessionStatus?: number;
  sourceIp?: string;
  startTime?: string;
  lastAccessTime?: string;
}

// 机构信息
export interface Institution extends BaseEntity {
  institutionId: string;
  institutionName: string;
  fullName?: string;
  domain?: string;
  logo?: string;
  country?: string;
  province?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  division?: string;
  status: number;
}

// 树节点
export interface TreeNode {
  key: string;
  title: string;
  value?: string;
  isLeaf?: boolean;
  children?: TreeNode[];
  // 额外数据
  [key: string]: any;
}
