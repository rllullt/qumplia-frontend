import React from 'react';
import { Link } from 'react-router-dom'; // Si estás usando React Router

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const sidebarClasses = `drawer-side z-20 ${isOpen ? '' : '-translate-x-full'}`;

  return (
    <div className={sidebarClasses}>
      <label htmlFor="dashboard-drawer" className="drawer-overlay" onClick={onClose}></label>
      <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        <li className="mb-2">
          <Link to="/dashboard" className="font-bold text-lg">
            QumpliA Dashboard
          </Link>
        </li>
        <li><Link to="/overview">Overview</Link></li>
        <li><Link to="/users">Users</Link></li>
        <li><Link to="/reports">Reports</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        {/* ... más elementos del menú ... */}
      </ul>
    </div>
  );
}

export default Sidebar;
