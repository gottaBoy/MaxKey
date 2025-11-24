import { Outlet } from 'react-router-dom';
import LoginBackground from '@/components/LoginBackground/LoginBackground';
import './UserLayout.less';

const UserLayout: React.FC = () => {
  return (
    <div className="user-layout">
      <LoginBackground />
      <div className="user-layout-content">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;

