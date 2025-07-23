import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Si estás usando React Router
import EzSwitchVara from '@/pages/Home/EzSwitchVara';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  // const sidebarClasses = `drawer-side z-20 shadow-md rounded-r-lg ${isOpen ? '' : '-translate-x-full lg:translate-x-0'}`;
  // const sidebarClasses = `w-64 bg-gray-800 text-white p-4 drawer-side z-20 shadow-md rounded-r-lg ${isOpen ? '' : '-translate-x-full lg:translate-x-0'}`;
  const sidebarClasses = `
    fixed top-0 left-0 h-full w-64
    bg-gray-800 text-white
    transform transition-transform
    z-40
    ${ isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0' }
  `;
  
  const location = useLocation();

  const isActive = (path: string) => location.pathname === `/dashboard/${path}`;

  const handleLinkClick = (path: string, e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (isActive(path)) {
      e.preventDefault(); // Do not navigate if the link is already active
    } else {
      onClose(); // Close sidebar if navigation is valid
    }
  };

  return (
    // <aside className="w-64 bg-gray-800 text-white p-4">
    //     <h2 className="text-xl font-bold mb-4">Dashboard</h2>
    //     <nav className="space-y-2">
    //       <Link to="/" className="block hover:underline">Inicio</Link>
    //     </nav>
    // </aside>
    <aside className={sidebarClasses}>
      <label htmlFor="dashboard-drawer" className="drawer-overlay lg:hidden" onClick={onClose}></label>
      <ul className="menu p-4 w-full min-h-full bg-base-200 text-base-content pt-20 lg:pt-4">
        <li className="mb-2">
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            Qumpl<b className="-mx-1">IA</b>
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/overview"
            onClick={e => handleLinkClick('overview', e)}
            className={isActive('overview') ? 'font-semibold text-primary' : ''}
          >
            Overview
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/campaigns"
            onClick={e => handleLinkClick('campaigns', e)}
            className={isActive('campaigns') ? 'font-semibold text-primary' : ''}
          >
            Campañas
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/new-campaign"
            onClick={e => handleLinkClick('new-campaign', e)}
            className={isActive('new-campaign') ? 'font-semibold text-primary' : ''}
          >
            Nueva campaña
          </Link>
        </li>
        <li>
          <EzSwitchVara />
        </li>
        {/* <li>
          <Link
            to="/dashboard/users"
            onClick={e => handleLinkClick('users', e)}
            className={isActive('users') ? 'font-semibold text-primary' : ''}
          >
            Users
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/reports"
            onClick={e => handleLinkClick('reports', e)}
            className={isActive('reports') ? 'font-semibold text-primary' : ''}
          >
            Reports
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/settings"
            onClick={e => handleLinkClick('settings', e)}
            className={isActive('settings') ? 'font-semibold text-primary' : ''}
          >
            Settings
          </Link>
        </li> */}
      </ul>
    </aside>
  );
}

export default Sidebar;
