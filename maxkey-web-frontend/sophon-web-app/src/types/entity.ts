// 应用实体
export interface Application {
  id?: string;
  appName?: string;
  appCode?: string;
  protocol?: string;
  category?: string;
  iconBase64?: string;
  loginUrl?: string;
  inducer?: string;
  status?: number;
  [key: string]: any;
}

// 应用分类
export interface AppCategory {
  id: string;
  name: string;
}

// 在线会话
export interface OnlineSession {
  sessionId?: string;
  username?: string;
  displayName?: string;
  sourceIp?: string;
  location?: string;
  browser?: string;
  platform?: string;
  loginTime?: string;
  disabled?: boolean;
  [key: string]: any;
}

// 用户信息
export interface User {
  id?: string;
  username?: string;
  displayName?: string;
  gender?: number;
  gender_select?: string;
  pictureId?: string;
  pictureBase64?: string;
  employeeNumber?: string;
  windowsAccount?: string;
  mobile?: string;
  email?: string;
  userType?: string;
  userState?: string;
  str_status?: string;
  sortIndex?: number;
  authnType?: string;
  // 个人信息
  familyName?: string;
  middleName?: string;
  givenName?: string;
  nickName?: string;
  str_idType?: string;
  idCardNo?: string;
  str_married?: string;
  birthDate?: string;
  education?: string;
  graduateFrom?: string;
  graduateDate?: string;
  startWorkDate?: string;
  timeZone?: string;
  preferredLanguage?: string;
  webSite?: string;
  defineIm?: string;
  // 机构信息
  organization?: string;
  division?: string;
  departmentId?: string;
  department?: string;
  costCenter?: string;
  jobLevel?: string;
  jobTitle?: string;
  manager?: string;
  assistant?: string;
  workOfficeName?: string;
  entryDate?: string;
  quitDate?: string;
  // 机构扩展
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
  [key: string]: any;
}

// Passkey 信息
export interface PasskeyInfo {
  id?: string;
  credentialId?: string;
  displayName?: string;
  deviceType?: string;
  signatureCount?: number;
  createdDate?: string;
  lastUsedDate?: string;
  status?: number;
}

// 密码策略
export interface PasswordPolicy {
  minLength?: number;
  maxLength?: number;
  lowerCase?: number;
  upperCase?: number;
  digits?: number;
  specialChar?: number;
  policMessageList?: string[];
  [key: string]: any;
}

// 修改密码
export interface ChangePassword {
  id?: string;
  userId?: string;
  username?: string;
  displayName?: string;
  oldPassword?: string;
  password?: string;
  confirmPassword?: string;
}

// 社交关联
export interface SocialsAssociate {
  id?: string;
  icon?: string;
  provider?: string;
  providerName?: string;
  createdDate?: string;
  updatedDate?: string;
  status?: number;
  [key: string]: any;
}

// 时间令牌
export interface TimeBased {
  id?: string;
  displayName?: string;
  username?: string;
  digits?: number;
  period?: number;
  sharedSecret?: string;
  formatSharedSecret?: string;
  qrCode?: string;
  otpCode?: string;
  [key: string]: any;
}

// 登录日志
export interface LoginHistory {
  sessionId?: string;
  username?: string;
  displayName?: string;
  status?: string;
  authnType?: string;
  sourceIp?: string;
  location?: string;
  browser?: string;
  platform?: string;
  loginTime?: string;
  logoutTime?: string;
  [key: string]: any;
}

// 应用登录日志
export interface AccessLog {
  sessionId?: string;
  username?: string;
  displayName?: string;
  appName?: string;
  loginTime?: string;
  [key: string]: any;
}
