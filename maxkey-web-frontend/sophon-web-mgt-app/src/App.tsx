import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import BasicLayout from '@/layouts/BasicLayout';
import UserLayout from '@/layouts/UserLayout';
import Login from '@/pages/user/Login';
import Dashboard from '@/pages/dashboard';
import UserList from '@/pages/user/UserList';

// 懒加载页面组件
const OrganizationList = lazy(() => import('@/pages/organization/OrganizationList'));
const GroupList = lazy(() => import('@/pages/group/GroupList'));
const GroupMembersList = lazy(() => import('@/pages/group/GroupMembersList'));
const ApplicationList = lazy(() => import('@/pages/application/ApplicationList'));
const AppsList = lazy(() => import('@/pages/permissions/AppsList'));
const RoleList = lazy(() => import('@/pages/role/RoleList'));
const ResourcesList = lazy(() => import('@/pages/permissions/ResourcesList'));
const PermissionAssignment = lazy(() => import('@/pages/permissions/PermissionAssignment'));
const RoleMembersList = lazy(() => import('@/pages/permissions/RoleMembersList'));
const OnlineSessionList = lazy(() => import('@/pages/session/OnlineSessionList'));
const LoginHistoryList = lazy(() => import('@/pages/audit/LoginHistoryList'));
const AccessLogList = lazy(() => import('@/pages/audit/AccessLogList'));
const SynchronizerLogList = lazy(() => import('@/pages/audit/SynchronizerLogList'));
const ConnectorLogList = lazy(() => import('@/pages/audit/ConnectorLogList'));
const SystemLogList = lazy(() => import('@/pages/audit/SystemLogList'));
const InstitutionsList = lazy(() => import('@/pages/config/InstitutionsList'));
const PasswordPolicyList = lazy(() => import('@/pages/config/PasswordPolicyList'));
const EmailSendersList = lazy(() => import('@/pages/config/EmailSendersList'));
const SmsProviderList = lazy(() => import('@/pages/config/SmsProviderList'));
const LdapContextList = lazy(() => import('@/pages/config/LdapContextList'));
const AccountsStrategyList = lazy(() => import('@/pages/config/AccountsStrategyList'));
const SynchronizersList = lazy(() => import('@/pages/config/SynchronizersList'));
const ConnectorsList = lazy(() => import('@/pages/config/ConnectorsList'));
const SocialsProviderList = lazy(() => import('@/pages/config/SocialsProviderList'));

// 加载中组件
const PageLoading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '400px' 
  }}>
    <Spin size="large" />
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          {/* 用户布局 - 登录页 */}
          <Route path="/user" element={<UserLayout />}>
            <Route path="login" element={<Login />} />
          </Route>

          {/* 基础布局 - 主应用 */}
          <Route path="/" element={<BasicLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* IDM - 身份管理 */}
            <Route path="idm">
              <Route path="users" element={<UserList />} />
              <Route path="organizations" element={<OrganizationList />} />
              <Route path="groups" element={<GroupList />} />
              <Route path="groupmembers" element={<GroupMembersList />} />
            </Route>

            {/* 应用管理 */}
            <Route path="apps">
              <Route index element={<ApplicationList />} />
              <Route path="oauth20" element={<ApplicationList />} />
              <Route path="saml20" element={<ApplicationList />} />
              <Route path="cas" element={<ApplicationList />} />
              <Route path="jwt" element={<ApplicationList />} />
            </Route>

            {/* 权限管理 */}
            <Route path="permissions">
              <Route path="apps">
                <Route index element={<AppsList />} />
                <Route path="resources" element={<ResourcesList />} />
                <Route path="permission" element={<PermissionAssignment />} />
                <Route path="roles" element={<RoleList />} />
                <Route path="rolemembers" element={<RoleMembersList />} />
              </Route>
              <Route path="roles" element={<RoleList />} />
              <Route path="resources" element={<ResourcesList />} />
              <Route path="permissions" element={<PermissionAssignment />} />
            </Route>

            {/* 访问控制 */}
            <Route path="access">
              <Route path="sessions" element={<OnlineSessionList />} />
            </Route>

            {/* 审计日志 */}
            <Route path="audit">
              <Route path="login-history" element={<LoginHistoryList />} />
              <Route path="access-log" element={<AccessLogList />} />
              <Route path="synchronizer-log" element={<SynchronizerLogList />} />
              <Route path="connector-log" element={<ConnectorLogList />} />
              <Route path="system-log" element={<SystemLogList />} />
            </Route>

            {/* 配置管理 */}
            <Route path="config">
              <Route path="institutions" element={<InstitutionsList />} />
              <Route path="passwordpolicy" element={<PasswordPolicyList />} />
              <Route path="emailsender" element={<EmailSendersList />} />
              <Route path="smsprovider" element={<SmsProviderList />} />
              <Route path="ldapcontext" element={<LdapContextList />} />
              <Route path="synchronizers" element={<SynchronizersList />} />
              <Route path="connectors" element={<ConnectorsList />} />
              <Route path="socialsproviders" element={<SocialsProviderList />} />
            </Route>
            {/* 账号管理 */}
            <Route path="accounts" element={<AccountsStrategyList />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
