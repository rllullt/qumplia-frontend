import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      {/* Aquí puedes poner un nav, sidebar, etc. */}
      <Outlet />
    </div>
  );
}

export default DashboardLayout;
