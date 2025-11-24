import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import BasicLayout from '@/layouts/BasicLayout';
import UserLayout from '@/layouts/UserLayout';
import AppPanelLayout from '@/layouts/AppPanelLayout';

// 懒加载页面组件
const Login = lazy(() => import('@/pages/user/Login'));
const AppPanel = lazy(() => import('@/pages/dashboard/AppPanel'));
const Home = lazy(() => import('@/pages/dashboard/Home'));
const Sessions = lazy(() => import('@/pages/access/Sessions'));
const Profile = lazy(() => import('@/pages/config/Profile'));
const Passkey = lazy(() => import('@/pages/config/Passkey'));
const Password = lazy(() => import('@/pages/config/Password'));
const Mfa = lazy(() => import('@/pages/config/Mfa'));
const SocialsAssociate = lazy(() => import('@/pages/config/SocialsAssociate'));
const TimeBased = lazy(() => import('@/pages/config/TimeBased'));
const AuditLogins = lazy(() => import('@/pages/audit/AuditLogins'));
const AuditLoginApps = lazy(() => import('@/pages/audit/AuditLoginApps'));

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
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/user" element={<UserLayout />}>
          <Route path="login" element={
            <Suspense fallback={<PageLoading />}>
              <Login />
            </Suspense>
          } />
        </Route>
        {/* 独立的应用面板布局 */}
        <Route path="/" element={<AppPanelLayout />}>
          <Route index element={<Navigate to="/app-panel" replace />} />
          <Route
            path="app-panel"
            element={
              <Suspense fallback={<PageLoading />}>
                <AppPanel />
              </Suspense>
            }
          />
        </Route>
        {/* 带框架的功能页面 */}
        <Route path="/dashboard" element={<BasicLayout />}>
          <Route index element={<Navigate to="/dashboard/home" replace />} />
          <Route
            path="home"
            element={
              <Suspense fallback={<PageLoading />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="sessions"
            element={
              <Suspense fallback={<PageLoading />}>
                <Sessions />
              </Suspense>
            }
          />
          <Route
            path="config/profile"
            element={
              <Suspense fallback={<PageLoading />}>
                <Profile />
              </Suspense>
            }
          />
          <Route
            path="config/passkey"
            element={
              <Suspense fallback={<PageLoading />}>
                <Passkey />
              </Suspense>
            }
          />
          <Route
            path="config/password"
            element={
              <Suspense fallback={<PageLoading />}>
                <Password />
              </Suspense>
            }
          />
          <Route
            path="config/mfa"
            element={
              <Suspense fallback={<PageLoading />}>
                <Mfa />
              </Suspense>
            }
          />
          <Route
            path="config/socialsassociate"
            element={
              <Suspense fallback={<PageLoading />}>
                <SocialsAssociate />
              </Suspense>
            }
          />
          <Route
            path="config/timebased"
            element={
              <Suspense fallback={<PageLoading />}>
                <TimeBased />
              </Suspense>
            }
          />
          <Route
            path="audit/audit-logins"
            element={
              <Suspense fallback={<PageLoading />}>
                <AuditLogins />
              </Suspense>
            }
          />
          <Route
            path="audit/audit-login-apps"
            element={
              <Suspense fallback={<PageLoading />}>
                <AuditLoginApps />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

