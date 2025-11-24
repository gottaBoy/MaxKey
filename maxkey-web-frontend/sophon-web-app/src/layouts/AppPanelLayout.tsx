import React from 'react';
import { Outlet } from 'react-router-dom';
import './AppPanelLayout.less';

const AppPanelLayout: React.FC = () => {
  return (
    <div className="app-panel-layout">
      <Outlet />
    </div>
  );
};

export default AppPanelLayout;

