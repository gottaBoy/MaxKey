import React from 'react';
import { Outlet } from 'react-router-dom';
import './UserLayout.less';

const UserLayout: React.FC = () => {
  return (
    <div className="user-layout">
      <div className="user-layout-content">
        <div className="user-layout-top">
          <div className="user-layout-header">
            <img src="/logo.svg" alt="logo" className="logo" />
            <span className="title">SOPHON SSO</span>
          </div>
          <div className="user-layout-desc">
            ZERON单点登录与身份认证管理平台
          </div>
        </div>
        <div className="user-layout-main">
          <Outlet />
        </div>
      </div>
      <div className="user-layout-footer">
        <div className="links">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            帮助
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            隐私
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            条款
          </a>
        </div>
        <div className="copyright">
          Copyright © 2025 Sophon SSO
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
