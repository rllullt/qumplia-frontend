import React from 'react';

function Navbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">QumpliA</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><a>Inicio</a></li>
          <li><a>Nosotros</a></li>
          <li><a>Servicios</a></li>
          <li><a>FAQ</a></li>
          <li><button className="btn btn-primary btn-sm rounded-full">Agenda una demo</button></li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;