import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface BaseNavbarProps {
  children: ReactNode;
}

function BaseNavbar({ children }: BaseNavbarProps) {
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 border-b bg-base-100 backdrop-blur-sm">
        <div className="flex items-center justify-between px-5 lg:px-10 py-4">
          <Link to="/" className="btn btn-ghost normal-case text-xl">Qumpl<b className="-mx-1">IA</b></Link>
          {children}
        </div>
      </div>
      <div className="pt-[1m] lg:pt-[6m] overflow-hidden"></div>
    </>
  );
}

export default BaseNavbar;
