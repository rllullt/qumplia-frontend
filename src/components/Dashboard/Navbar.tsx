import React from 'react';
import { FaBars, FaXmark } from 'react-icons/fa6';

interface DashboardNavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: () => boolean;
}

function DashboardNavbar({ onToggleSidebar, isSidebarOpen }: DashboardNavbarProps) {
  return (
    <>
      <div className="flex-none lg:hidden"> {/* Ocultar en pantallas grandes */}
        <button className="btn btn-square btn-ghost" onClick={onToggleSidebar}>
          {isSidebarOpen() && <FaXmark />}
          {!isSidebarOpen() && <FaBars />}
        </button>
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">Dashboard</a>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="User Avatar" src="https://daisyui.com/images/stock/photo-1534528741702-c0f7db1e8779.jpg" />
            </div>
          </div>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li><a>Profile</a></li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default DashboardNavbar;